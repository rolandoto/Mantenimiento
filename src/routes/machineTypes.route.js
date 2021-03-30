const express = require("express");
const router = express.Router();
const {
    getMachineTypes,
    createMachineType,
    updateMachineType,
    deleteMachineType,
} = require("../controllers/machineType.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getMachineTypes", authMiddleware, getMachineTypes)
    .post("/createMachineType", authMiddleware, createMachineType)
    .put("/updateMachineType", authMiddleware, updateMachineType)
    .delete("/deleteMachineType", authMiddleware, deleteMachineType);

module.exports = router;
