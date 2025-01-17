const User = require("../modals/User");
const Group = require("../modals/Group");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// auth routes
exports.adminSignup = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;
    const file = req.file.path;

    // validate with zod
    const validationResult = User.validateUser(req.body);
    if (!validationResult.success) {
      return res.json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    const newAdmin = new User({
      email,
      phone,
      username,
      password,
      role,
      profilePicture: file,
    });

    await newAdmin.save();
    res.status(200).json({ message: "Organizer registered successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error registering organizer", details: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const admin = await User.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res
      .status(200)
      .json({ message: "Login successful", token, role, userId: admin._id });
  } catch (err) {
    res.status(500).json({ error: "Login error", details: err.message });
  }
};

// dashboard routes
exports.addGroup = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Organizer") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }
    const { name, description, schedule, activityType, location } = req.body;

    console.log("Request body:", req.body);
    console.log("Group details:", {
      name,
      description,
      schedule,
      activityType,
      location,
    });

    if (!name || !description || !schedule || !activityType || !location) {
      return res.status(400).json({
        error:
          "All fields (name, description, schedule, activityType, location) are required.",
      });
    }

    const newGroup = new Group({
      name,
      description,
      schedule,
      activityType,
      location,
      organizer: adminId,
    });

    await newGroup.save();
    await admin.updateOne({ group: newGroup._id });

    res
      .status(200)
      .json({ message: "Group added successfully", group: newGroup });
  } catch (err) {
    console.error("Error adding group:", err);
    res.status(500).json({
      error: "An error occurred while adding the group.",
      details: err.message,
    });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Organizer") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }
    const group = await Group.findOne({ organizer: adminId });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json({
      groups: admin.group,
      name: group.name,
      description: group.description,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching groups", details: err.message });
  }
};

exports.getJoinRequests = async (req, res) => {
  try {
    const { groupId } = req.params; // query params http://localhost:5000/api/admin/join-requests?groupId=123
    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const joinRequests = group.joinRequests || [];

    res.json({ joinRequests });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching join requests", details: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }

    const group = await Group.findById(groupId);
    if (!group || group.organizer.toString() !== adminId) {
      return res
        .status(404)
        .json({ error: "Group not found or not authorized to delete" });
    }

    await Group.findByIdAndDelete(groupId);

    await User.findByIdAndUpdate(adminId, { $set: { group: null } });

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting group", details: err.message });
  }
};

exports.updateJoinRequest = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { groupId, requestId, status } = req.body;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const joinRequest = group.joinRequests.id(requestId);
    if (!joinRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status === "accept") {
      group.members.push({ userId: joinRequest.userId });
      joinRequest.status = "accepted";
    } else if (status === "reject") {
      joinRequest.status = "rejected";
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    await group.save();

    res.json({ message: "Request updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating request", details: err.message });
  }
};

// group routes
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.body;
    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }
    const group = await Group.findById(groupId)
      .populate("members", "username profilePicture")
      .populate("organizer", "username profilePicture");
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ group });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching group details", details: err.message });
  }
};

exports.updateGroupDetails = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { groupId, updatedGroupDetails } = req.body;

    if (!groupId || !updatedGroupDetails) {
      return res
        .status(400)
        .json({ error: "Missing groupId or updatedGroupDetails" });
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Organizer") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }

    const group = await Group.findById(groupId);
    if (!group || group.organizer.toString() !== adminId) {
      return res.status(404).json({ error: "Group not found" });
    }

    Object.assign(group, updatedGroupDetails);
    await group.save();

    res.json({ message: "Group updated successfully", group });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating group", details: err.message });
  }
};

// profile routes
exports.adminProfile = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({
      // personal info
      username: admin.username,
      profilePicture: admin.profilePicture,
      // goals

      //contact info
      email: admin.email,
      phone: admin.phone,
      revealContactInfo: admin.revealContactInfo,
      about: admin.about,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching admin profile", details: err.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { updatedProfile } = req.body;

    if (!updatedProfile) {
      return res.status(400).json({ error: "Missing updatedProfile" });
    }

    const allowedFields = [
      "username",
      "email",
      "phone",
      "profilePicture",
      "about",
      "revealContactInfo",
    ];
    const updates = Object.keys(updatedProfile);
    const isValidUpdate = updates.every((field) =>
      allowedFields.includes(field)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ error: "Invalid update fields" });
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (req.file) {
      admin.profilePicture = req.file.path;
    }

    Object.assign(admin, updatedProfile);
    await admin.save();

    res.json({ message: "Admin profile updated successfully", admin });
  } catch (error) {
    res.status(500).json({
      error: "Error updating admin profile",
      details: error.message,
    });
  }
};
