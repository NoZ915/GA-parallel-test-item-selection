import express from "express";

import { generateExam, getExams, getExam } from "../controllers/examController.js";

const router = express.Router();

// generate new exam and post it to database
router.post("/generateExam", generateExam);
router.get("/getExams", getExams);
router.get("/getExam/:id", getExam);

export default router;