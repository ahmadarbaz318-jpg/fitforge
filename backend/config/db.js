const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (cloudError) {
    console.error(`❌ Cloud MongoDB Connection Failed: ${cloudError.message}`);
    try {
      console.log("🔄 Attempting to connect to local MongoDB fallback (mongodb://localhost:27017/fitforge)...");
      const localConn = await mongoose.connect("mongodb://localhost:27017/fitforge", {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`❌ Local MongoDB Connection Failed: ${localError.message}`);
      console.log("⚠️ Running server in Offline mode. Frontend will use LocalStorage fallback for authentication.");
    }
  }
};

module.exports = connectDB;
