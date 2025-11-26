// ======================================================
// 📘 Mongoose Schema — Validation (Extended v4.5)
// ======================================================
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String },
  hash: { type: String },
});

const validationSchema = new mongoose.Schema(
  {
    // 👤 Usuario creador
    userEmail: { type: String },
    userToken: { type: String },

    // 📄 Datos de la evidencia
    evidenceTitle: { type: String },
    txHash: { type: String },
    storageId: { type: String },
    pdfUrl: { type: String },
    w3Note: { type: String },
    hasBinaryBackup: { type: Boolean, default: false },
    files: [fileSchema],

    // 🏷️ Clasificación
    type: {
      type: String,
      enum: ["Validate", "Sign", "Trace", "Vote", "Other"],
      default: "Validate",
    },

    // 🔐 Control QR
    qrId: { type: String, default: null },
    qrActive: { type: Boolean, default: true },

    // 📊 Auditoría interna
    origin: { type: String, enum: ["validate", "verify"], default: "validate" },
    verifiedCount: { type: Number, default: 0 },
    lastVerifiedAt: { type: Date, default: null },

    // 📆 Registro
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "validations" }
);

export default mongoose.model("Validation", validationSchema);
