// ======================================================
// 🔗 UDoChain Verify Routes v4 — Full Functional + QR Control + Records
// ======================================================

import express from "express";
import {
  verifyHash,
  getValidationsByUser,
  getPrivateValidation,
  getBinaryFromAereware,
  cacheQRData,
  retrieveCachedQR,
  blockQR,
  regenerateQR,
} from "../controllers/verifyController.js";

const router = express.Router();

// ======================================================
// 🔍 VERIFICACIÓN PÚBLICA / PRIVADA
// ======================================================
// Verificar hash público o privado (desde QR o manual)
router.post("/hash", verifyHash);

// Obtener JSON privado desde Aereware (metadatos privados)
router.get("/private/:storageId", getPrivateValidation);

// Descargar binario ZIP custodiado en Aereware
router.get("/binary/:storageId", getBinaryFromAereware);

// ======================================================
// 📋 RECORDS PERSONALES DE VALIDACIÓN
// ======================================================
// Lista todas las validaciones del usuario autenticado
router.get("/all/:token", getValidationsByUser);

// ======================================================
// 🔒 CONTROL DE QR
// ======================================================
// Bloquear un QR (inhabilita su verificación pública/privada)
router.post("/block-qr/:txHash", blockQR);

// Regenerar un nuevo QR ID (reactiva y reemplaza el anterior)
router.post("/regenerate-qr/:txHash", regenerateQR);

// ======================================================
// 🧩 CACHE TEMPORAL DE QR (Flujo Login)
// ======================================================
// Guarda datos temporales del QR previo al login
router.post("/qr-cache", cacheQRData);

// Recupera datos del QR después del login exitoso
router.get("/qr-cache/:id", retrieveCachedQR);

// ======================================================
// 🧾 EXPORTACIÓN FINAL DEL ROUTER
// ======================================================
export default router;
