import express from "express";
import multer from "multer";
import path from "path";
import {
    createItem
} from "../controllers/itemController.js";
import Item from "../models/itemModal.js";
import { error } from "console";

const router = express.Router();

// GET all items
router.get("/", (req, res) => {
    res.json({ mssg: "GET all items" })
})

//GET a single item
router.get("/:id", (req, res) => {
    res.json({ mssg: "GET a single item" })
})

//POST a new item
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, "./public/itemImage"); //null is for error
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage
})
// -----upload.single("image")的image即上方提及的filedName----- //
router.post("/", upload.single("image"), async (req, res) => {
    // req.file 為圖片
    // req.body 為其他資料
    const content = req.file.path;
    const { year, format, type, examPaper, difficulty } = req.body;

    try{
        console.log({ content, year, format, type, examPaper, difficulty})
        const item = await Item.create({ content, year, format, type, examPaper, difficulty});
        console.log("hiii")
        res.status(200).json(item)
    }catch(err){
        res.status(400).json({ error: error.message });
    }
    // console.log(req)
});

//DELETE an item
router.delete("/:id", (req, res) => {
    res.json({ mssg: "DELETE an item" })
})

//UPDATE an item
router.patch("/:id", (req, res) => {
    res.json({ mssg: "UPDATE an item" })
})

export default router;