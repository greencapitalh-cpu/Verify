// ======================================================
// 🔒 Aereware Utilities v4 — Full Read, Binary & Recovery
// ======================================================
import Arweave from "arweave";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ======================================================
// ⚙️ Inicialización segura de cliente Arweave/Aereware
// ======================================================
function initClient() {
  const keyPath = path.join(process.cwd(), "aereware-keyfile.json");
  let keyfile = null;

  try {
    if (fs.existsSync(keyPath)) {
      keyfile = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      console.log("🔐 Using local Aereware keyfile");
    } else {
      console.warn("⚠️ No local keyfile found, using public gateway (read-only)");
    }
  } catch (err) {
    console.error("❌ Error loading keyfile:", err.message);
  }

  return Arweave.init({
    host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
    port: parseInt(process.env.AEREWARE_GATEWAY_PORT || "443"),
    protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
    timeout: 30000, // ⏱️ 30 segundos
    logging: false,
  });
}

// ======================================================
// 🔹 readMetadata — Lectura directa JSON (fallback HTTP)
// ======================================================
export async function readMetadata(txId) {
  try {
    const url = `https://arweave.net/${txId}`;
    const res = await fetch(url, { timeout: 20000 });
    if (!res.ok) throw new Error(`Metadata not found at ${url}`);
    return await res.json();
  } catch (err) {
    console.error("❌ readMetadata:", err.message);
    return null;
  }
}

// ======================================================
// 🔹 readBinary — Descarga binaria directa (ZIP, PDF, etc.)
// ======================================================
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

// ======================================================
// 🔹 getFromAereware — Lectura JSON vía SDK (Aereware API)
// ======================================================
export async function getFromAereware(storageId) {
  try {
    const id = storageId.replace("ar://", "");
    const arweave = initClient();
    const txData = await arweave.transactions.getData(id, {
      decode: true,
      string: true,
    });
    const parsed = JSON.parse(txData.toString());
    return parsed;
  } catch (err) {
    console.warn("⚠️ getFromAereware fallback to HTTP:", err.message);
    return await readMetadata(storageId.replace("ar://", ""));
  }
}

// ======================================================
// 🔹 recoverEvidence — Recuperación completa JSON + Binario
// ======================================================
export async function recoverEvidence(storageId) {
  try {
    const txId = storageId.replace("ar://", "");
    console.log(`🧩 Recovering evidence for ${txId}...`);

    // 1️⃣ Intentar leer metadata con SDK (preferido)
    let meta = await getFromAereware(storageId);

    // 2️⃣ Si falla, intentar con HTTP directo
    if (!meta) meta = await readMetadata(txId);

    // 3️⃣ Intentar recuperar binario ZIP/PDF
    const bin = await readBinary(txId);

    // 4️⃣ Validar resultado
    if (!meta && !bin) {
      console.warn(`⚠️ No data found for ${txId}`);
      return null;
    }

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
