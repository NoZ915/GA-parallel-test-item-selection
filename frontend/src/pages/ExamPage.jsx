import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";

import { Button, Box, CircularProgress, Typography, Rating } from "@mui/material"
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import { fetchExam } from "../utils/http";

const examTitleStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    padding: "30px 0",
    width: "80%",
    alignItems: "center",
    backgroundColor: "white",
}

function ExamPage() {
    const { id: examId } = useParams();
    const { data, status, isFetching } = useQuery({
        queryKey: ["exam"],
        queryFn: () => fetchExam(examId),
        enabled: !!examId, // 只有在有 examId 時才執行查詢
        initialData: []
    })

    const componentRef = useRef();
    const handleClick = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `exams`
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ ...examTitleStyle }}>
                <Typography variant="h4" sx={{ mb: 2 }}>第一份試卷</Typography>
                <Box sx={{ display: "flex", mb: 2 }}>
                    {Object.entries(firstDifficultyCounts).map(([difficulty, count]) => (
                        <Box key={difficulty} sx={{ display: "flex", mr: 4 }}>
                            <Rating name="read-only" value={difficulty} readOnly />
                            <Typography>{count}</Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClick}
                >
                    <Typography>下載測驗</Typography>
                    <DownloadTwoToneIcon />
                </Button>
            </Box>
            <Box sx={{ backgroundColor: "white", width: "80%", mb: 4 }} ref={componentRef}>
                {firstExam.map(item => {
                    return (
                        <Box key={item._id} sx={{ ml: 4, mt: 4 }}>
                            <Typography># {item.year}-{item.examPaper}</Typography>
                            <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`https://ga-exam-item-selection-backend.zeabur.app/${item.content}`} alt={item.examPaper} />
                        </Box>
                    )
                })}
            </Box>

            <Box sx={{ ...examTitleStyle }}>
                <Typography variant="h4" sx={{ mb: 2 }}>第二份試卷</Typography>
                <Box sx={{ display: "flex", mb: 2 }}>
                    {Object.entries(secondDifficultyCounts).map(([difficulty, count]) => (
                        <Box key={difficulty} sx={{ display: "flex", mr: 4 }}>
                            <Rating name="read-only" value={difficulty} readOnly />
                            <Typography>{count}</Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClick}
                >
                    <Typography>下載測驗</Typography>
                    <DownloadTwoToneIcon />
                </Button>
            </Box>
            <Box sx={{ backgroundColor: "white", width: "80%", mb: 4 }}>
                {secondExam.map(item => {
                    return (
                        <Box key={item._id} sx={{ ml: 4, mt: 4 }}>
                            <Typography># {item.year}-{item.examPaper}</Typography>
                            <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`https://ga-exam-item-selection-backend.zeabur.app/${item.content}`} alt={item.examPaper} />
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default ExamPage;