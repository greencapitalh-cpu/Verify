import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

export async function getPolygonTransaction(hash) {
  try {
    const tx = await provider.getTransaction(hash);
    if (!tx) return { found: false };
    return {
      found: true,
      txHash: tx.hash,
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
    };
  } catch {
    return { found: false };
  }
}
