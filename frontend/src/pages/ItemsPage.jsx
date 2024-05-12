import { Fab, Box, Button, Typography, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
    const [items, setItems] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:4000/api/items")
            .then(res => setItems(res.data))
            .catch(err => console.log(err))
    }, [])

    const renderedItems = items && items.map(item => {
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

    return (
        <>
            {renderedItems}

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