const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/AdminModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid Token Format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Check in Admins first
    const admin = await Admin.findById(userId);
    if (admin) {
      req.user = {
        id: admin._id,
        username: admin.username || "", // Optional if needed
        role: "admin",
      };
      return next();
    }

    // Check in Users
    const user = await User.findById(userId);
    if (user) {
      req.user = {
        id: user._id,
        username: user.username || "", // Optional if needed
        role: "user",
      };
      return next();
    }

    return res.status(401).json({ message: "Invalid user or admin" });
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
