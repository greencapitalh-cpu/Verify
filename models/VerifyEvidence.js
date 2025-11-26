// ======================================================
// 📘 Mongoose Schema — VerifyEvidence (Estado Vivo Actual)
// ======================================================
import mongoose from "mongoose";

const verifyEvidenceSchema = new mongoose.Schema(
  {
    // 🔗 Referencia al origen (Validate)
    txHash: { type: String, required: true, unique: true },
    storageId: { type: String, default: null },
    originalPdfUrl: { type: String, default: null },

    // 🧩 Datos dinámicos actualizados
    currentPdfUrl: { type: String, default: null },
    updatedBy: { type: String, default: null },
    updatedAt: { type: Date, default: null },

    // 🛡️ Control de QR y acceso
    qrId: { type: String, default: null },
    qrActive: { type: Boolean, default: true },
    privateAccess: { type: Boolean, default: false },

    // 🧠 Información general
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

    // 🧾 Historial de modificaciones
    history: [
      {
        action: String, // "update_pdf", "block_qr", etc.
        userEmail: String,
        date: { type: Date, default: Date.now },
        notes: String,
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  { collection: "verify_evidences" }
);

// 📘 Usa la conexión de Verify (udochain_verify)
export default global.mongoConnections?.verifyConn
  ? global.mongoConnections.verifyConn.model("VerifyEvidence", verifyEvidenceSchema)
  : mongoose.model("VerifyEvidence", verifyEvidenceSchema);
