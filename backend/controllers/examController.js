import Item from "../models/itemModal.js";

// theta: 等級能力值（由等級1~5）
// d: 目標訊息量（由等級1~5）
const theta = [-2, -1, 0, 1, 2];
const d = [5, 7, 20, 6, 4];
const a = 1.7

// b_i: 第i題的難度
// b: 為每一題難度的陣列
function generateB(items){
    let b = [];
    for(let i = 0; i < items.length; i++){
        b.push(items[i].difficulty);
    }
    return b;
}

// P_i(θ_j): 能力為θ_j的受試者答對第i題的機率
function P_i(theta_j, b_i){
    return 1 / (1 + Math.exp(-a * (theta_j - b_i)));
}

// Q_i(θ_j): 能力為θ_j的受試者答錯第i題的機率
function Q_i(P_i){
    return 1 - P_i;
}

// I_i(θ_j): 第i題題目的訊息量
function I_i(theta_j, b_i){
    const P = P_i(theta_j, b_i);
    const Q = Q_i(P);
    return (a ** 2) * P * Q;
}

// O_j: 所有選中的題目的訊息量總和
function O_j(theta_j, b, items, X_i){
    let sum = 0;
    for(let i = 0; i < items.length; i++){
        sum += I_i(theta_j, b[i]) * X_i[i];
    }
    return sum;
}

// 目標函式
function objective_function(items, X_i, theta, b, d) {
    let sum = 0;
    for(let j = 0; j < d.length; j++){
        const O = O_j(theta[j], b, items, X_i);
        sum += ((d[j] - O) ** 2);
    }
    return sum;
}

// 限制函式
// 限制函式1: 題目形式填充題>10、計算題>5
function constraint1(items, X_i) {

}
function constraint2(items) {

}
function constraint3(items) {

}

const generateExam = async (req, res) => {
    const items = await Item.find({}).sort({ createdAt: -1 });
    const X_i = Array.from(
        { length: items.length }, 
        () => Math.round(Math.random())
    )
    const b = generateB(items);

    const result = objective_function(items, X_i, theta, b, d);

    res.status(200).json(items)
}

export { generateExam };