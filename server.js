// ======================================================
// 🚀 UDoChain Verify v3 — Mongo + Aereware + QR + Auto-Login
// ======================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ensureAerewareKeyfile } from "./utils/initKeyfile.js";
import verifyRoutes from "./routes/verifyRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 Inicializar Keyfile de Aereware
ensureAerewareKeyfile();

// 📂 Crear carpetas si no existen
["public"].forEach((dir) => {
  const folder = path.join(__dirname, dir);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

const app = express();

// 🌐 CORS
app.use(
  cors({
    origin: [
      "https://verify.udochain.com",
      "https://wapp.udochain.com",
      "https://app.udochain.com",
      "https://bioid.udochain.com",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 🗄️ MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "udochain_validate" })
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// 🧩 Rutas
app.use("/api/verify", verifyRoutes);

// 🌍 Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ❤️ Healthcheck
app.get("/api/healthz", (_, res) => res.json({ ok: true }));

// 🏠 UI principal
app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// 🚀 Servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ UDoChain Verify v3 corriendo en puerto ${PORT}`)
);
