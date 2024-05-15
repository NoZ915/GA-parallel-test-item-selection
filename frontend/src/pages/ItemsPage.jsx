import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Fab, Box, Chip, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Skeleton from "../components/Skeleton";
import { fetchItems } from "../utils/fetchItems";

const containerStyle = {
    display: "flex",
    flexDirection: "column",
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

function ItemsPage() {
    const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["items"],
        queryFn: fetchItems,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView])

    return status === "pending" ? (
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
                                        <img style={{ marginBottom: "8px", maxWidth: "600px", width: "80%", height: "100%", objectFit: "contain" }} src={`http://localhost:4000/${item.content}`} alt={item.examPaper} />
                                        <Box sx={{ fontSize: "20px" }}>
                                            <Chip sx={{ mr: "3px" }} label={item.year} varient="outlined" />
                                            <Chip sx={{ mr: "3px" }} label={item.examPaper} varient="outlined" />
                                            <Chip sx={{ mr: "3px" }} label={item.type} varient="outlined" />
                                            <Chip sx={{ mr: "3px" }} label={item.format} varient="outlined" />
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    )
                })}
                {/* 只要這個設有ref prop的DOM進到螢幕view中，就會將inView自動設為true */}
                <Box sx={{ p: 1 }} ref={ref}>
                    {isFetchingNextPage && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 5 }}><CircularProgress color="secondary" /></Box>
                    )}
                </Box>
            </Box>
            <Link to="/addItem">
                <Fab
                    color="secondary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16
                    }}
                >
                    <AddIcon />
                </Fab>
            </Link>
        </>

    );
}

export default ItemsPage;