const express = require("express");
const Admin = require("../models/AdminModel");
const { hashPassword, comparePassword } = require("../middlewares/bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register Admin
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const newAdmin = new Admin({ username, email, password: hashedPassword });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering admin" });
    }
});

// Login Admin
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || "adminSecretKey",
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Count admins
router.get("/count", async (req, res) => {
    const count = await Admin.countDocuments();
    res.json({ count });
  });
  
  // Recent admins (last 5)
  router.get("/recent", async (req, res) => {
    const admins = await Admin.find().sort({ createdAt: -1 }).limit(5);
    res.json({ admins });
  });
  

module.exports = router;
