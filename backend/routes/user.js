const express = require("express");
const {
  userSignup,
  userLogin,
  getRecommendedBuddies,
  getAvailableGroups,
} = require("../controllers/user");
const router = express.Router();

// auth routes
router.post("/signup", userSignup);
router.post("/login", userLogin);

// group routes
router.get("/recommended-buddies", getRecommendedBuddies);
router.get("/available-groups", getAvailableGroups);

module.exports = router;
