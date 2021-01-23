const express = require("express");
const router = express.Router();
const {
    login,
    register,
    authenticate,
    updateUser,
} = require("../controllers/users.controller");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router
    .get("/authenticate", authenticate)
    .post("/login", login)
    .post("/register", register)
    .put(
        "/updateUser",
        auth,
        upload("users").single("profileImage"),
        updateUser
    );

module.exports = router;
