import mongoose from "mongoose";
import Item from "../models/itemModel.js";
import Exam from "../models/examModel.js";

// ----------求目標函數---------- //
// theta: 等級能力值（由等級1~5）
// d: 目標訊息量（由等級1~5）
const theta = [-2, -1, 0, 1, 2];
const d = [5, 7, 20, 6, 4];
const a = 1.7
const MAX_FITNESS = Number(0);

// b_i: 第i題的難度
// b: 為每一題難度的陣列
function generateB(items) {
    let b = [];
    for (let i = 0; i < items.length; i++) {
        // 底下減3是因為資料庫難度是"1~5"，但論文會有正負範圍，故減3使範圍改為"-2~2"
        b.push(items[i].difficulty - 3);
    }
    return b;
}

// P_i(θ_j): 能力為θ_j的受試者答對第i題的機率
function P_i(theta_j, b_i) {
    return 1 / (1 + Math.exp(-a * (theta_j - b_i)));
}

// Q_i(θ_j): 能力為θ_j的受試者答錯第i題的機率
function Q_i(P_i) {
    return 1 - P_i;
}

// I_i(θ_j): 第i題題目的訊息量
function I_i(theta_j, b_i) {
    const P = P_i(theta_j, b_i);
    const Q = Q_i(P);
    return (a ** 2) * P * Q;
}

// O_j: 所有選中的題目的訊息量總和
function O_j(theta_j, b, items, X_i) {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += I_i(theta_j, b[i]) * X_i[i];
    }
    return sum;
}

// 目標函式
function objective_function(items, X_i, theta, b, d) {
    let sum = 0;
    for (let j = 0; j < d.length; j++) {
        const O = O_j(theta[j], b, items, X_i);
        sum += ((d[j] - O) ** 2);
    }
    return sum;
}

// ----------限制函式---------- //
// 限制函式1: 題目形式填充題>=10、計算題>=5，回傳true/false
function constraint1(items, X_i) {
    const calculationFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.format === "calculation"
    )
    const fillInFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.format === "fillIn"
    )
    return calculationFilterArr.length >= 5 && fillInFilterArr.length >= 5;
}
// 限制函式2: 題型有五類，每一類都>=3，回傳true/false
function constraint2(items, X_i) {
    const limitFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.type === "limit"
    )
    const differentiationFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.type === "differentiation"
    )
    const integrationFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.type === "integration"
    )
    const seriesFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.type === "series"
    )
    const vectorFilterArr = items.filter((item, index) =>
        X_i[index] === 1 && item.type === "vector"
    )
    return limitFilterArr.length >= 1
        && differentiationFilterArr.length >= 1
        && integrationFilterArr.length >= 1
        && seriesFilterArr.length >= 1
        && vectorFilterArr.length >= 1;
}
// 限制函式3: 測驗的題目數量=20題
function constraint3(X_i) {
    return X_i.filter(x => x === 1).length === 20;
}

// ----------基因演算法各函式---------- //
// Initialization: 初始化族群
function initializationPopulation(populationSize, chromosomeLength, onesCount) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let chromosome = Array(chromosomeLength).fill(0);
        let onesIndices = new Set();
        while (onesIndices.size < onesCount) {
            onesIndices.add(Math.floor(Math.random() * chromosomeLength));
        }
        onesIndices.forEach(index => {
            chromosome[index] = 1;
        });
        population.push(chromosome);
    }
    return population;
}

// Evalutate: 針對每一個chromosome計算適應度
// 用來對population每一個chromosome轉換成目標函數值或0 輪盤就轉不到他
function fitnessFunction(items, X_i, theta, b, d) {
    if (!constraint1(items, X_i) || !constraint2(items, X_i) || !constraint3(X_i)) {
        // 只要不符合限制條件的chromosome，都回傳極小值，之後被選擇的機會才能大幅減少
        return Number.MAX_VALUE;
    }
    // 其餘符合者，就回傳目標函數計算出來的值
    return objective_function(items, X_i, theta, b, d);
}
// 結果要求出最小值 故不合constraint者給無限大
function feasibleFitnessFunction(items, X_i, theta, b, d) {
    if (!constraint1(items, X_i) || !constraint2(items, X_i) || !constraint3(X_i)) {
        // 只要不符合限制條件的chromosome，都回傳極小值，之後被選擇的機會才能大幅減少
        return Number.MAX_VALUE;
    }
    // 其餘符合者，就回傳目標函數計算出來的值
    return objective_function(items, X_i, theta, b, d);
}

// Selection: 利用roulette wheel輪盤法選擇
// 適應度越大，代表佔適應度總值越大，越有機會被選中
function select(population, fitnesses) {
    const totalFitness = fitnesses.reduce((a, b) => a + b, 0); // 總適應度
    const selectionProbs = fitnesses.map(fitness => fitness / totalFitness); //每個染色體選中機率
    const rand = Math.random(); // 上一行機率為0~1之間，故隨機產生一個0~1間的數字
    let sum = 0;
    // 他會開始輪流跑每個染色體，把機率相加，只要一超過隨機的rand值，就是指到我們要的個體（染色體）了
    // 若跑完所有染色體，把機率相加仍無法超過rand值，則直接返回population裡最後一個個體（染色體）
    for (let i = 0; i < population.length; i++) {
        sum += selectionProbs[i];
        if (rand < sum) {
            return population[i];
        }
    }
    return population[population.length - 1];
}

//Crossover: 拿select function選出來最優秀的染色體作為父/母，利用單點交配產生子代
function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));
    return [child1, child2];
}

// Mutation: 要先給定突變率，paper上提到0.01~0.0001是最適合的突變率
// 遍歷單個染色體陣列中每個元素，以隨機方式做突變：0->1、1->0
function mutate(chromosome, mutationRate) {
    for (let i = 0; i < chromosome.length; i++) {
        if (Math.random() < mutationRate) {
            chromosome[i] = 1 - chromosome[i];
        }
    }
    return chromosome;
}

// 其他funtcion
// 1. 按權重隨機選擇
function weightedRandomChoice(population, weights, k) {
    let choices = [];
    let totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    for (let i = 0; i < k; i++) {
        let rand = Math.random() * totalWeight;
        for (let j = 0; j < population.length; j++) {
            if (rand < weights[j]) {
                choices.push(population[j]);
                break;
            }
            rand -= weights[j];
        }
    }
    return choices;
}
// 2. 權重越大，影響力越小
function invertWeights(weights) {
    const maxWeight = Math.max(...weights);
    return weights.map(weight => maxWeight - weight + 1);
}
// Select
function randomChoices(parents) {
    let randomNum = Math.floor(Math.random() * (parents.length));
    return parents[randomNum];
}

// Check
function check(firstBestIndices, X_i) {
    // 確保不選擇第一個最佳解中的題目
    let allValid = true;
    firstBestIndices.forEach(index => {
        if (X_i[index] !== 0) {
            allValid = false;
        }
    });
    return allValid;
}

// ----------主要程式碼----------- //
// POST: 利用基因演算法建立測驗並存至DB
const generateExam = async (req, res) => {
    const items = await Item.find({}).sort({ createdAt: -1 });
    const popSize = 1000; // 族群大小
    const numGenerations = 50; //演化到那一代
    const mutationRate = 0.01; //突變率
    const chromosomeLength = items.length;
    const onesCount = 20; // 每個染色體中1的個數
    const b = generateB(items);
    let parents1 = [];
    let parents2 = [];

    // ----------第一個最佳解---------- //
    // Initialize
    let population = initializationPopulation(popSize, chromosomeLength, onesCount);
    let bestSolution1 = null;
    let bestFitness1 = Number.NEGATIVE_INFINITY;

    //找第一個最佳解: 以下開始迴圈做演化，每一圈代表演化了一代
    for (let generation = 0; generation < numGenerations; generation++) {
        // Evaluation
        // 將先前建立的population陣列的解放入objective_function計算
        let fitness = population.map(p => objective_function(items, p, theta, b, d));
        // 從先前建立的population陣列中挑選出符合constraint1~3的解
        let feasible_population = population.filter(p => {
            constraint1(items, p) && constraint2(items, p) && constraint3(p)
        });
        console.log(`Evaluate ${generation + 1}`);

        // Selection
        if (feasible_population.length > 0) {
            // 只計算那些符合constraint1~3的解
            let feasible_fitness = feasible_population.map(p => objective_function(items, p, theta, b, d));
            let invert_feasible_fitness = invertWeights(feasible_fitness);
            parents1 = weightedRandomChoice(feasible_population, invert_feasible_fitness, popSize);
        } else {
            while (parents1.length < popSize) {
                let potential_parents = weightedRandomChoice(population, fitness, 1)[0];
                if (constraint1(items, potential_parents) && constraint2(items, potential_parents) && constraint3(potential_parents)) {
                    parents1.push(potential_parents);
                }
            }
        }
        console.log(`Selection ${generation + 1}`);

        // Crossover
        let offSpring = [];
        while (offSpring.length < popSize) {
            let parent1 = randomChoices(parents1);
            let parent2 = randomChoices(parents1);
            const [child1, child2] = crossover(parent1, parent2);
            offSpring.push(child1);
            offSpring.push(child2);
        }
        console.log(`Crossover ${generation + 1}`);

        // Mutation
        for (let i = 0; i < popSize; i++) {
            mutate(offSpring[i], mutationRate);
        }
        console.log(`Mutation ${generation + 1}`);

        // Elitism
        if (bestSolution1) {
            offSpring[0] = bestSolution1;
        }
        console.log(`Elitism ${generation + 1}`);

        population = offSpring;
        // Find the best feasible solution
        let feasible_solutions = population.filter(p => {
            return constraint1(items, p) && constraint2(items, p) && constraint3(p)
        });
        if (feasible_solutions.length > 0) {
            const fitnesses1 = feasible_solutions.map(individual => feasibleFitnessFunction(items, individual, theta, b, d));
            const bestIndex1 = fitnesses1.indexOf(Math.min(...fitnesses1));
            bestSolution1 = feasible_solutions[bestIndex1];
            bestFitness1 = fitnesses1;
        };
    }
    // console.log(bestSolution1.filter(x => x === 1).length)
    // console.log(bestFitness1)
    // console.log(bestSolution1.forEach((p, index) => {
    //     if (p === 1) {
    //         console.log(index)
    //         console.log(items[index])
    //     }
    // }))

    // 記錄第一個最佳解的索引
    let firstBestIndices = bestSolution1.map((value, index) => value === 1 ? index : -1).filter(index => index !== -1);

    // ----------第二個最佳解---------- //
    // Initialize
    let population2 = initializationPopulation(popSize, chromosomeLength, onesCount);
    let bestSolution2 = null;
    let bestFitness2 = Number.NEGATIVE_INFINITY;

    //找第一個最佳解: 以下開始迴圈做演化，每一圈代表演化了一代
    for (let generation = 0; generation < numGenerations; generation++) {
        // Evaluation
        // 將先前建立的population陣列的解放入objective_function計算
        let fitness = population2.map(p => objective_function(items, p, theta, b, d));
        // 從先前建立的population陣列中挑選出符合constraint1~3的解
        let feasible_population = population2.filter(p => {
            constraint1(items, p) && constraint2(items, p) && constraint3(p) && check(firstBestIndices, p)
        });
        console.log(`Evaluate ${generation + 1}`);

        // Selection
        if (feasible_population.length > 0) {
            // 只計算那些符合constraint1~3的解
            let feasible_fitness = feasible_population.map(p => objective_function(items, p, theta, b, d));
            let invert_feasible_fitness = invertWeights(feasible_fitness);
            parents2 = weightedRandomChoice(feasible_population, invert_feasible_fitness, popSize);
        } else {
            while (parents2.length < popSize) {
                let potential_parents = weightedRandomChoice(population2, fitness, 1)[0];
                if (constraint1(items, potential_parents) && constraint2(items, potential_parents) && constraint3(potential_parents) && check(firstBestIndices, potential_parents)) {
                    parents2.push(potential_parents);
                }
            }
        }
        console.log(`Selection ${generation + 1}`);

        // Crossover
        let offSpring = [];
        while (offSpring.length < popSize) {
            let parent1 = randomChoices(parents2);
            let parent2 = randomChoices(parents2);
            const [child1, child2] = crossover(parent1, parent2);
            offSpring.push(child1);
            offSpring.push(child2);
        }
        console.log(`Crossover ${generation + 1}`);

        // Mutation
        for (let i = 0; i < popSize; i++) {
            mutate(offSpring[i], mutationRate);
        }
        console.log(`Mutation ${generation + 1}`);

        // Elitism
        if (bestSolution2) {
            offSpring[0] = bestSolution2;
        }
        console.log(`Elitism ${generation + 1}`);

        population2 = offSpring;
        // Find the best feasible solution
        let feasible_solutions = population2.filter(p => {
            return constraint1(items, p) && constraint2(items, p) && constraint3(p)
        });
        if (feasible_solutions.length > 0) {
            const fitnesses2 = feasible_solutions.map(individual => feasibleFitnessFunction(items, individual, theta, b, d));
            const bestIndex2 = fitnesses2.indexOf(Math.min(...fitnesses2));
            bestSolution2 = feasible_solutions[bestIndex2];
            bestFitness2 = fitnesses2;
        };
    }
    // console.log(bestSolution2.filter(x => x === 1).length)
    // console.log(bestFitness2);
    // console.log(bestSolution2.forEach((p, index) => {
    //     if (p === 1) {
    //         console.log(index)
    //         console.log(items[index])
    //     }
    // }))

    // ----------結果---------- //
    const idArr = [];
    bestSolution1.forEach((p, index) => {
        if (p === 1) {
            console.log(index)
            console.log(items[index]._id)
            idArr.push(items[index]._id)
        }
    })
    bestSolution2.forEach((p, index) => {
        if (p === 1) {
            console.log(index)
            console.log(items[index]._id)
            idArr.push(items[index]._id)
        }
    })

    try {
        const exam = await Exam.create({ idArr });
        res.status(200).json(exam);
    } catch {
        res.status(400).json({ error: error.message });
    }
}

// GET: 取得所有測驗
const getExams = async (req, res) => {
    const exams = await Exam.find({}).sort({ createdAt: -1 });
    res.status(200).json(exams);
}

// GET: 取得單一測驗的內容
const getExam = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such exam" });
    }

    try {
        // 查找測驗
        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ error: "No such exam" });
        }

        // 查找相關的項目
        const itemsArr = [];
        for (const i of exam.idArr) {
            const item = await Item.findById(i);
            if (item) {
                itemsArr.push(item);
            }
        }

        // 返回結果
        res.status(200).json(itemsArr);
    } catch (error) {
        // 處理錯誤
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export { generateExam, getExams, getExam };