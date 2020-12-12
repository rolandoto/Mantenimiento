const express = require("express");
const router = express.Router();
const { login, register, authenticate } = require("../controllers/users.controller");

router
    .get("/authenticate", authenticate)
    .post("/login", login)
    .post("/register", register);

module.exports = router;
