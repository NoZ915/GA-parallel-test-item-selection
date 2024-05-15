import { Box } from "@mui/material";

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
    pb: 2,
    backgroundColor: "white"
}
const outerStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(213,214,215,1)",
}
const innerStyle = {
    position: "absolute",

    //---動態---//
    "@keyframes shimmer": {
        "100%": {
            transform: "translateX(100%)"
        }
    },
    animation: "shimmer 1.5s infinite",
    //---動態---//

    inset: "0",
    "--transform-translate-x": "-100%",
    background: "linear-gradient(90deg, rgba(213,214,215,1) 0%, rgba(255,255,255,1) 50%, rgba(213,214,215,1) 100%)",
}

function Skeleton({ times }) {
    const boxes = Array(times).fill(0).map((_, i) => {
        return (
            <Box sx={{ ...containerStyle }} key={i}>
                <Box sx={{ ...outerStyle, mb: "8px", height: "120px", width: "100%" }}>
                    <Box sx={{ ...innerStyle }}></Box>
                </Box>
                <Box sx={{ ...outerStyle, height: "20px", width: "100%" }}>
                    <Box sx={{ ...innerStyle }}></Box>
                </Box>
            </Box>
        )
    })

    return boxes;
}

export default Skeleton;