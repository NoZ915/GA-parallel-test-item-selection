import { Container, MenuItem, TextField, Typography, Box } from "@mui/material";

const containerStyle = {
    display: "flex",
    flexDirection: "column",
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
const selectBoxStyle = {
    display: "flex",
    alignItems: "baseline",
}
const selectTitleStyle = {
    display: "inline-block",
    mr: 2
}

const years = [
    {
        value: "111",
        label: "111年"
    },
    {
        value: "110",
        label: "110年"
    }
];
const formats = [
    {
        value: "fillIn",
        label: "填充題"
    },
    {
        value: "calculation",
        label: "計算題"
    }
];
const types = [
    {
        value: ""
    }
]

function AddItemFormPage() {
    return (
        <Container sx={{ ...containerStyle }}>
            <form>
                {/* 年份 */}
                <Box sx={{...selectBoxStyle}}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">試題年份</Typography>
                    <TextField
                        id="year"
                        select
                        defaultValue="111"
                        helperText="請選擇試題年份"
                    >
                        {years.map((year) => (
                            <MenuItem key={year.value} value={year.value}>
                                {year.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* 形式 */}
                <Box sx={{...selectBoxStyle}}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">試題形式</Typography>
                    <TextField
                        id="format"
                        select
                        defaultValue="fillIn"
                        helperText="請選擇試題形式"
                    >
                        {formats.map((format) => (
                            <MenuItem key={format.value} value={format.value}>
                                {format.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </form>
        </Container>
    )
}

export default AddItemFormPage;