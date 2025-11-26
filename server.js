// ======================================================
// 🚀 UDoChain Verify v4 — Dual Mongo + Aereware + QR + Logs
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
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ======================================================
// 🗄️ MongoDB — Conexión doble (Validate + Verify)
// ======================================================
(async () => {
  try {
    // 🟦 Base principal (solo lectura de evidencias)
    const validateConn = await mongoose.createConnection(
      process.env.MONGO_URI_VALIDATE,
      { dbName: "udochain_validate" }
    );
    console.log("✅ Conectado a MongoDB (udochain_validate)");

    // 🟨 Base secundaria (para logs de verificación)
    const verifyConn = await mongoose.createConnection(
      process.env.MONGO_URI_VERIFY,
      { dbName: "udochain_verify" }
    );
    console.log("✅ Conectado a MongoDB (udochain_verify)");

    // Guardar conexiones globales
    global.mongoConnections = {
      validateConn,
      verifyConn,
    };
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
  }
})();

// ======================================================
// 🧩 Rutas API
// ======================================================
app.use("/api/verify", verifyRoutes);

// ======================================================
// 🌍 Archivos estáticos
// ======================================================
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
  console.log(`✅ UDoChain Verify v4 corriendo en puerto ${PORT}`)
);
