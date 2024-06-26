import path from "path";
import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import itemsRoutes from "./routes/items.js";
import examsRoutes from "./routes/exams.js";

// express app
const app = express();
app.use(cors());

// middleware
app.use((req, res, next) => {
    // console.log(req.path, req.method);
    next();
})

// routes
app.use(express.json());
app.use("/api/items", itemsRoutes);
app.use("/api/exams", examsRoutes);

const __dirname = path.resolve(); //set __dirname to current directory
app.use(express.static(path.join(__dirname, "./uploads")));

//connect to db
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => {
//         //listen for requests
//         //當我連上我的資料庫後，就要監聽我的PORT
//         app.listen(process.env.PORT, () => {
//             console.log("listening on port", process.env.PORT)
//         })
//     })
//     .catch((error) => {
//         console.log(error);
//     })

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("connect to db & listen to port ", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })