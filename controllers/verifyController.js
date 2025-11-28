import Validation from "../models/Validation.js";
import VerifyEvidence from "../models/VerifyEvidence.js";

// POST /api/verify/hash
export const verifyHash = async (req, res) => {
  try {
    const { hash } = req.body;
    const email = req.headers["x-udo-email"];

    if (!hash) return res.status(400).json({ ok: false, error: "Missing hash" });

    // 1️⃣ Buscar en Validation (evidencia original)
    const validation = await Validation.findOne({ "files.hash": hash }).lean();

    if (!validation) {
      return res.json({ ok: false, error: "No validation found for this hash." });
    }

    // 2️⃣ Buscar estado vivo en VerifyEvidence
    const live = await VerifyEvidence.findOne({ txHash: validation.txHash }).lean();

    // 3️⃣ Armar respuesta combinada
    res.json({
      ok: true,
      evidenceTitle: validation.evidenceTitle,
      txHash: validation.txHash,
      storageId: validation.storageId,
      pdfUrl: live?.currentPdfUrl || validation.pdfUrl,
      qrActive: live?.qrActive ?? true,
      status: live?.status || "active",
      version: live?.version || 1,
      validatedAt: validation.createdAt,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
