const express = require("express");
const router = express.Router();
const {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine,
} = require("../controllers/machines.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getMachines", authMiddleware, getMachines)
    .get("/getMachine/:id", authMiddleware, getMachine)
    .post("/createMachine", authMiddleware, createMachine)
    .put("/updateMachine", authMiddleware, updateMachine)
    .delete("/deleteMachine", authMiddleware, deleteMachine);

module.exports = router;
