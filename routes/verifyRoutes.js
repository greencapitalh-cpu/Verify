import express from "express";
import { verifyHash } from "../controllers/verifyController.js";

const router = express.Router();
router.post("/hash", verifyHash);

export default router;
