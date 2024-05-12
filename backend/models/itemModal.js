import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    examPaper: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Item = mongoose.model("Item", ItemSchema);
export default Item;