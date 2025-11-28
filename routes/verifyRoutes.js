import express from "express";
import { getValidationsByUser } from "../controllers/verifyController.js";

const router = express.Router();
router.get("/all/:token", getValidationsByUser);
export default router;
