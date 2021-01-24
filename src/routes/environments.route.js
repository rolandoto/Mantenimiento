const express = require("express");
const router = express.Router();
const {
    getEnvironment,
    getEnvironments,
    updateEnvironment,
    createEnvironment,
    deleteEnvironment,
} = require("../controllers/environments.controller");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getEnvironment/:id", authMiddleware, getEnvironment)
    .get("/getEnvironments", authMiddleware, getEnvironments)
    .post(
        "/createEnvironment",
        authMiddleware,
        upload("environments").single("environmentPhoto"),
        createEnvironment
    )
    .put(
        "/updateEnvironment",
        authMiddleware,
        upload("environments").single("environmentPhoto"),
        updateEnvironment
    )
    .delete("/deleteEnvironment", authMiddleware, deleteEnvironment);

module.exports = router;
