const express = require("express");
const router = express.Router();
const {
    getEnvironment,
    getEnvironments,
    updateEnvironment,
    createEnvironment,
    deleteEnvironment,
} = require("../controllers/environments.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getEnvironment/:id", authMiddleware, getEnvironment)
    .get("/getEnvironments", authMiddleware, getEnvironments)
    .post("/createEnvironment", authMiddleware, createEnvironment)
    .put("/updateEnvironment", authMiddleware, updateEnvironment)
    .delete("/deleteEnvironment", authMiddleware, deleteEnvironment);

module.exports = router;
