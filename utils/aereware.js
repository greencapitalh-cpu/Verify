import fetch from "node-fetch";

export async function readMetadata(txId) {
  const res = await fetch(`https://arweave.net/${txId}`);
  if (!res.ok) throw new Error("Metadata not found");
  return await res.json();
}

export async function readBinary(txId) {
  const res = await fetch(`https://arweave.net/${txId}`);
  if (!res.ok) throw new Error("Binary not found");
  return await res.arrayBuffer();
}

export async function recoverEvidence(storageId) {
  const txId = storageId.replace("ar://", "");
  try {
    const meta = await readMetadata(txId).catch(() => null);
    const bin = await readBinary(txId).catch(() => null);
    if (!meta && !bin) return null;

    return {
      storageId,
      evidenceTitle: meta?.evidenceTitle || "Recovered Evidence",
      recovered: true,
      recoveredAt: new Date(),
      meta,
      binary: bin ? Buffer.from(bin).toString("base64") : null,
    };
  } catch {
    return null;
  }
}
