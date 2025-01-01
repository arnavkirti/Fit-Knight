const express = require("express");
const {
  userSignup,
  userLogin,
  getRecommendedBuddies,
  getAvailableGroups,
  userProfile,
  updateUserProfile,
} = require("../controllers/user");
const { verifyUserToken } = require("../middleware/authMiddleware");
const router = express.Router();

// auth routes
router.post("/signup", userSignup);
router.post("/login", userLogin);

// group routes
router.get("/recommended-buddies", getRecommendedBuddies);
router.get("/available-groups", getAvailableGroups);
router.post("/join-group", verifyUserToken, joinGroup);

// profile routes
router.get("/profile", verifyUserToken, userProfile);
router.update("/edit-profile", updateUserProfile);
module.exports = router;
