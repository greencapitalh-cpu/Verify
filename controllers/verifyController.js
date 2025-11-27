// ======================================================
// 🧾 UDoChain Verify Controller v4.6
// ======================================================
import Validation from "../models/Validation.js";
import VerifyEvidence from "../models/VerifyEvidence.js";
import VerifyRecord from "../models/VerifyRecord.js";
import { getFromAereware, recoverEvidence } from "../utils/aerewareUtils.js";
import Arweave from "arweave";
import { v4 as uuidv4 } from "uuid";

const qrCache = new Map();

// ======================================================
// 🔍 verifyHash
// ======================================================
export const verifyHash = async (req, res) => {
  try {
    const { hash, userEmail, sessionId } = req.body;
    if (!hash) return res.status(400).json({ ok: false, message: "Missing hash" });

    let result = await Validation.findOne({ "files.hash": hash }).lean();
    if (!result) {
      const recovered = await recoverEvidence(`ar://${hash}`);
      if (recovered)
        return res.json({ ok: true, recovered: true, ...recovered });
      return res.json({ ok: false, message: "⚠️ Evidence not found." });
    }

    let live = await VerifyEvidence.findOne({ txHash: result.txHash });
    if (!live) {
      live = await VerifyEvidence.create({
        txHash: result.txHash,
        storageId: result.storageId,
        evidenceTitle: result.evidenceTitle,
        type: result.type || "Validate",
        qrActive: true,
        status: "active",
      });
    }

    if (!live.qrActive)
      return res.json({ ok: false, message: "QR disabled by owner." });

    await VerifyRecord.create({
      userEmail,
      sessionId,
      txHash: result.txHash,
      action: "verify_hash",
      result: "success",
    });

    res.json({
      ok: true,
      evidenceTitle: result.evidenceTitle,
      txHash: result.txHash,
      storageId: result.storageId,
      pdfUrl: live.currentPdfUrl || result.pdfUrl,
      qrActive: live.qrActive,
      status: live.status,
      version: live.version || 1,
    });
  } catch (err) {
    console.error("❌ verifyHash error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 📋 getValidationsByUser
// ======================================================
export const getValidationsByUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ ok: false, message: "Missing token" });

    const validations = await Validation.find({ userToken: token })
      .sort({ createdAt: -1 })
      .lean();

    if (!validations.length)
      return res.json({ ok: false, message: "No validations found." });

    const liveData = await VerifyEvidence.find({
      txHash: { $in: validations.map((v) => v.txHash) },
    }).lean();

    const merged = validations.map((v) => {
      const live = liveData.find((x) => x.txHash === v.txHash);
      return {
        evidenceTitle: v.evidenceTitle,
        txHash: v.txHash,
        storageId: v.storageId,
        pdfUrl: live?.currentPdfUrl || v.pdfUrl,
        createdAt: v.createdAt,
        qrActive: live?.qrActive ?? true,
        type: v.type || "Validate",
        status: live?.status || "active",
        version: live?.version || 1,
      };
    });

    res.json({ ok: true, validations: merged });
  } catch (err) {
    console.error("❌ getValidationsByUser error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🚫 blockQR
// ======================================================
export const blockQR = async (req, res) => {
  try {
    const { txHash } = req.params;
    if (!txHash) return res.status(400).json({ ok: false, message: "Missing txHash" });

    await VerifyEvidence.findOneAndUpdate(
      { txHash },
      { qrActive: false, status: "blocked" }
    );
    res.json({ ok: true, message: "QR blocked successfully." });
  } catch (err) {
    console.error("❌ blockQR error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// ♻️ regenerateQR
// ======================================================
export const regenerateQR = async (req, res) => {
  try {
    const { txHash } = req.params;
    if (!txHash) return res.status(400).json({ ok: false, message: "Missing txHash" });

    await VerifyEvidence.findOneAndUpdate(
      { txHash },
      { qrActive: true, status: "active" }
    );
    res.json({ ok: true, message: "New QR generated successfully." });
  } catch (err) {
    console.error("❌ regenerateQR error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
