const express = require("express");
const router = express.Router();

const {
    getRol,
    getRols,
    createRol,
    updateRol,
    deleteRol,
} = require("../controllers/rol.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getRols", authMiddleware, getRols)
    .get("/getRol/:id", authMiddleware, getRol)
    .post("/createRol", authMiddleware, createRol)
    .put("/updateRol", authMiddleware, updateRol)
    .delete("/deleteRol", authMiddleware, deleteRol);

module.exports = router;
