// ======================================================
// 🚀 UDoChain Verify — Dual Mongo + Static Access Safe
// ======================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import "./db.js";
import verifyRoutes from "./routes/verifyRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ------------------------------------------------------
// 🌍 CORS Config (idéntico a Validate / BioID)
// ------------------------------------------------------
app.use(
  cors({
    origin: [
      "https://app.udochain.com",
      "https://wapp.udochain.com",
      "https://validate.udochain.com",
      "https://bioid.udochain.com",
      "https://verify.udochain.com",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ------------------------------------------------------
// 📂 Static Frontend (sirve todo el front sin bloqueo)
// ------------------------------------------------------
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
app.use(express.static(publicDir));

// ------------------------------------------------------
// 🔒 Seguridad solo en rutas privadas (API, Records, Verify-Private)
// ------------------------------------------------------
app.use((req, res, next) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];
  const publicPaths = [
    "/verify-public",
    "/api/healthz",
    "/api/verify/hash",
    "/styles.css",
    "/js/",
    "/img/",
    "/favicon.ico"
  ];

  // Permitir archivos estáticos y rutas públicas
  if (
    publicPaths.some((p) => req.path.startsWith(p)) ||
    req.path.match(/\.(css|js|png|jpg|jpeg|svg)$/)
  ) {
    return next();
  }

  // Redirigir solo si no hay token/email
  if (!token || !email) {
    return res.redirect("https://app.udochain.com/login");
  }

  next();
});

// ------------------------------------------------------
// 🧩 API Routes
// ------------------------------------------------------
app.use("/api/verify", verifyRoutes);

// ------------------------------------------------------
// ❤️ Healthcheck
// ------------------------------------------------------
app.get("/api/healthz", (_, res) =>
  res.json({ ok: true, service: "UDoChain Verify", time: new Date() })
);

// ------------------------------------------------------
// 🗂 Web Pages
// ------------------------------------------------------
app.get("/records", (_, res) =>
  res.sendFile(path.join(publicDir, "records.html"))
);

app.get("/", (_, res) => {
  res.redirect("https://app.udochain.com");
});

// ------------------------------------------------------
// 🚀 Start Server
// ------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ VERIFY running on port ${PORT}`));
