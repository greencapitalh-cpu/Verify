// ======================================================
// 🚀 UDoChain Verify v3.0
// Dual Mongo Verify + Validate + Aereware Read
// ======================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "./db.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import { ensureAerewareKeyfile } from "./utils/initKeyfile.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------
// 🔐 Inicializar keyfile AO (modo lectura)
// ------------------------------------------------------
ensureAerewareKeyfile();

// ------------------------------------------------------
// 📁 Crear carpetas necesarias
// ------------------------------------------------------
["public"].forEach((dir) => {
  const folder = path.join(__dirname, dir);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

// ------------------------------------------------------
// ⚙️ Configuración de Express
// ------------------------------------------------------
const app = express();

app.use(
  cors({
    origin: [
      "https://verify.udochain.com",
      "https://validate.udochain.com",
      "https://bioid.udochain.com",
      "https://wapp.udochain.com",
      "https://app.udochain.com",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ------------------------------------------------------
// 🔒 Seguridad tipo Validate/BioID
// ------------------------------------------------------
app.use((req, res, next) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];

  const publicPaths = [
    "/api/healthz",
    "/api/verify/hash",
    "/verify-public",
    "/verify-public.html",
  ];

  if (publicPaths.some((p) => req.path.startsWith(p))) return next();

  if (token && email) return next();

  console.warn(`🚫 Acceso bloqueado a ${req.path}`);
  return res.redirect("https://app.udochain.com/login");
});

// ------------------------------------------------------
// 🧩 API Verify Routes
// ------------------------------------------------------
app.use("/api/verify", verifyRoutes);

// ------------------------------------------------------
// ❤️ Healthcheck
// ------------------------------------------------------
app.get("/api/healthz", (_, res) =>
  res.json({ ok: true, service: "UDoChain Verify", timestamp: new Date() })
);

// ------------------------------------------------------
// 📦 Archivos estáticos (frontend Verify)
// ------------------------------------------------------
const publicDir = path.join(__dirname, "public");

app.use(
  express.static(publicDir, {
    extensions: ["html"],
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    },
  })
);

// ------------------------------------------------------
// 🏠 Rutas principales
// ------------------------------------------------------
app.get("/", (req, res) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];
  if (!token || !email) {
    return res.redirect("https://app.udochain.com/login");
  }
  res.sendFile(path.join(publicDir, "records.html"));
});

app.get("/records", (req, res) => {
  res.sendFile(path.join(publicDir, "records.html"));
});

// ------------------------------------------------------
// 🔁 Fallback para QR público/privado
// ------------------------------------------------------
app.get("*", (req, res) => {
  if (req.path.startsWith("/verify-public")) {
    return res.sendFile(path.join(publicDir, "verify-public.html"));
  }
  if (req.path.startsWith("/verify-private")) {
    return res.sendFile(path.join(publicDir, "verify-private.html"));
  }
  return res.redirect("https://app.udochain.com/login");
});

// ------------------------------------------------------
// 🚀 Launch
// ------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ UDoChain Verify corriendo en puerto ${PORT}`);
});
