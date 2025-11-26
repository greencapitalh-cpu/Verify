// ======================================================
// 🔑 Aereware Keyfile Init — Same as Validate
// ======================================================
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function ensureAerewareKeyfile() {
  try {
    const keyJson = process.env.AEREWARE_KEYFILE_JSON;
    const keyPath = path.join(__dirname, "../aereware-keyfile.json");

    if (!keyJson) {
      console.warn("⚠️ AEREWARE_KEYFILE_JSON not found, read-only mode.");
      return;
    }

    if (!fs.existsSync(keyPath)) {
      fs.writeFileSync(keyPath, JSON.parse(JSON.stringify(keyJson)).toString());
      console.log("🔑 Aereware keyfile created successfully");
    } else {
      console.log("✅ Aereware keyfile already exists");
    }
  } catch (err) {
    console.error("❌ Error initializing Aereware keyfile:", err.message);
  }
}
