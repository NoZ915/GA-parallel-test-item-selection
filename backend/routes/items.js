import express from "express";

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
router.post("/", (req, res) => {
    res.json({ mssg: "POST a new item" })
})
//DELETE an item
router.delete("/:id", (req, res) => {
    res.json({ mssg: "DELETE an item" })
})
//UPDATE an item
router.patch("/:id", (req, res) => {
    res.json({ mssg: "UPDATE an item" })
})

export default router;