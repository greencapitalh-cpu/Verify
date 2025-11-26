import express from "express";
import {
  verifyByHash,
  verifyPrivateData,
  listUserValidations
} from "../controllers/verifyController.js";

const router = express.Router();

router.post("/hash", verifyByHash);
router.get("/private/:storageId", verifyPrivateData);
router.get("/all/:token", listUserValidations);

export default router;
