const express = require("express");
const router = express.Router();
const {
    getMachines,
    getMachineNoAuth,
    createMachine,
    updateMachine,
    deleteMachine,
    registerMachineUse,
    updatePreconfiguredMaitenances,
    completeCheckListTask,
    resetMachineHours,
    registerMachineIssue,
} = require("../controllers/machines.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router
    .get("/getMachines", authMiddleware, getMachines)
    .get("/getMachineNoAuth/:id", getMachineNoAuth)
    .post("/registerMachineUse", authMiddleware, registerMachineUse)
    .post("/registerMachineIssue", authMiddleware, registerMachineIssue)
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
    .put(
        "/updatePreconfiguredMaitenances",
        authMiddleware,
        updatePreconfiguredMaitenances
    )
    .put("/completeTask", authMiddleware, completeCheckListTask)
    .put("/resetMachineHours", authMiddleware, resetMachineHours)
    .delete("/deleteMachine", authMiddleware, deleteMachine);

module.exports = router;
