import { getMongoEvidence, getUserEvidences, insertRecoveredEvidence } from "../utils/mongo.js";
import { getPolygonTransaction } from "../utils/polygon.js";
import { readMetadata, readBinary, recoverEvidence } from "../utils/aereware.js";

export async function verifyByHash(req, res) {
  try {
    const { hash } = req.body;
    if (!hash) return res.json({ ok: false, message: "Missing hash." });

    const record = await getMongoEvidence({ "files.hash": hash });
    if (record) {
      return res.json({
        ok: true,
        evidenceTitle: record.evidenceTitle,
        txHash: record.txHash,
        pdfUrl: record.pdfPublic || record.pdfPrivate,
        storageId: record.storageId,
      });
    }

    // Try on-chain confirmation
    const txData = await getPolygonTransaction(hash);
    if (txData?.found) return res.json({ ok: true, ...txData });

    return res.json({ ok: false, message: "Hash not found in Mongo or Polygon." });
  } catch (err) {
    console.error("Error verifyByHash:", err);
    res.status(500).json({ ok: false, error: "Internal error verifying hash" });
  }
}

export async function verifyPrivateData(req, res) {
  const { storageId } = req.params;
  if (!storageId) return res.json({ ok: false, message: "Missing storageId" });

  try {
    const record = await getMongoEvidence({ storageId });
    if (record) return res.json({ ok: true, data: record });

    // Mongo missing → recover from Aereware
    const recovered = await recoverEvidence(storageId);
    if (!recovered) return res.json({ ok: false, message: "Not found in Aereware." });

    await insertRecoveredEvidence(recovered);
    return res.json({ ok: true, data: recovered });
  } catch (err) {
    console.error("verifyPrivateData error:", err);
    res.status(500).json({ ok: false, error: "Internal error verifying private data" });
  }
}

export async function listUserValidations(req, res) {
  const { token } = req.params;
  try {
    const evidences = await getUserEvidences(token);
    return res.json({ ok: true, validations: evidences });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error loading user validations" });
  }
}
