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
const upload = require("../middleware/cloudConfig");
const router = express.Router();

// auth routes
router.post("/signup",upload.single("profilePicture") , userSignup); //tested
router.post("/login", userLogin); //tested

// dashboard routes
router.get("/dashboard/recommended-buddies",verifyUserToken, getRecommendedBuddies); //tested 
router.post("/dashboard/available-groups", verifyUserToken, getAvailableGroups); //tested
router.get("/dashboard/user-group", verifyUserToken, getUserGroup); //tested
router.post("/dashboard/join-group", verifyUserToken, joinGroup); // tested
router.post("/dashboard/leave-group", verifyUserToken, leaveGroup); 

// profile routes
router.get("/profile", verifyUserToken, userProfile); //tested
router.post("/profile/update", verifyUserToken, upload.single("profilePicture"), updateUserProfile); //tested


module.exports = router;
