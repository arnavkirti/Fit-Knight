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
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

//dashboard routes
router.post("/dashboard/add-group", verifyAdminToken, addGroup);
router.get("/dashboard/group", verifyAdminToken, getGroup);
router.get("/dashboard/join-requests", getJoinRequests);
router.post(
  "/dashboard/update-join-request",
  verifyAdminToken,
  updateJoinRequest
);
router.delete("/dashboard/delete-group", verifyAdminToken, deleteGroup);

// group routes
router.get("/group-details", getGroupDetails);
router.put("/update-group", verifyAdminToken, updateGroupDetails);

//profile routes
router.get("/profile", verifyAdminToken, adminProfile);
router.post("/profile/update", verifyAdminToken, updateAdminProfile);

module.exports = router;
