const User = require("../modals/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminSignup = async (req, res) => {
  try {
    // validate with zod
    const validationResult = User.validateUser(req.body);
    if (!validationResult.success) {
      return res.json({
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }

    const { username, password, profilePicture, groupDetails } = req.body;

    const newAdmin = new User({
      username,
      password,
      profilePicture,
      role: "Organizer",
      groupDetails,
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
    const { username, password } = req.body;
    const admin = await User.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login error", details: err.message });
  }
};

exports.addGroup = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { groupDetails } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Organizer") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }

    admin.groups.push(groupDetails);
    await admin.save();

    res
      .status(200)
      .json({ message: "Group added successfully", group: groupDetails });
  } catch (err) {
    res.status(500).json({ error: "Error adding group", details: err.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const adminId = req.adminId;

    const admin = await User.findById(adminId).select("groups");
    if (!admin || admin.role !== "Organizer") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }

    res.json(admin.groups);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching groups", details: err.message });
  }
};
