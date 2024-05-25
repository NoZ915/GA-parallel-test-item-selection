import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
    idArr: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const Exam = mongoose.model("Exam", ExamSchema);
export default Exam;