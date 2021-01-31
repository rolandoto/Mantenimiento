const express = require("express");
const router = express.Router();
const {
    getNotifications,
    completeNotification,
} = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router
    .get("/getNotifications", authMiddleware, getNotifications)
    .delete("/completeNotification", authMiddleware, completeNotification);

module.exports = router;
