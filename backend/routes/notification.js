const express = require("express");
const {
  createNotification,
  fetchNotifications,
  markRead,
} = require("../controllers/notification");
const { verifyUserToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createNotification);
router.get("/fetch", verifyUserToken, fetchNotifications);
router.put("/mark-read", verifyUserToken, markRead);

module.exports = router;
