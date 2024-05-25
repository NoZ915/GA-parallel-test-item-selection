import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const LIMIT = 5;

export const queryClient = new QueryClient();

export async function fetchItems({ pageParam }) {
    try {
        const res = await axios.get("http://localhost:4000/api/items");
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
        await axios.post("http://localhost:4000/api/exams/generateExam")
    } catch (error) {
        return error;
    }
}

export async function fetchExams({ pageParam }) {
    try {
        const res = await axios.get("http://localhost:4000/api/exams/getExams");
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
        const res = await axios.get(`http://localhost:4000/api/exams/getExam/${examId}`);
        return res.data
    } catch (error) {
        return error;
    }
}