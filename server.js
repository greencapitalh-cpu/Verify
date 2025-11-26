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

// ======================================================
// 🔑 Inicialización de Aereware Keyfile
// ======================================================
ensureAerewareKeyfile();

// ======================================================
// 📂 Creación de carpetas necesarias
// ======================================================
["public"].forEach((dir) => {
  const folder = path.join(__dirname, dir);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

// ======================================================
// ⚙️ Inicialización de Express
// ======================================================
const app = express();

// ======================================================
// 🌐 Configuración CORS
// ======================================================
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
// 🗄️ MongoDB — Conexiones dobles (Validate + Verify)
// ======================================================
(async () => {
  try {
    // 🟦 Base principal: lectura de evidencias (Validate)
    const validateConn = await mongoose.createConnection(
      process.env.MONGO_URI_VALIDATE,
      { dbName: "udochain_validate" }
    );
    console.log("✅ Conectado a MongoDB (udochain_validate)");

    // 🟨 Base secundaria: registros de verificación (Verify)
    const verifyConn = await mongoose.createConnection(
      process.env.MONGO_URI_VERIFY,
      { dbName: "udochain_verify" }
    );
    console.log("✅ Conectado a MongoDB (udochain_verify)");

    // Guardar conexiones globales para uso en controladores
    global.mongoConnections = { validateConn, verifyConn };
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
  }
})();

// ======================================================
// 🧩 Rutas de API
// ======================================================
app.use("/api/verify", verifyRoutes);

// ======================================================
// 🌍 Archivos estáticos (frontend público)
// ======================================================
app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// ❤️ Healthcheck
// ======================================================
app.get("/api/healthz", (_, res) =>
  res.json({ ok: true, service: "UDoChain Verify v4", timestamp: new Date() })
);

// ======================================================
// 🏠 UI principal
// ======================================================
app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// ======================================================
// 🚀 Inicio del servidor
// ======================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ UDoChain Verify v4 corriendo en puerto ${PORT}`)
);
