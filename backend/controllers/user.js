const User = require("../modals/User");
const Group = require("../modals/Group");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth routes
exports.userSignup = async (req, res) => {
  try {
    const { email, username, password, phone, role } = req.body;
    const profilePicture = req.file.path;

    // validate with zod
    const validationResult = User.validateUser(req.body);
    if (!validationResult.success) {
      return res.json({
        error: "Validation failed",
        details: validationResult.error.errors.map((err) => err.message),
      });
    }

    const newUser = new User({
      email,
      username,
      password,
      phone,
      role,
      profilePicture,
    });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.json({ error: "Error registering user", detail: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res
      .status(200)
      .json({ message: "Login successful", token, role, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Login error", details: err.message });
  }
};

// dashboard routes
exports.getRecommendedBuddies = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fitnessDetails = {}, location } = user;
    const { fitnessGoals = "", workoutPreferences = [] } = fitnessDetails;

    const query = {
      _id: { $ne: userId },
      "fitnessDetails.fitnessGoals": { $regex: fitnessGoals, $options: "i" },
      "fitnessDetails.workoutPreferences": { $in: workoutPreferences },
    };

    // add proximity filter
    if (location?.coordinates) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: location.coordinates },
          $maxDistance: 10000, // 10 km
        },
      };
    }

    const recommendedBuddies = await User.find(query).select(
      "username profilePicture fitnessDetails location"
    );

    if (recommendedBuddies.length === 0) {
      return res.status(404).json({ message: "No recommended buddies found" });
    }

    res.json({ recommendedBuddies });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching recommended buddies",
      details: err.message,
    });
  }
};

exports.getAvailableGroups = async (req, res) => {
  try {
    const userid = req.userId;

    // find user
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const location = user.location?.coordinates;
    if (!location || location.length !== 2) {
      return res
        .status(400)
        .json({ error: "Invalid or missing user location" });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location,
          },
          $maxDistance: 10000,
        },
      },
    };

    const groups = await Group.find(query);

    if (groups.length === 0) {
      return res.status(200).json({ message: "No groups found", groups: [] });
    }

    res.status(200).json(groups);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching available groups", details: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.group) {
      return res.status(400).json({
        error:
          "You are already a member of a group. Leave your current group to join another.",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const existingRequest = group.joinRequests.find(
      (request) => request.user.toString() === userId
    );
    if (existingRequest) {
      return res.status(400).json({ error: "Request already exists" });
    }

    group.joinRequests.push({ user: userId, username: user.username });
    await group.save();

    res.json({ message: "Request sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error sending request", details: err.message });
  }
};

exports.getUserGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("group");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.group) {
      return res.status(200).json({ message: "User is not part of any group" });
    }

    res.status(200).json({
      message: "User is part of a group",
      group: user.group,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user group", details: err.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroup = user.group.find((group) => group.toString() === groupId);
    if (!user.group) {
      return res.status(400).json({ error: "User is not part of any group" });
    }

    user.group = user.group.filter((group) => group.toString() !== groupId);
    await user.save();

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );

    await group.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error leaving group", details: err.message });
  }
};

// profile routes
exports.userProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      //personal info
      username: user.username,
      profilePicture: user.profilePicture,
      fitnessGoals: user.fitnessDetails.fitnessGoals,
      about: user.about,

      //Fitness history
      achivements: user.fitnessDetails.achievements,
      //contact info // optional visibility based on privacy settings
      email: user.email,
      phone: user.phone,
      revealContactInfo: user.revealContactInfo,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user profile", details: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
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
      "fitnessDetails",
      "location",
      "revealContactInfo",
    ];
    const updates = Object.keys(updatedProfile);
    const isValidUpdate = updates.every((field) =>
      allowedFields.includes(field)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ error: "Invalid update fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      user.profilePicture = req.file.path;
    }

    Object.assign(user, updatedProfile);
    await user.save();

    res.json({ message: "User profile updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating user profile", details: err.message });
  }
};
