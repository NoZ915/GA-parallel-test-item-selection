import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Container, MenuItem, TextField, Typography, Box, Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import {
    years,
    formats,
    types,
    exam_papers
} from "../utils/itemFormDate";

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
    justifyContent: "center",
}
const selectTitleStyle = {
    display: "inline-block",
    mr: 2
}
const TextFieldStyle = {
    width: "60%",
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});

function AddItemFormPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState("");
    const [year, setYear] = useState("111");
    const [format, setFormat] = useState("fillIn");
    const [type, setType] = useState("limit");
    const [examPaper, setExamPaper] = useState("ntuB");
    const [fileName, setFileName] = useState("請上傳題目圖片");

    const handelUploadChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        formData.append("year", year);
        formData.append("format", format);
        formData.append("type", type);
        formData.append("examPaper", examPaper);

        axios.post("https://ga-exam-item-selection-backend.zeabur.app/api/items", formData)
            .then(res => {
                setFile("");
                setYear("111");
                setFormat("fillIn");
                setType("limit");
                setExamPaper("ntuA");
                navigate("/items");
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <Container sx={{ ...containerStyle, '& .MuiTextField-root': { m: 1, width: 'fullfilled' } }}>
            <form onSubmit={handleSubmit}>
                {/* 題目 */}
                <Box sx={{ ...selectBoxStyle }}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">題目上傳</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", width: "60%", margin: "8px" }}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            sx={{ color: "white", mr: "8px" }}
                        >
                            上傳
                            <VisuallyHiddenInput type="file" onChange={e => handelUploadChange(e)} />
                        </Button>
                        <Typography sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                        }}>
                            {fileName}
                        </Typography>
                    </Box>

                </Box>

                {/* 年份 */}
                <Box sx={{ ...selectBoxStyle }}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">試題年份</Typography>
                    <TextField
                        sx={{ ...TextFieldStyle }}
                        id="year"
                        select
                        defaultValue="111"
                        helperText="請選擇試題年份"
                        SelectProps={{
                            MenuProps: {
                                sx: { height: "300px" },
                            },
                        }}
                        onChange={e => setYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <MenuItem key={year.value} value={year.value}>
                                {year.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* 形式 */}
                <Box sx={{ ...selectBoxStyle }}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">試題形式</Typography>
                    <TextField
                        sx={{ ...TextFieldStyle }}
                        id="format"
                        select
                        defaultValue="fillIn"
                        helperText="請選擇試題形式"
                        onChange={e => setFormat(e.target.value)}
                    >
                        {formats.map((format) => (
                            <MenuItem key={format.value} value={format.value}>
                                {format.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* 題型 */}
                <Box sx={{ ...selectBoxStyle }}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">試題題型</Typography>
                    <TextField
                        sx={{ ...TextFieldStyle }}
                        id="type"
                        select
                        defaultValue="limit"
                        helperText="請選擇試題題型"
                        onChange={e => setType(e.target.value)}
                    >
                        {types.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* 卷別 */}
                <Box sx={{ ...selectBoxStyle }}>
                    <Typography sx={{ ...selectTitleStyle }} component="h3">考題出處</Typography>
                    <TextField
                        sx={{ ...TextFieldStyle }}
                        id="exam_papers"
                        select
                        defaultValue="ntuB"
                        helperText="請選擇試題形式"
                        onChange={e => setExamPaper(e.target.value)}
                    >
                        {exam_papers.map((exam_paper) => (
                            <MenuItem key={exam_paper.value} value={exam_paper.value}>
                                {exam_paper.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Button
                    sx={{ display: "block", margin: "auto", color: "white" }}
                    type="submit"
                    variant="contained"
                    disabled
                >
                    建立題目
                </Button>
            </form>
        </Container>
    )
}

export default AddItemFormPage;