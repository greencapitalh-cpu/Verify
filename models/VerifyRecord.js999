// ======================================================
// 📘 Mongoose Schema — VerifyRecord (User / System Actions)
// ======================================================
import mongoose from "mongoose";

const verifyRecordSchema = new mongoose.Schema(
  {
    // 🧑 Usuario que realizó la acción
    userEmail: { type: String, default: null },
    sessionId: { type: String, default: null },

    // 🔗 Identificador de la evidencia
    txHash: { type: String, required: true },
    storageId: { type: String, default: null },

    // ⚙️ Acción y resultado
    action: {
      type: String,
      enum: [
        "verify_hash",
        "verify_attempt_blocked",
        "block_qr",
        "regenerate_qr",
        "download_zip",
        "recovered_from_aereware",
        "update_pdf",
        "login_via_qr",
      ],
      required: true,
    },
    result: {
      type: String,
      enum: ["success", "blocked", "error"],
      default: "success",
    },

    // 🕐 Metadatos de auditoría
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "verify_records" }
);

// 📘 Usa la conexión del entorno verifyConn
export default global.mongoConnections?.verifyConn
  ? global.mongoConnections.verifyConn.model("VerifyRecord", verifyRecordSchema)
  : mongoose.model("VerifyRecord", verifyRecordSchema);
