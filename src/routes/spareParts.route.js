const express = require("express");
const router = express.Router();

const {
    getSpareParts,
    getSparePart,
    createSparePart,
    updateSparePart,
    deleteSparePart,
} = require("../controllers/spareParts.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getSpareParts", authMiddleware, getSpareParts)
    .get("/getSparePart/:id", authMiddleware, getSparePart)
    .post("/createSparePart", authMiddleware, createSparePart)
    .put("/updateSparePart", authMiddleware, updateSparePart)
    .delete("/deleteSparePart", authMiddleware, deleteSparePart);

module.exports = router;
