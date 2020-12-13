const express = require("express");
const router = express.Router();
const {
    getMaintenances,
    getMaintenance,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
} = require("../controllers/maintenaces.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getMaintenances", authMiddleware, getMaintenances)
    .get("/getMaintenance/:id", authMiddleware, getMaintenance)
    .post("/createMaintenance", authMiddleware, createMaintenance)
    .put("/updateMaintenance", authMiddleware, updateMaintenance)
    .delete("/deleteMaintenance", authMiddleware, deleteMaintenance);

module.exports = router;
