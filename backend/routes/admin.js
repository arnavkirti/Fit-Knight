const express = require("express");
const {
  adminSignup,
  adminLogin,
  getGroupDetails,
  getJoinRequests,
  updateGroupDetails,
  addGroup,
  deleteGroup,
  adminProfile,
  getGroup,
  updateJoinRequest,
  updateAdminProfile,
} = require("../controllers/admin");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const router = express.Router();

// auth routes
router.post("/signup", adminSignup); //tested
router.post("/login", adminLogin); //tested

//dashboard routes
router.post("/dashboard/add-group", verifyAdminToken, addGroup); // tested
router.get("/dashboard/group", verifyAdminToken, getGroup); //tested
router.get("/dashboard/join-requests", getJoinRequests); //tested
router.post(
  "/dashboard/update-join-request",
  verifyAdminToken,
  updateJoinRequest
);
router.delete("/dashboard/delete-group", verifyAdminToken, deleteGroup); //tested

// group routes
router.get("/group-details", getGroupDetails);
router.put("/update-group", verifyAdminToken, updateGroupDetails);

//profile routes
router.get("/profile", verifyAdminToken, adminProfile); // tested
router.post("/profile/update", verifyAdminToken, updateAdminProfile); // tested

module.exports = router;
