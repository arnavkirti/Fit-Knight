const express = require("express");
const {
  userSignup,
  userLogin,
  getRecommendedBuddies,
  getAvailableGroups,
  userProfile,
  updateUserProfile,
  joinGroup,
  getUserGroup,
  leaveGroup,
} = require("../controllers/user");
const { verifyUserToken } = require("../middleware/authMiddleware");
const router = express.Router();

// auth routes
router.post("/signup", userSignup);
router.post("/login", userLogin);

// dashboard routes
router.get("/dashboard/recommended-buddies", getRecommendedBuddies);
router.get("/dashboard/available-groups", verifyUserToken, getAvailableGroups);
router.get("/dashboard/user-group", verifyUserToken, getUserGroup);
router.post("/dashboard/join-group", verifyUserToken, joinGroup);
router.post("/dashboard/leave-group", verifyUserToken, leaveGroup);

// profile routes
router.get("/profile", verifyUserToken, userProfile);
// router.put("/edit-profile", updateUserProfile);
module.exports = router;
