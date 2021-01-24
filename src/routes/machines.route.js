const express = require("express");
const router = express.Router();
const {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    registerMachineUse,
} = require("../controllers/machines.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router
    .get("/getMachines", authMiddleware, getMachines)
    .get("/getMachine/:id", authMiddleware, getMachine)
    .post("/registerMachineUse", authMiddleware, registerMachineUse)
    .post(
        "/createMachine",
        authMiddleware,
        upload("machines").single("machinePhoto"),
        createMachine
    )
    .put(
        "/updateMachine",
        authMiddleware,
        upload("machines").single("machinePhoto"),
        updateMachine
    )
    .delete("/deleteMachine", authMiddleware, deleteMachine);

module.exports = router;
