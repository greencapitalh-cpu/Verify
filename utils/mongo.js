import { MongoClient } from "mongodb";

let db;
export async function connectMongo() {
  if (db) return db;
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db("udochain");
  console.log("📦 Mongo connected for Verify");
  return db;
}

export async function getMongoEvidence(query) {
  const conn = await connectMongo();
  return await conn.collection("evidences").findOne(query);
}

export async function getUserEvidences(token) {
  const conn = await connectMongo();
  return await conn.collection("evidences").find({ userToken: token }).toArray();
}

export async function insertRecoveredEvidence(recovered) {
  const conn = await connectMongo();
  return await conn.collection("evidences").insertOne({
    ...recovered,
    restoredAt: new Date(),
  });
}
