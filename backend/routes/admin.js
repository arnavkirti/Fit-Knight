const express = require("express");
const {
  adminSignup,
  adminLogin,
  getGroupDetails,
  getJoinRequests,
  updateGroupDetails,
  addGroup,
  getAllGroups,
  deleteGroup,
} = require("../controllers/admin");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const router = express.Router();

// auth routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

//group routes
router.post("/add-group", verifyAdminToken, addGroup);
router.get("/all-groups", verifyAdminToken, getAllGroups);
router.put("/update-group", verifyAdminToken, updateGroupDetails);
router.get("/group-details", getGroupDetails);
router.get("/join-requests", getJoinRequests);
router.delete("/delete-group", verifyAdminToken, deleteGroup);
router.get("/join-requests/:requestId", verifyAdminToken, updateJoinRequest);

module.exports = router;
