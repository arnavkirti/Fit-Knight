const express = require("express");
const {
  userSignup,
  userLogin,
  getRecommendedBuddies,
  getAvailableGroups,
} = require("../controllers/user");
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/recommended-buddies", getRecommendedBuddies);
router.get("/available-groups", getAvailableGroups);

module.exports = router;
