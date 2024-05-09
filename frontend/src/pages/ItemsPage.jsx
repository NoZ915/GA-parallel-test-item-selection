import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";

function ItemsPage() {
    return (
        <>
            <Link to="/addItem">
                <Fab
                    color="secondary"
                    aria-label="add"
                    sx={{
                        position: "absolute",
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