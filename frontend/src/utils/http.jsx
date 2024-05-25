import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const LIMIT = 5;

export const queryClient = new QueryClient();

export async function fetchItems({ pageParam }) {
    try {
        const res = await axios.get("https://ga-exam-item-selection-backend.zeabur.app/api/items");
        return {
            data: res.data.slice(pageParam, pageParam + LIMIT),
            currentPage: pageParam,
            nextPage: pageParam + LIMIT < res.data.length ? pageParam + LIMIT : null
        };
    } catch (error) {
        return error;
    }
}

export async function generateExam() {
    try {
        await axios.post("https://ga-exam-item-selection-backend.zeabur.app/api/exams/generateExam")
    } catch (error) {
        return error;
    }
}

export async function fetchExams({ pageParam }) {
    try {
        const res = await axios.get("https://ga-exam-item-selection-backend.zeabur.app/api/exams/getExams");
        return {
            data: res.data.slice(pageParam, pageParam + LIMIT),
            currentPage: pageParam,
            nextPage: pageParam + LIMIT < res.data.length ? pageParam + LIMIT : null
        }
    } catch (error) {
        return error;
    }
}

export async function fetchExam(examId) {
    try {
        const res = await axios.get(`https://ga-exam-item-selection-backend.zeabur.app/api/exams/getExam/${examId}`);
        return res.data
    } catch (error) {
        return error;
    }
}