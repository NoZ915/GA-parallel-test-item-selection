import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button, Box, CircularProgress, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Skeleton from "../components/Skeleton";
import { fetchExams, generateExam, queryClient } from "../utils/http";


const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
    mb: 3,
    width: '80%',
    borderRadius: 2,
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    backgroundColor: "white"
}

function ExamsPage() {
    const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["exams"],
        queryFn: fetchExams,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage
    })

    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

    const { mutate, isPending } = useMutation({
        mutationFn: generateExam,
        onSuccess: () => {
            queryClient.invalidateQueries("exams");
        }
    })

    function handleClick() {
        mutate();
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                {isPending ? (
                    <LoadingButton
                        sx={{ border: "1px solid white", color: "white", mb: 4 }}
                        variant="contained"
                        loading={true}
                    >
                        建立測驗
                    </LoadingButton>
                ) : (
                    <Button
                        sx={{ border: "1px solid white", color: "white", mb: 4 }}
                        variant="contained"
                        onClick={handleClick}
                    >
                        建立測驗
                    </Button>
                )
                }
            </Box>

            {status === "pending" ? (
                <Skeleton times={5} />
            ) : status === "error" ? (
                <>Failed to fetch events</>
            ) : (
                <>
                    <Box sx={{ display: "flex", flexDirection: "column", mb: 4 }}>
                        {data.pages.map(page => {
                            return (
                                <Box key={page.currentPage}>
                                    {page.data.map(item => {
                                        return (
                                            <Box sx={{ ...containerStyle }} key={item._id}>
                                                <Typography>測驗試題編號：{item._id}</Typography>
                                                <Typography>建立時間：{new Date(item.updatedAt).toLocaleString("zh-tw")}</Typography>
                                                <Button 
                                                    variant="contained" 
                                                    sx={{ color: "white" }}
                                                >
                                                    <Link style={{ color: "white", textDecoration: "none" }} to={`/exams/${item._id}`}>進入測驗</Link>
                                                </Button>
                                            </Box>
                                        )
                                    })}
                                </Box>
                            )
                        })}

                        <Box sx={{ p: 1 }} ref={ref}>
                            {isFetchingNextPage && (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 5 }}><CircularProgress color="secondary" /></Box>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </>

    )


}

export default ExamsPage;
