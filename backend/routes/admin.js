const express = require("express");
const {
  adminSignup,
  adminLogin,
  getGroupDetails,
  getJoinRequests,
  updateGroupDetails,
} = require("../controllers/admin");
const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/group-details", getGroupDetails);
router.get("/join-requests", getJoinRequests);
router.put("/update-group", updateGroupDetails);

module.exports = router;
