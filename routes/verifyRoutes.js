// ======================================================
// 🔗 UDoChain Verify Routes v2 — Full Functional Version
// ======================================================

import express from "express";
import {
  verifyHash,
  getValidationsByUser,
  getPrivateValidation,
  getBinaryFromAereware,
  cacheQRData,
  retrieveCachedQR,
} from "../controllers/verifyController.js";

const router = express.Router();

// 🔍 Verificar archivo o hash público
router.post("/hash", verifyHash);

// 🔐 Obtener validaciones del usuario autenticado
router.get("/all/:token", getValidationsByUser);

// 🔒 Recuperar JSON privado desde Aereware (metadata)
router.get("/private/:storageId", getPrivateValidation);

// 💾 Recuperar ZIP custodiado desde Aereware (binario)
router.get("/binary/:storageId", getBinaryFromAereware);

// 🧩 Guardar cache temporal del QR (para flujo login)
router.post("/qr-cache", cacheQRData);
router.get("/qr-cache/:id", retrieveCachedQR);

export default router;
