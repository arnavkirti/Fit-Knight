const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

exports.userSignup = async (req, res) => {
  try {
    const { username, password, profilePicture, role, fitnessDetails } =
      req.body;

    const newUser = new User({
      username,
      password,
      profilePicture,
      role: "BuddyFinder",
      fitnessDetails,
    });

    await newUser.save();
    resjson({ message: "User registered successfully!" });
  } catch (err) {
    res.json({ error: "Error registering user", detail: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login error", details: err.message });
  }
};
