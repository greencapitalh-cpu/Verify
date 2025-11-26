// ======================================================
// 🔒 Aereware Utilities v2 — Full Read & Binary Recovery
// ======================================================
import Arweave from "arweave";

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
