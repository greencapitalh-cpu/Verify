import "./db.js";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import verifyRoutes from "./routes/verifyRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    origin: [
      "https://app.udochain.com",
      "https://wapp.udochain.com",
      "https://validate.udochain.com",
      "https://bioid.udochain.com",
      "https://verify.udochain.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

// 🔒 Igual que Validate/BioID
app.use((req, res, next) => {
  const token = req.query.token || req.headers["x-udo-token"];
  const email = req.query.email || req.headers["x-udo-email"];

  const publicPaths = [
    "/verify-public",
    "/api/healthz",
    "/api/verify/hash",
  ];

  if (publicPaths.some((p) => req.path.startsWith(p))) return next();
  if (!token || !email)
    return res.redirect("https://app.udochain.com/login");

  next();
});

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
app.use("/api/verify", verifyRoutes);

app.get("/api/healthz", (_, res) => res.json({ ok: true }));

app.get("/records", (req, res) =>
  res.sendFile(path.join(staticPath, "records.html"))
);

app.get("*", (_, res) =>
  res.redirect("https://app.udochain.com/login")
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ VERIFY running on port ${PORT}`));
