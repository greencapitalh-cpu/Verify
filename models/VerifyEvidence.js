import mongoose from "mongoose";

const verifyEvidenceSchema = new mongoose.Schema({
  txHash: String,
  storageId: String,
  currentPdfUrl: String,
  qrActive: { type: Boolean, default: true },
  privateAccess: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const conn = global.mongoConnections?.verifyConn || mongoose;
export default conn.model("VerifyEvidence", verifyEvidenceSchema);
