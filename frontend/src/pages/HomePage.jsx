import { Box, Container, Typography } from "@mui/material";

const dynamicTextStyle1 = {
    position: "relative",
    whiteSpace: "nowrap",
    "@keyframes typewriter1": {
        "30%, 50%": {
            left: "75%"
        },
        //40%~60% 讓字固定在最長的長度
        "80%": {
            left: "0"
        }
        //100% 再讓所有字消失，好像有人在把字刪掉的感覺～
    },
    "@keyframes blink": {
        from: { borderLeft: "solid 1px  #EDDE5D" },
        to: { borderLeft: "solid 1px  transparent" }
    },
    '&::before': {
        content: "''",
        position: "absolute",
        borderLeft: " solid 1px  #EDDE5D",
        width: "100%",
        height: "100%",
        bottom: "0",
        left: "0",
        background: "#fb8c00",
        animation: `typewriter1 4s steps(23) infinite, blink 0.5s steps(23) infinite`
    }
}
const dynamicTextStyle2 = {
    position: "relative",
    whiteSpace: "nowrap",
    "@keyframes typewriter2": {
        "50%, 70%": {
            left: "88%"
        },
        //40%~60% 讓字固定在最長的長度
        "90%": {
            left: "0"
        }
        //100% 再讓所有字消失，好像有人在把字刪掉的感覺～
    },
    "@keyframes blink": {
        from: { borderLeft: "solid 1px  #EDDE5D" },
        to: { borderLeft: "solid 1px  transparent" }
    },
    '&::before': {
        content: "''",
        position: "absolute",
        borderLeft: " solid 1px  #EDDE5D",
        width: "100%",
        height: "100%",
        bottom: "0",
        left: "0",
        background: "#fb8c00",
        animation: `typewriter2 4s steps(23) infinite, blink 0.5s steps(23) infinite`
    }
}
const dynamicTextStyle3 = {
    position: "relative",
    whiteSpace: "nowrap",
    "@keyframes typewriter3": {
        "60%, 80%": {
            left: "85%"
        },
        //40%~60% 讓字固定在最長的長度
        "100%": {
            left: "0"
        }
        //100% 再讓所有字消失，好像有人在把字刪掉的感覺～
    },
    "@keyframes blink": {
        from: { borderLeft: "solid 1px  #EDDE5D" },
        to: { borderLeft: "solid 1px  transparent" }
    },
    '&::before': {
        content: "''",
        position: "absolute",
        borderLeft: " solid 1px  #EDDE5D",
        width: "100%",
        height: "100%",
        bottom: "0",
        left: "0",
        background: "#fb8c00",
        animation: `typewriter3 4s steps(23) infinite, blink 0.5s steps(23) infinite`
    }
}

function HomePage() {
    return (
        <Box
            sx={{
                backgroundColor: "#fb8c00",
                height: "100%"
            }}
        >
            <Container sx={{
                paddingTop: "20px",
                display: "flex",
                flexDirection: "column",
                height: "inherit",
                justifyContent: "center",
                width: "900px",
                overflow: "hidden",
                position: "relative"
            }}>
                <Typography
                    sx={{
                        ...dynamicTextStyle1,
                        color: "white",
                        fontSize: "6em"
                    }}
                    variant="h1"
                    gutterBottom
                >
                    GENETIC Algo
                </Typography>
                <Typography
                    sx={{
                        ...dynamicTextStyle2,
                        color: "white",
                        fontSize: "6em"
                    }}
                    variant="h1"
                    gutterBottom
                >
                    PARALLEL TEST
                </Typography>
                <Typography
                    sx={{
                        ...dynamicTextStyle3,
                        color: "white",
                        fontSize: "6em"
                    }}
                    variant="h1"
                    gutterBottom
                >
                    ITEM SELETION
                </Typography>
            </Container>

        </Box >
    )
}

export default HomePage;