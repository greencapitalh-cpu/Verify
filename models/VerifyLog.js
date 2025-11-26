import mongoose from "mongoose";

const verifyLogSchema = new mongoose.Schema(
  {
    userEmail: String,
    userId: String,
    evidenceHash: String,
    type: { type: String, enum: ["public", "private"], default: "public" },
    source: String, // "QR", "Manual", "WAPP", "recovered"
    ip: String,
    device: String,
    verifiedAt: { type: Date, default: Date.now },
  },
  { collection: "verify_logs" }
);

export default mongoose.model("VerifyLog", verifyLogSchema);
