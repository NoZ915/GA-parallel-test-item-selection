import Item from "../models/itemModal";

// 目標函式
function objective_function(items){

}
// 限制函式
function constraint1(items){

}
function constraint2(items){
    
}

const generateExam = async (req, res) => {
    const items = await Item.find({}).sort({ createdAt: -1 });

}

export { generateExam };