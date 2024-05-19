import express from "express";

import { generateExam } from "../controllers/examController.js";

const router = express.Router();

// generate new exam and post it to database
router.post("/generateExam", generateExam);
router.get("/generateExam", generateExam);


export default router;