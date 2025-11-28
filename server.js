// ======================================================
// 🚀 UDoChain Verify — Clean, Unified, Fixed Layout
// ======================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "./db.js";
import verifyRoutes from "./routes/verifyRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ------------------------------------------------------
// 🌍 CORS (igual que Validate y BioID)
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
// 📂 Static Front (todo se sirve directo)
// ------------------------------------------------------
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
app.use(express.static(publicDir));

// ------------------------------------------------------
// 🔒 Middleware de seguridad (solo bloquea APIs privadas)
// ------------------------------------------------------
app.use((req, res, next) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];
  const publicPaths = [
    "/verify-public",
    "/api/verify/hash",
    "/api/healthz",
    "/styles.css",
    "/records.js",
    "/verify-public.html",
    "/verify-private.html",
    "/records.html",
    "/logo-udochain.png"
  ];

  if (publicPaths.some((p) => req.path.startsWith(p)) || req.path.match(/\.(css|js|png|jpg|jpeg|svg)$/)) {
    return next();
  }

  if (!token || !email) {
    return res.redirect("https://app.udochain.com/login");
  }

  next();
});

// ------------------------------------------------------
// 🧩 API routes
// ------------------------------------------------------
app.use("/api/verify", verifyRoutes);

// ------------------------------------------------------
// ❤️ Healthcheck
// ------------------------------------------------------
app.get("/api/healthz", (_, res) => res.json({ ok: true, service: "Verify", ts: new Date() }));

// ------------------------------------------------------
// 🗂 HTML routes
// ------------------------------------------------------
app.get("/records", (_, res) => res.sendFile(path.join(publicDir, "records.html")));
app.get("/verify-public", (_, res) => res.sendFile(path.join(publicDir, "verify-public.html")));
app.get("/verify-private", (_, res) => res.sendFile(path.join(publicDir, "verify-private.html")));

app.get("/", (_, res) => res.redirect("https://app.udochain.com"));

// ------------------------------------------------------
// 🚀 Launch
// ------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ VERIFY clean server running on port ${PORT}`));
