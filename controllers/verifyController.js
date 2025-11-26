// ======================================================
// 🧾 UDoChain Verify Controller v2.1 — Mongo + Aereware Full Recovery
// ======================================================
import Validation from "../models/Validation.js";
import Arweave from "arweave";
import { v4 as uuidv4 } from "uuid";
import { getFromAereware, recoverEvidence } from "../utils/aerewareUtils.js";

// 🧠 Cache temporal (QR → login flow)
const qrCache = new Map();

// ======================================================
// 🔹 verifyHash — Busca en Mongo, y si no está, intenta recuperar desde Aereware
// ======================================================
export const verifyHash = async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) return res.status(400).json({ ok: false, message: "Missing hash" });

    // Buscar en Mongo
    let result = await Validation.findOne({ "files.hash": hash }).lean();

    // Si no existe, intentar recuperar desde Aereware
    if (!result) {
      console.log("⚠️ Evidence not found in Mongo. Trying Aereware...");
      const recovered = await recoverEvidence(hash);
      if (recovered) {
        console.log("✅ Evidence recovered from Aereware:", recovered.storageId);
        return res.json({
          ok: true,
          recovered: true,
          source: "Aereware",
          evidenceTitle: recovered.evidenceTitle,
          storageId: recovered.storageId,
          recoveredAt: recovered.recoveredAt,
          pdfUrl: recovered.meta?.pdfUrl || null,
          meta: recovered.meta,
        });
      }
      return res.json({
        ok: false,
        message: "Evidence not found in Mongo or Aereware.",
      });
    }

    // Retornar resultado Mongo
    res.json({
      ok: true,
      source: "MongoDB",
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
// 🔹 getValidationsByUser — Lista validaciones del usuario autenticado
// ======================================================
export const getValidationsByUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ ok: false, message: "Missing token" });

    const validations = await Validation.find({ userToken: token })
      .sort({ createdAt: -1 })
      .lean();

    if (!validations.length)
      return res.json({ ok: false, message: "No validations found for this user" });

    res.json({
      ok: true,
      count: validations.length,
      validations: validations.map((v) => ({
        evidenceTitle: v.evidenceTitle,
        txHash: v.txHash,
        storageId: v.storageId,
        pdfUrl: v.pdfUrl,
        createdAt: v.createdAt,
        hasBinaryBackup: v.hasBinaryBackup,
      })),
    });
  } catch (err) {
    console.error("❌ getValidationsByUser error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🔹 getPrivateValidation — Recupera JSON desde Aereware (metadatos privados)
// ======================================================
export const getPrivateValidation = async (req, res) => {
  try {
    const { storageId } = req.params;
    if (!storageId)
      return res.status(400).json({ ok: false, message: "Missing storageId" });

    const data = await getFromAereware(storageId);
    if (!data) return res.json({ ok: false, message: "Not found on Aereware" });

    res.json({ ok: true, storageId, data });
  } catch (err) {
    console.error("❌ getPrivateValidation error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🔹 getBinaryFromAereware — Descarga binario custodiado (ZIP) desde Arweave
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
// 🔹 cacheQRData — Guarda temporalmente el QR escaneado
// ======================================================
export const cacheQRData = async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData)
      return res.status(400).json({ ok: false, message: "Missing QR data" });

    const id = uuidv4();
    qrCache.set(id, { qrData, createdAt: Date.now() });
    setTimeout(() => qrCache.delete(id), 5 * 60 * 1000); // 5 min TTL
    res.json({ ok: true, cacheId: id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ======================================================
// 🔹 retrieveCachedQR — Recupera datos QR tras login
// ======================================================
export const retrieveCachedQR = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ ok: false, message: "Missing cache id" });

    const data = qrCache.get(id);
    if (!data) return res.json({ ok: false, message: "Cache expired or not found" });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
