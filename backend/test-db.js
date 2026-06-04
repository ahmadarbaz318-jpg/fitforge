require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  console.log("⏳ Testing MongoDB Connection...");
  console.log("URI:", process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("❌ FAILED: Could not connect to MongoDB.");
    console.error("Error Detail:", error.message);
    process.exit(1);
  }
};

testConnection();
