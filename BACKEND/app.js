const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 🆕 Separate route files
const userAuthRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/authAdmin");
const pdfRoutes = require("./routes/pdfRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth/user", userAuthRoutes);   // 👤 User login/register
app.use("/api/auth/admin", adminAuthRoutes); // 🛡️ Admin login/register
app.use("/api/pdf", pdfRoutes);              // 📄 PDF-related routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
