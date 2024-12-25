const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

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
    res.json({ message: "Organizer registered successfully!" });
  } catch (err) {
    res.json({ error: "Error registering organizer", details: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await User.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login error", details: err.message });
  }
};
