const express = require("express");
const router = express.Router();

const {
    getSpareParts,
    getSparePart,
    createSparePart,
    updateSparePart,
    deleteSparePart,
    assignSparePartToMachines,
    useSparePart,
} = require("../controllers/spareParts.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router
    .get("/getSpareParts", authMiddleware, getSpareParts)
    .get("/getSparePart/:id", authMiddleware, getSparePart)
    .post(
        "/createSparePart",
        authMiddleware,
        upload("spareParts").single("sparePartPhoto"),
        createSparePart
    )
    .put(
        "/updateSparePart",
        authMiddleware,
        upload("spareParts").single("sparePartPhoto"),
        updateSparePart
    )
    .put("/assingSpareParts", authMiddleware, assignSparePartToMachines)
    .put("/useSparePart", authMiddleware, useSparePart)
    .delete("/deleteSparePart", authMiddleware, deleteSparePart);

module.exports = router;
