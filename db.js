// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// 📦 Usa la base VERIFY si existe, o VALIDATE como fallback
const mongoUri =
  process.env.MONGO_URI_VERIFY ||
  process.env.MONGO_URI_VALIDATE ||
  process.env.MONGO_URI;

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      dbName: "udochain_verify", // 👈 cada módulo con su propia base
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ Connected to MongoDB at ${mongoUri}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

connectDB();
