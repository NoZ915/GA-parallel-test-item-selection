import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, CircularProgress, Typography } from "@mui/material"
import { fetchExam } from "../utils/http";

function ExamPage() {
    const { id: examId } = useParams();
    const { data, status, isFetching } = useQuery({
        queryKey: ["exam"],
        queryFn: () => fetchExam(examId),
        enabled: !!examId, // 只有在有 examId 時才執行查詢
        initialData: []
    })

    const firstExam = data?.slice(0, 20);
    const secondExam = data?.slice(20, 40);

    const firstDifficultyCounts = {};
    const secondDifficultyCounts = {};

    if (firstExam) {
        for (const item of firstExam) {
            const difficulty = item.difficulty;
            if (firstDifficultyCounts[difficulty]) {
                firstDifficultyCounts[difficulty]++;
            } else {
                firstDifficultyCounts[difficulty] = 1;
            }
        }
    }
    if (secondExam) {
        for (const item of secondExam) {
            const difficulty = item.difficulty;
            if (secondDifficultyCounts[difficulty]) {
                secondDifficultyCounts[difficulty]++;
            } else {
                secondDifficultyCounts[difficulty] = 1;
            }
        }
    }

    return isFetching ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
            <Typography sx={{ mb: 4, color: "white" }}>測驗載入中，請稍候</Typography>
            <CircularProgress color="secondary" />
        </Box>
    ) : status === "error" ? (
        <>Fail to fetch events ...</>
    ) : (
        <>
            <Box>
                <Typography variant="h6">第一份試卷：</Typography>
                {Object.entries(firstDifficultyCounts).map(([difficulty, count]) => (
                    <Typography key={difficulty}>難度{difficulty}數量：{count} 個</Typography>
                ))}
            </Box>
            <Box sx={{ backgroundColor: "white", width: "80%" }}>
                {firstExam.map(item => {
                    return (
                        <Box key={item._id}>
                            <Typography># {item.year}-{item.examPaper}</Typography>
                            <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`http://localhost:4000/${item.content}`} alt={item.examPaper} />
                        </Box>
                    )
                })}
            </Box>

            <Box>
                <Typography variant="h6">第二份試卷：</Typography>
                {Object.entries(secondDifficultyCounts).map(([difficulty, count]) => (
                    <Typography key={difficulty}>難度{difficulty}數量：{count}個</Typography>
                ))}
            </Box>
            <Box sx={{ backgroundColor: "white", width: "80%" }}>
                {secondExam.map(item => {
                    return (
                        <Box key={item._id}>
                            <Typography># {item.year}-{item.examPaper}</Typography>
                            <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`http://localhost:4000/${item.content}`} alt={item.examPaper} />
                        </Box>
                    )
                })}
            </Box>
        </>
    )
}

export default ExamPage;