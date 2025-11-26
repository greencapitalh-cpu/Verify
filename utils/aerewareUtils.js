// ======================================================
// 🔒 Aereware Utilities v3 — Full Read, Binary & Recovery
// ======================================================
import Arweave from "arweave";
import fetch from "node-fetch";

// 🔹 Inicialización segura de cliente Arweave
function initClient() {
  return Arweave.init({
    host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
    port: parseInt(process.env.AEREWARE_GATEWAY_PORT || "443"),
    protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
  });
}

// 🔹 Lectura directa JSON (fallback)
export async function readMetadata(txId) {
  try {
    const res = await fetch(`https://arweave.net/${txId}`);
    if (!res.ok) throw new Error("Metadata not found");
    return await res.json();
  } catch (err) {
    console.error("❌ readMetadata:", err.message);
    return null;
  }
}

// 🔹 Lectura binaria directa (ZIP, PDF, etc.)
export async function readBinary(txId) {
  try {
    const res = await fetch(`https://arweave.net/${txId}`);
    if (!res.ok) throw new Error("Binary not found");
    return await res.arrayBuffer();
  } catch (err) {
    console.error("❌ readBinary:", err.message);
    return null;
  }
}

// 🔹 Lectura vía SDK (JSON metadata)
export async function getFromAereware(storageId) {
  try {
    const id = storageId.replace("ar://", "");
    const arweave = initClient();
    const txData = await arweave.transactions.getData(id, {
      decode: true,
      string: true,
    });
    return JSON.parse(txData.toString());
  } catch (err) {
    console.error("❌ getFromAereware error:", err.message);
    return null;
  }
}

// 🔹 Recuperación completa (JSON + Binario)
export async function recoverEvidence(storageId) {
  try {
    const txId = storageId.replace("ar://", "");

    // 1️⃣ Intentar leer metadata JSON con SDK
    let meta = await getFromAereware(storageId);

    // 2️⃣ Si falla, usar fetch directo
    if (!meta) meta = await readMetadata(txId);

    // 3️⃣ Intentar recuperar binario
    const bin = await readBinary(txId);

    // 4️⃣ Si nada se pudo recuperar, abortar
    if (!meta && !bin) return null;

    return {
      storageId,
      evidenceTitle: meta?.evidenceTitle || "Recovered Evidence",
      meta,
      binary: bin ? Buffer.from(bin).toString("base64") : null,
      recovered: true,
      recoveredAt: new Date(),
    };
  } catch (err) {
    console.error("❌ recoverEvidence error:", err.message);
    return null;
  }
}
