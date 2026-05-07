// ======================================================
// 🚀 UDoChain Verify — Records Only (v1.0 Clean)
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

// 🌍 CORS (idéntico a Validate y BioID)
app.use(
  cors({
    origin: [
      "https://app.udochain.com",
      "https://wapp.udochain.com",
      "https://validate.udochain.com",
      "https://bioid.udochain.com",
      "https://verif.udochain.com",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

app.use(express.json({ limit: "20mb" }));

// 📂 Static Frontend (sirve todo sin bloquear)
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
app.use(express.static(publicDir));

// 🔒 Seguridad solo para /records y /api privadas
app.use((req, res, next) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];

  const publicPaths = ["/api/healthz", "/styles.css", "/records.js", "/logo-udochain.png"];
  if (publicPaths.some((p) => req.path.startsWith(p)) || req.path.match(/\.(css|js|png)$/)) return next();

  if (req.path.startsWith("/records") || req.path.startsWith("/api/verify")) {
    if (!token || !email) return res.redirect("https://app.udochain.com/login");
  }
  next();
});

// 🧩 API Routes
app.use("/api/verify", verifyRoutes);

// ❤️ Healthcheck
app.get("/api/healthz", (_, res) => res.json({ ok: true, service: "Verify Records", time: new Date() }));

// 🗂 Route: /records
app.get("/records", (_, res) => res.sendFile(path.join(publicDir, "records.html")));

// Default redirect
app.get("/", (_, res) => res.redirect("https://app.udochain.com"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ VERIFY Records running on port ${PORT}`));
