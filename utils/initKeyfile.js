// ======================================================
// 🔑 Aereware Keyfile Init v2 — Safe JSON Writer
// ======================================================
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🔐 ensureAerewareKeyfile()
 * Crea un archivo físico con la clave Aereware, si no existe.
 * Permite modo lectura si no hay variable disponible.
 */
export function ensureAerewareKeyfile() {
  try {
    const keyJson = process.env.AEREWARE_KEYFILE_JSON;
    const keyPath = path.join(__dirname, "../aereware-keyfile.json");

    if (!keyJson) {
      console.warn("⚠️ AEREWARE_KEYFILE_JSON not found → Read-only mode active.");
      return;
    }

    // Si el archivo no existe, lo crea correctamente
    if (!fs.existsSync(keyPath)) {
      // Intentar parsear y reescribir correctamente el JSON
      let parsedKey;
      try {
        parsedKey = JSON.parse(keyJson);
      } catch {
        console.warn("⚠️ Keyfile not valid JSON, writing raw string.");
        parsedKey = keyJson;
      }

      fs.writeFileSync(
        keyPath,
        typeof parsedKey === "string"
          ? parsedKey
          : JSON.stringify(parsedKey, null, 2)
      );

      console.log("🔑 Aereware keyfile created successfully.");
    } else {
      console.log("✅ Aereware keyfile already exists.");
    }
  } catch (err) {
    console.error("❌ Error initializing Aereware keyfile:", err.message);
  }
}
