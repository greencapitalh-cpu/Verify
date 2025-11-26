// ======================================================
// 📘 Mongoose Schema — VerifyEvidence (Estado Vivo Actual v4.5)
// ======================================================
import mongoose from "mongoose";

const verifyEvidenceSchema = new mongoose.Schema(
  {
    txHash: { type: String, required: true, unique: true },
    storageId: { type: String, default: null },
    originalPdfUrl: { type: String, default: null },
    currentPdfUrl: { type: String, default: null },
    updatedBy: { type: String, default: null },
    updatedAt: { type: Date, default: null },
    qrId: { type: String, default: null },
    qrActive: { type: Boolean, default: true },
    privateAccess: { type: Boolean, default: false },
    evidenceTitle: { type: String, default: null },
    type: {
      type: String,
      enum: ["Validate", "Sign", "Trace", "Vote", "Other"],
      default: "Validate",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "updated", "archived"],
      default: "active",
    },
    version: { type: Number, default: 1 },

    // 🧾 Historial
    history: [
      {
        action: String,
        userEmail: String,
        date: { type: Date, default: Date.now },
        notes: String,
      },
    ],

    // 🧠 Auditoría
    origin: { type: String, enum: ["validate", "verify"], default: "verify" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "verify_evidences" }
);

export default global.mongoConnections?.verifyConn
  ? global.mongoConnections.verifyConn.model("VerifyEvidence", verifyEvidenceSchema)
  : mongoose.model("VerifyEvidence", verifyEvidenceSchema);
