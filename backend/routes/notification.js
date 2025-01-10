import express from "express";
const { createNotification, fetchNotifications } = require("../controllers/notification");
const { verifyUserToken } = require("../middlewares/userValidation");
const router = express.Router();

router.post("/", createNotification);
router.get("/fetch", verifyUserToken, fetchNotifications);
router.put("/mark-read", verifyUserToken, markRead);

module.exports = router;
