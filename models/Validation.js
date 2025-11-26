// ======================================================
// 📘 Mongoose Schema — Validation (Extended v3.5)
// ======================================================
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  hash: String,
});

const validationSchema = new mongoose.Schema(
  {
    userEmail: String,
    userToken: String,
    evidenceTitle: String,
    txHash: String,
    storageId: String,
    pdfUrl: String,
    w3Note: String,
    hasBinaryBackup: Boolean,
    files: [fileSchema],
    type: {
      type: String,
      enum: ["Validate", "Sign", "Trace", "Vote", "Other"],
      default: "Validate",
    },
    qrId: { type: String, default: null },
    qrActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "validations" }
);

export default mongoose.model("Validation", validationSchema);
