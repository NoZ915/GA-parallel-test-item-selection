import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box } from "@mui/material"
import { fetchExam } from "../utils/http";

function ExamPage() {
    const { id: examId } = useParams();
    const { data, status } = useQuery({
        queryKey: ["exam"],
        queryFn: () => fetchExam(examId)
    })

    return status === "pending" ? (
        <>Pending ...</>
    ) : status === "error" ? (
        <>Fail to fetch events ...</>
    ) : (
        <Box>
            {data.map(item => {
                return(
                    <Box key={item._id}>
                        <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`http://localhost:4000/${item.content}`} alt={item.examPaper} />
                        
                    </Box>
                )
            })}
        </Box>
    )
}

export default ExamPage;