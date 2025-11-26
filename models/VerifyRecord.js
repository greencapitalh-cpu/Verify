// ======================================================
// 🧾 Mongoose Schema — VerifyRecord (Logs de Verificaciones)
// ======================================================
import mongoose from "mongoose";

// 📦 Cada registro documenta una acción dentro de verify.udochain.com
const verifyRecordSchema = new mongoose.Schema(
  {
    userEmail: { type: String, default: "anonymous" }, // si no hay login
    userToken: { type: String, default: null }, // si viene desde app/wapp
    txHash: { type: String, required: true }, // hash verificado
    storageId: { type: String, default: null }, // solo si aplica (privado)
    evidenceTitle: { type: String, default: null },
    type: {
      type: String,
      enum: ["Validate", "Sign", "Trace", "Vote", "Other"],
      default: "Validate",
    },
    action: {
      type: String,
      enum: [
        "verify_public",
        "verify_private",
        "download_private_zip",
        "block_qr",
        "regenerate_qr",
        "pdf_updated",
      ],
      required: true,
    },
    result: {
      type: String,
      enum: ["success", "failed", "blocked"],
      default: "success",
    },
    details: { type: Object, default: {} }, // datos extras, como IP, browser, etc.
    verifiedAt: { type: Date, default: Date.now },
  },
  { collection: "verify_records" }
);

// 📘 Usará la segunda conexión (udochain_verify)
export default global.mongoConnections?.verifyConn
  ? global.mongoConnections.verifyConn.model("VerifyRecord", verifyRecordSchema)
  : mongoose.model("VerifyRecord", verifyRecordSchema);
