const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────
// @route   PUT /api/user/details
// @desc    Save user's physical details (age, weight, height, gender, level)
// @access  Private (JWT required)
// ─────────────────────────────────────────────
router.put("/details", protect, async (req, res) => {
  try {
    const { age, weight, height, gender, level, name } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (age !== undefined) user.age = age;
    if (weight !== undefined) user.weight = weight;
    if (height !== undefined) user.height = height;
    if (gender !== undefined) user.gender = gender;
    if (level !== undefined) user.level = level;
    if (name !== undefined) user.name = name;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      weight: updatedUser.weight,
      height: updatedUser.height,
      gender: updatedUser.gender,
      level: updatedUser.level,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update details error:", error.message);
    res.status(500).json({ message: "Server error updating details" });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
// ─────────────────────────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

module.exports = router;
