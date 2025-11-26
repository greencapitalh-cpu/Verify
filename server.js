import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Arweave from "arweave";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Setup paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// --- Mongo connection ---
let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => {
  db = mongoClient.db();
  console.log("✅ MongoDB connected");
}).catch(err => console.error("❌ Mongo error:", err));

// --- Arweave setup ---
const keyfile = JSON.parse(process.env.AEREWARE_KEYFILE_JSON);
const arweave = Arweave.init({
  host: process.env.AEREWARE_GATEWAY_HOST || "arweave.net",
  port: process.env.AEREWARE_GATEWAY_PORT || 443,
  protocol: process.env.AEREWARE_GATEWAY_PROTOCOL || "https",
});

// --- Healthcheck ---
app.get("/health", (req, res) => res.send("✅ Verify is running"));

// --- Verify hash in blockchain / Mongo ---
app.post("/api/verify/hash", async (req, res) => {
  const { hash } = req.body || {};
  if (!hash) return res.json({ ok: false, message: "No hash provided" });

  try {
    const match = await db.collection("validations").findOne({ "files.hash": hash });
    if (!match) return res.json({ ok: false, message: "Evidence not found" });

    return res.json({
      ok: true,
      evidenceTitle: match.evidenceTitle,
      txHash: match.txHash,
      pdfUrl: match.pdfPublic,
      storageId: match.storageId
    });
  } catch (err) {
    console.error("❌ Error verifying hash:", err);
    res.json({ ok: false, message: "Database error" });
  }
});

// --- Verify private data (real Aereware integration) ---
app.get("/api/verify/private/:storageId", async (req, res) => {
  const id = decodeURIComponent(req.params.storageId).replace("ar://", "");
  try {
    const tx = await arweave.transactions.get(id);
    const data = await arweave.transactions.getData(id, { decode: true, string: true });
    const tags = tx.get("tags").map(t => ({
      name: t.get("name", { decode: true, string: true }),
      value: t.get("value", { decode: true, string: true })
    }));

    const contentType = tags.find(t => t.name === "Content-Type")?.value;
    if (contentType === "application/zip") {
      return res.json({
        ok: true,
        data: { meta: { type: "ZIP" }, downloadUrl: `https://arweave.net/${id}` }
      });
    }

    const parsed = JSON.parse(data.toString());
    const zipId = parsed.zipStorageId?.replace("ar://", "");
    res.json({
      ok: true,
      data: {
        meta: parsed.metadata || {},
        downloadUrl: zipId ? `https://arweave.net/${zipId}` : null
      }
    });
  } catch (err) {
    console.error("❌ Aereware fetch error:", err);
    res.json({ ok: false, message: "Private data not found or invalid" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Verify running on port ${PORT}`));
