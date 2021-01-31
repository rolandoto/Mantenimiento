const express = require("express");
const router = express.Router();
const {
    getMaintenanceType,
    getMaintenanceTypes,
    createMaintenanceType,
    updateMaintenanceType,
    deleteMaintenanceType,
} = require("../controllers/maintenanceTypes.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getMaintenanceTypes", authMiddleware, getMaintenanceTypes)
    .get("/getMaintenanceType/:id", authMiddleware, getMaintenanceType)
    .post("/createMaintenanceType", authMiddleware, createMaintenanceType)
    .put("/updateMaintenanceType", authMiddleware, updateMaintenanceType)
    .delete("/deleteMaintenanceType", authMiddleware, deleteMaintenanceType);

module.exports = router;
