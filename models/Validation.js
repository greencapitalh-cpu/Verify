// ======================================================
// 📘 Mongoose Schema — Validation (Extended v4 Premium Ready)
//  Compatible con Validate + Verify v4 + Control de QR + Stats
// ======================================================
import mongoose from "mongoose";

// ======================================================
// 🧩 Subdocumento — Archivos asociados a la validación
// ======================================================
const fileSchema = new mongoose.Schema({
  name: { type: String },
  hash: { type: String },
});

// ======================================================
// 🧾 Esquema principal — Validaciones UDoChain
// ======================================================
const validationSchema = new mongoose.Schema(
  {
    // 👤 Datos del usuario que generó la evidencia
    userEmail: { type: String },
    userToken: { type: String },

    // 📄 Información de la evidencia
    evidenceTitle: { type: String },
    txHash: { type: String },
    storageId: { type: String },
    pdfUrl: { type: String },
    w3Note: { type: String },
    hasBinaryBackup: { type: Boolean, default: false },

    // 🧱 Archivos originales asociados
    files: [fileSchema],

    // 🏷️ Tipo de evidencia (clasificación)
    type: {
      type: String,
      enum: ["Validate", "Sign", "Trace", "Vote", "Other"],
      default: "Validate",
    },

    // 🔐 Control de QR y accesos
    qrId: { type: String, default: null },
    qrActive: { type: Boolean, default: true },

    // ⏱️ Métricas de uso y estadísticas
    lastVerifiedAt: { type: Date, default: null },
    verifiedCount: { type: Number, default: 0 },

    // 📆 Registro temporal
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "validations" }
);

// ======================================================
// 🧩 Exportación del modelo para uso compartido
// ======================================================
export default mongoose.model("Validation", validationSchema);
