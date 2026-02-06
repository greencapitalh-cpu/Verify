// ======================================================
// 🔍 UDoChain Verify Controller — PROTOCOLO FUNCIONAL
// Fuente de verdad: api.udochain.com (Validate)
// ======================================================

import fetch from "node-fetch";
import VerifyEvidence from "../models/VerifyEvidence.js";

// POST /api/verify/hash
export const verifyHash = async (req, res) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({
        ok: false,
        error: "Missing hash",
      });
    }

    // --------------------------------------------------
    // 🌍 Fuente de verdad: VALIDATE API
    // --------------------------------------------------
    const VALIDATE_API =
      process.env.VALIDATE_API_BASE ||
      "https://api.udochain.com/validate/api";

    const validateRes = await fetch(
      `${VALIDATE_API}/verify/hash`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash }),
      }
    );

    if (!validateRes.ok) {
      return res.json({
        ok: false,
        error: "Validation service unreachable",
      });
    }

    const validation = await validateRes.json();

    if (!validation?.ok) {
      return res.json({
        ok: false,
        error: "No validation found for this hash.",
      });
    }

    // --------------------------------------------------
    // 🧠 Estado vivo (Verify local DB)
    // --------------------------------------------------
    const live = await VerifyEvidence.findOne({
      txHash: validation.txHash,
    }).lean();

    // --------------------------------------------------
    // ✅ Respuesta unificada
    // --------------------------------------------------
    return res.json({
      ok: true,

      // Evidencia base (Validate)
      evidenceTitle: validation.evidenceTitle,
      txHash: validation.txHash,
      storageId: validation.storageId,
      pdfUrl: live?.currentPdfUrl || validation.pdfUrl,
      files: validation.files || [],
      gps: validation.gps || null,
      validatedAt: validation.validatedAt,

      // Estado dinámico (Verify)
      qrActive: live?.qrActive ?? true,
      status: live?.status || "active",
      version: live?.version || 1,
    });
  } catch (err) {
    console.error("❌ verifyHash error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal verify error",
    });
  }
};
