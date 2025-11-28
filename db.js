import mongoose from "mongoose";

export const validateConn = await mongoose.createConnection(
  process.env.MONGO_URI_VALIDATE,
  { dbName: "udochain_validate" }
);

export const verifyConn = await mongoose.createConnection(
  process.env.MONGO_URI_VERIFY,
  { dbName: "udochain_verify" }
);

global.mongoConnections = { validateConn, verifyConn };

console.log("✅ Mongo connected (validate + verify)");
