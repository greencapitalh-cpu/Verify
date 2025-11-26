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

// 🔍 Public/Private verifications
router.post("/hash", verifyHash);
router.get("/private/:storageId", getPrivateValidation);
router.get("/binary/:storageId", getBinaryFromAereware);

// 👤 User records
router.get("/all/:token", getValidationsByUser);

// 🔒 QR control
router.post("/block-qr/:txHash", blockQR);
router.post("/regenerate-qr/:txHash", regenerateQR);

// 🧩 Cache temporal (QR → login)
router.post("/qr-cache", cacheQRData);
router.get("/qr-cache/:id", retrieveCachedQR);

export default router;
