require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userDetails");

// ─── Connect to MongoDB ───────────────────────
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ─── Health Check ─────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "💪 FitForge API is running",
    version: "1.0.0",
    endpoints: {
      signup: "POST /api/auth/signup",
      login:  "POST /api/auth/login",
      updateDetails: "PUT /api/user/details (JWT required)",
      getProfile:    "GET /api/user/profile (JWT required)",
    },
  });
});

// ─── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FitForge backend running on http://localhost:${PORT}`);
  console.log(`📄 Environment: ${process.env.NODE_ENV || "development"}`);
});
