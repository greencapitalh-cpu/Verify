// ======================================================
// 🚀 UDoChain Verify v2 — Blockchain + Aereware + QR + Auto-Login
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

// ------------------------------------------------------
// 🧬 Inicializar keyfile Aereware si existe en env
// ------------------------------------------------------
ensureAerewareKeyfile();

// ------------------------------------------------------
// 📁 Crear carpetas necesarias si no existen
// ------------------------------------------------------
["public"].forEach((dir) => {
  const folder = path.join(__dirname, dir);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

// ------------------------------------------------------
// ⚙️ Inicializar Express
// ------------------------------------------------------
const app = express();

// ------------------------------------------------------
// 🔐 CORS universal
// ------------------------------------------------------
app.use(
  cors({
    origin: [
      "https://verify.udochain.com",
      "https://wapp.udochain.com",
      "https://app.udochain.com",
      "https://bioid.udochain.com",
      "http://localhost:8080"
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ------------------------------------------------------
// 🗄️ Conexión a MongoDB Atlas
// ------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI, { dbName: "udochain_validate" })
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// ------------------------------------------------------
// 🧩 Rutas API de verificación
// ------------------------------------------------------
app.use("/api/verify", verifyRoutes);

// ------------------------------------------------------
// 🗂 Archivos estáticos
// ------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------
// ❤️ Healthcheck
// ------------------------------------------------------
app.get("/api/healthz", (_, res) => res.json({ ok: true }));

// ------------------------------------------------------
// 🏠 Página principal (Verify UI)
// ------------------------------------------------------
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ------------------------------------------------------
// 🚀 Iniciar servidor
// ------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ UDoChain Verify v2 corriendo en puerto ${PORT}`)
);
