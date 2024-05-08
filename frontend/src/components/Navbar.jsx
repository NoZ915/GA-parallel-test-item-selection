import{ AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar(){
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div"  sx={{ flexGrow: 1 }}>
                    <Link style={{textDecoration: "none", color: "white", fontWeight: "900" }} to="/">GA</Link>
                </Typography>
                <Stack direction="row" spacing={2} >
                    <Button>
                        <Link style={{textDecoration: "none", color: "white", fontWeight: "900" }} to="/items">題庫列表</Link>
                    </Button>
                    <Button>
                        <Link style={{textDecoration: "none", color: "white", fontWeight: "900" }} to="/exams">建立測驗</Link>
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;