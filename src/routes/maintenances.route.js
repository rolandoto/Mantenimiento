const express = require("express");
const router = express.Router();
const {
    getMaintenances,
    getMaintenance,
    createMaintenance,
    completeMaintenance,
    deleteMaintenance,
} = require("../controllers/maintenances.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getMaintenances", authMiddleware, getMaintenances)
    .get("/getMaintenance/:id", authMiddleware, getMaintenance)
    .post("/createMaintenance", authMiddleware, createMaintenance)
    .put("/completeMaintenance", authMiddleware, completeMaintenance)
    .delete("/deleteMaintenance", authMiddleware, deleteMaintenance);

module.exports = router;
