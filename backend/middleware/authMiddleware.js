const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized access, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Organizer") {
      return res
        .status(403)
        .json({ error: "Access forbidden: not an Organizer" });
    }

    req.adminId = decoded.id;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "Invalid or expired token", details: err.message });
  }
};

exports.verifyUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized access, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "BuddyFinder") {
      return res
        .status(403)
        .json({ error: "Access forbidden: not a BuddyFinder" });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "Invalid or expired token", details: err.message });
  }
}