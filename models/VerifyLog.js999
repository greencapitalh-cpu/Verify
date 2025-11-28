// ======================================================
// 📗 Mongoose Schema — VerifyLog (System Internal Events)
// ======================================================
import mongoose from "mongoose";

const verifyLogSchema = new mongoose.Schema(
  {
    // 🧩 Tipo de evento
    eventType: {
      type: String,
      enum: [
        "system_start",
        "db_connection",
        "auto_recovery",
        "evidence_sync",
        "arweave_error",
        "mongo_error",
        "info",
        "warning",
        "error",
      ],
      default: "info",
    },

    // 🧠 Mensaje o descripción
    message: { type: String, required: true },

    // 📄 Detalle opcional o JSON del contexto
    context: { type: Object, default: {} },

    // 🕐 Timestamp automático
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "verify_logs" }
);

// 📘 Usa la conexión de Verify (udochain_verify)
export default global.mongoConnections?.verifyConn
  ? global.mongoConnections.verifyConn.model("VerifyLog", verifyLogSchema)
  : mongoose.model("VerifyLog", verifyLogSchema);
