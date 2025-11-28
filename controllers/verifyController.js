import Validation from "../models/Validation.js";
import VerifyEvidence from "../models/VerifyEvidence.js";
import fetch from "node-fetch";

export const getValidationsByUser = async (req, res) => {
  try {
    const { token } = req.params;
    const email = req.headers["x-udo-email"];
    if (!token || !email)
      return res.status(400).json({ ok: false, message: "Missing token or email" });

    const validations = await Validation.find({ userEmail: email }).lean();
    const live = await VerifyEvidence.find({
      txHash: { $in: validations.map((v) => v.txHash) },
    }).lean();

    const merged = validations.map((v) => {
      const state = live.find((x) => x.txHash === v.txHash);
      return {
        evidenceTitle: v.evidenceTitle,
        txHash: v.txHash,
        storageId: v.storageId,
        pdfUrl: state?.currentPdfUrl || v.pdfUrl,
        createdAt: v.createdAt,
        type: v.type,
        status: state?.status || "active",
        qrActive: state?.qrActive ?? true,
        privateAccess: state?.privateAccess ?? false,
        version: state?.version || 1,
      };
    });

    res.json({ ok: true, validations: merged });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
