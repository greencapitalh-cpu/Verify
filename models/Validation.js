// ======================================================
// 📘 Mongoose Schema — Validation (Shared with Validate)
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
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "validations" }
);

export default mongoose.model("Validation", validationSchema);
