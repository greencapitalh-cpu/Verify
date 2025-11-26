// ======================================================
// 🔒 Aereware Utilities v2.1 — Full Read + Binary + Recovery
// ======================================================
import Arweave from "arweave";

// ------------------------------------------------------
// 🔹 getFromAereware — Recupera metadata JSON desde Arweave
// ------------------------------------------------------
export async function getFromAereware(storageId) {
  try {
    const id = storageId.replace("ar://", "");
    const arweave = Arweave.init({
      host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
      port: parseInt(process.env.AEREWARE_GATEWAY_PORT || "443"),
      protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
    });

    const txData = await arweave.transactions.getData(id, {
      decode: true,
      string: true,
    });
    return JSON.parse(txData.toString());
  } catch (err) {
    console.error("❌ Error getting from Aereware:", err.message);
    return null;
  }
}

// ------------------------------------------------------
// 🔹 recoverEvidence — Fallback total (metadatos + binarios)
// ------------------------------------------------------
export async function recoverEvidence(storageId) {
  try {
    const id = storageId.replace("ar://", "");
    const arweave = Arweave.init({
      host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
      port: parseInt(process.env.AEREWARE_GATEWAY_PORT || "443"),
      protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
    });

    const metaData = await arweave.transactions.getData(id, {
      decode: true,
      string: true,
    });

    let meta = null;
    try {
      meta = JSON.parse(metaData.toString());
    } catch {
      meta = { evidenceTitle: "Recovered Evidence (binary-only)" };
    }

    return {
      storageId: `ar://${id}`,
      evidenceTitle: meta.evidenceTitle || "Recovered Evidence",
      meta,
      recoveredAt: new Date(),
    };
  } catch (err) {
    console.error("❌ recoverEvidence error:", err.message);
    return null;
  }
}
