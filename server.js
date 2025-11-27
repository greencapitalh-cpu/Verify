// ======================================================
// 🚀 UDoChain Verify v5.0 — Secure Access + Dual Mongo + Aereware + QR + Logs
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
// 🌐 Configuración CORS — Solo dominios oficiales UDoChain
// ======================================================
app.use(
  cors({
    origin: [
      "https://verify.udochain.com",
      "https://validate.udochain.com",
      "https://bioid.udochain.com",
      "https://wapp.udochain.com",
      "https://app.udochain.com",
      "http://localhost:8080", // Dev
      "http://localhost:5173", // Vite Dev
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
    const validateConn = await mongoose.createConnection(
      process.env.MONGO_URI_VALIDATE,
      { dbName: "udochain_validate" }
    );
    console.log("✅ Conectado a MongoDB (udochain_validate)");

    const verifyConn = await mongoose.createConnection(
      process.env.MONGO_URI_VERIFY,
      { dbName: "udochain_verify" }
    );
    console.log("✅ Conectado a MongoDB (udochain_verify)");

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
// 🔒 Middleware de seguridad de acceso (igual que Validate)
// ======================================================
app.use((req, res, next) => {
  const origin = req.get("origin") || "";
  const token = req.query.token || req.headers["x-udo-token"];

  // 🔓 Excepciones públicas (QR verification)
  const publicPaths = ["/verify-public", "/verify-private", "/api/healthz"];
  const isPublic =
    publicPaths.some((p) => req.path.startsWith(p)) ||
    req.path.startsWith("/api/verify/hash") ||
    req.path.startsWith("/api/verify/private/");

  if (isPublic) return next();

  // 🔒 Bloquea todo lo demás si no hay token ni viene de wapp/app
  const allowedOrigin =
    origin.includes("wapp.udochain.com") || origin.includes("app.udochain.com");

  if (!token && !allowedOrigin) {
    console.warn(`🚫 Acceso bloqueado a ${req.path} desde ${origin}`);
    return res.redirect("https://app.udochain.com/login");
  }

  next();
});

// ======================================================
// 🌍 Archivos estáticos (frontend público)
// ======================================================
app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// ❤️ Healthcheck
// ======================================================
app.get("/api/healthz", (_, res) =>
  res.json({ ok: true, service: "UDoChain Verify v5.0", timestamp: new Date() })
);

// ======================================================
// 🏠 Rutas principales (bloqueadas excepto QR público)
// ======================================================
app.get("/", (req, res) => {
  const token = req.query.token;
  if (!token) return res.redirect("https://app.udochain.com/login");
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/records", (req, res) => {
  const token = req.query.token;
  if (!token) return res.redirect("https://app.udochain.com/login");
  res.sendFile(path.join(__dirname, "public/records.html"));
});

// ======================================================
// 🔁 Fallback universal
// ======================================================
app.get("*", (req, res) => {
  if (
    req.path.startsWith("/verify-public") ||
    req.path.startsWith("/verify-private")
  ) {
    return res.sendFile(path.join(__dirname, "public/verify.html"));
  }
  res.redirect("https://app.udochain.com/login");
});

// ======================================================
// 🚀 Inicio del servidor
// ======================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ UDoChain Verify v5.0 corriendo en puerto ${PORT}`)
);
