const User = require("../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.userSignup = async (req, res) => {
  try {
    // validate with zod
    const validationResult = User.validateUser(req.body);
    if (!validationResult.success) {
      return res.json({
        error: "Validation failed",
        details: validationResult.error.errors.map((err) => err.message),
      });
    }

    const {
      username,
      password,
      profilePicture,
      role,
      fitnessDetails,
      location,
    } = req.body;

    const newUser = new User({
      username,
      password,
      role,
      profilePicture,
      location,
      role: "BuddyFinder",
      fitnessDetails,
    });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
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

exports.getRecommendedBuddies = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fitnessDetails = {}, location } = user;
    const { fitnessGoals = "", workoutPreferences = [] } = fitnessDetails;

    const query = {
      username: { $ne: username },
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
    const { activityType, location, maxDistance } = req.query;

    const query = {
      role: "Organizer",
      ...(activityType && { "groups.activityType": activityType }),
    };

    if (location && maxDistance) {
      query["groups.location"] = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.split(",").map(Number),
          },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }

    const organizers = await User.find(query).select("groups");

    const allGroups = organizers.flatMap((user) =>
      user.groups.filter(
        (group) => !activityType || group.activityType === activityType
      )
    );

    res.json(allGroups);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching available groups", details: err.message });
  }
};
