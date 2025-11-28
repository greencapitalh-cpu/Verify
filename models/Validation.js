import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  hash: String
});

const validationSchema = new mongoose.Schema({
  userEmail: String,
  userToken: String,
  evidenceTitle: String,
  txHash: String,
  storageId: String,
  pdfUrl: String,
  type: String,
  files: [fileSchema],
  createdAt: { type: Date, default: Date.now }
});

const conn = global.mongoConnections?.validateConn || mongoose;
export default conn.model("Validation", validationSchema);
