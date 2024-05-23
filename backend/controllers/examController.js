import Item from "../models/itemModal.js";

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
        console.log(d[j], O)
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
    return calculationFilterArr.length >= 5 && fillInFilterArr.length >= 10;
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
    return limitFilterArr.length >= 3
        && differentiationFilterArr.length >= 3
        && integrationFilterArr.length >= 3
        && seriesFilterArr.length >= 3
        && vectorFilterArr.length >= 3;
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
        return Number(0);
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

// 主要程式碼
const generateExam = async (req, res) => {
    const items = await Item.find({}).sort({ createdAt: -1 });
    const popSize = 1000; // 族群大小
    const numGenerations = 50; //演化到那一代
    const mutationRate = 0.01; //突變率
    const chromosomeLength = items.length;
    const onesCount = 20; // 每個染色體中1的個數
    const b = generateB(items);

    //Initialize
    let population = initializationPopulation(popSize, chromosomeLength, onesCount);

    //找第一個最佳解: 以下開始迴圈做演化，每一圈代表演化了一代
    for (let generation = 0; generation < numGenerations; generation++) {
        console.log(generation);
        // Evaluate: 計算適應度
        const fitnesses = population.map(individual => fitnessFunction(items, individual, theta, b, d));

        // 新的族群
        const newPopulation = [];
        while (newPopulation.length < popSize) {
            // Select: 選擇出適應度可能為最佳的父/母
            const parent1 = select(population, fitnesses);
            const parent2 = select(population, fitnesses);
            // Crossover: 把選出的父母交配產生子代
            const [child1, child2] = crossover(parent1, parent2);
            // Mutation: 做突變
            const mutateChild1 = mutate(child1, mutationRate);
            const mutateChild2 = mutate(child2, mutationRate);
            if (constraint3(mutateChild1)) {
                newPopulation.push(mutateChild1);
            }
            if (constraint3(mutateChild2)) {
                newPopulation.push(mutateChild2);
            }
        }
        // 更新族群
        population = newPopulation;
    }

    // 找到第一個最佳解
    const fitnesses1 = population.map(individual => feasibleFitnessFunction(items, individual, theta, b, d));
    const bestIndex1 = fitnesses1.indexOf(Math.min(...fitnesses1));
    const bestSolution1 = population[bestIndex1];

    console.log(bestSolution1)
    console.log(population[bestIndex1 % items.length].forEach((p, index) => {
        if(p === 1){
            console.log(index)
            console.log(items[index])
            // return items[index];
        }
    }))
    console.log(Math.min(...fitnesses1))
    console.log()

    res.status(200).json(items)
}

export { generateExam };