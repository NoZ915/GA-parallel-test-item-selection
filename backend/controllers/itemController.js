import mongoose from "mongoose";
import Item from "../models/itemModal.js";

// create a new item
const createItem = async(req, res) => {
    const { content, year, format, type } = req.body;
    // const difficulty

    try{
        const item = await Item.create({ content, year })
    }catch(error){
        
    }
}

export{
    createItem
}