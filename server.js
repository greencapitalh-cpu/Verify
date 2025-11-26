import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import verifyRoutes from "./routes/verifyRoutes.js";
import { connectMongo } from "./utils/mongo.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(",") || "*" }));

// Static
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/api/verify", verifyRoutes);

// MongoDB
connectMongo();

// Default route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Verify running on port ${PORT}`));
