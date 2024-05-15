import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import { Fab, Box, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Skeleton from "../components/Skeleton";

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
    mt: 4,
    width: '80%',
    borderRadius: 2,
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    backgroundColor: "white"
}

function ItemsPage() {
    const { data, isPending, isError } = useQuery({
        queryKey: ["items"],
        queryFn: () => {
            return axios.get("http://localhost:4000/api/items")
                .then(res => res.data)
                .catch(err => err)
        }
    });

    let content;

    if (isPending) {
        content = (
            <Skeleton times={5}/>
        )
    }

    if (isError) {
        content = (
            <>Failed to fetch events</>
        )
    }

    if (data) {
        content = data && data.map(item => {
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
        })
    }

    return (
        <>
            {content}
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
    )
}

export default ItemsPage;