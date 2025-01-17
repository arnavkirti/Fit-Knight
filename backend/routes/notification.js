const express = require("express");
const {
  createNotification,
  fetchNotifications,
  markRead,
} = require("../controllers/notification");
const { verifyUserToken, verifyAdminToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createNotification);
router.get("/fetch", verifyUserToken, fetchUserNotifications);
router.get("/fetch-admin", verifyAdminToken, fetchAdminNotifications);
router.put("/mark-read", verifyUserToken, markRead);

module.exports = router;
