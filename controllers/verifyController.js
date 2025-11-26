// ======================================================
// 🧾 UDoChain Verify Controller v3.5
//  Mongo + Aereware + QR Control + Records
// ======================================================
import Validation from "../models/Validation.js";
import { getFromAereware, recoverEvidence } from "../utils/aerewareUtils.js";
import Arweave from "arweave";
import { v4 as uuidv4 } from "uuid";

// 🔹 Cache temporal (QR → login flow)
const qrCache = new Map();

// ======================================================
// 🔍 Verify Hash — Busca evidencia pública o privada
// ======================================================
export const verifyHash = async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) return res.status(400).json({ ok: false, message: "Missing hash" });

    let result = await Validation.findOne({ "files.hash": hash }).lean();

    if (!result) {
      const recovered = await recoverEvidence(`ar://${hash}`);
      if (recovered)
        return res.json({
          ok: true,
          recovered: true,
          source: "Aereware",
          evidenceTitle: recovered.evidenceTitle,
          storageId: recovered.storageId,
          recoveredAt: recovered.recoveredAt,
        });
      return res.json({
        ok: false,
        message: "⚠️ Evidence not found on UDoChain or Aereware network.",
      });
    }

    if (!result.qrActive)
      return res.json({
        ok: false,
        message: "QR disabled — verification blocked by owner.",
      });

    res.json({
      ok: true,
      evidenceTitle: result.evidenceTitle,
      validatedAt: result.createdAt,
      txHash: result.txHash,
      storageId: result.storageId,
      pdfUrl: result.pdfUrl,
      hasBinaryBackup: result.hasBinaryBackup,
      w3Note: result.w3Note,
    });
  } catch (err) {
    console.error("❌ verifyHash error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 📋 Get Validations by User — Records personales
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

    res.json({
      ok: true,
      validations: validations.map((v) => ({
        evidenceTitle: v.evidenceTitle,
        txHash: v.txHash,
        storageId: v.storageId,
        pdfUrl: v.pdfUrl,
        createdAt: v.createdAt,
        hasBinaryBackup: v.hasBinaryBackup,
        qrActive: v.qrActive,
        type: v.type,
      })),
    });
  } catch (err) {
    console.error("❌ getValidationsByUser error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🔒 getPrivateValidation — Desde Aereware o recovery
// ======================================================
export const getPrivateValidation = async (req, res) => {
  try {
    const { storageId } = req.params;
    if (!storageId)
      return res.status(400).json({ ok: false, message: "Missing storageId" });

    const data = await getFromAereware(storageId);
    if (!data) {
      const recovered = await recoverEvidence(storageId);
      if (recovered)
        return res.json({ ok: true, recovered: true, data: recovered });
      return res.json({ ok: false, message: "Not found on Aereware" });
    }

    res.json({ ok: true, data });
  } catch (err) {
    console.error("❌ getPrivateValidation error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 💾 getBinaryFromAereware — Descarga ZIP privado
// ======================================================
export const getBinaryFromAereware = async (req, res) => {
  try {
    const { storageId } = req.params;
    if (!storageId)
      return res.status(400).json({ ok: false, message: "Missing storageId" });

    const id = storageId.replace("ar://", "");
    const arweave = Arweave.init({
      host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
      port: parseInt(process.env.AEREWARE_GATEWAY_PORT || "443"),
      protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
    });

    const data = await arweave.transactions.getData(id, { decode: true });
    const buffer = Buffer.from(data);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${id}.zip"`);
    res.end(buffer);
  } catch (err) {
    console.error("❌ getBinaryFromAereware error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🚫 blockQR — Desactiva QR público/privado
// ======================================================
export const blockQR = async (req, res) => {
  try {
    const { txHash } = req.params;
    if (!txHash) return res.status(400).json({ ok: false, message: "Missing txHash" });

    await Validation.findOneAndUpdate({ txHash }, { qrActive: false });
    res.json({ ok: true, message: "QR blocked successfully." });
  } catch (err) {
    console.error("❌ blockQR error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// ♻️ regenerateQR — Genera nuevo QR ID (misma evidencia)
// ======================================================
export const regenerateQR = async (req, res) => {
  try {
    const { txHash } = req.params;
    if (!txHash) return res.status(400).json({ ok: false, message: "Missing txHash" });

    const newQR = uuidv4();
    await Validation.findOneAndUpdate(
      { txHash },
      { qrId: newQR, qrActive: true }
    );

    res.json({ ok: true, message: "QR regenerated.", newQR });
  } catch (err) {
    console.error("❌ regenerateQR error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🧩 Cache temporal para QR login flow
// ======================================================
export const cacheQRData = async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData)
      return res.status(400).json({ ok: false, message: "Missing QR data" });
    const id = uuidv4();
    qrCache.set(id, { qrData, createdAt: Date.now() });
    setTimeout(() => qrCache.delete(id), 5 * 60 * 1000);
    res.json({ ok: true, cacheId: id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const retrieveCachedQR = async (req, res) => {
  try {
    const { id } = req.params;
    const data = qrCache.get(id);
    if (!data)
      return res.json({ ok: false, message: "Cache expired or not found" });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
