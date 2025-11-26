const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");
const token = params.get("token") || localStorage.getItem("udo_token");
const email = params.get("email") || localStorage.getItem("userEmail");

const container = document.getElementById("privateData");
const btn = document.getElementById("downloadZip");

// ======================================================
// 🔍 Cargar evidencia privada desde el backend
// ======================================================
async function loadPrivate() {
  if (!storageId) {
    container.textContent = "⚠️ No storage ID provided.";
    return;
  }

  try {
    const res = await fetch(`/api/verify/private/${storageId}`);
    const data = await res.json();

    if (!data.ok || !data.data) {
      container.innerHTML = `<p>❌ Evidence not found or access denied.</p>`;
      return;
    }

    const meta = data.data.meta || data.data;
    const createdAt =
      meta.createdAt || data.data.recoveredAt || new Date().toISOString();

    container.innerHTML = `
      <p><strong>Evidence:</strong> ${meta.evidenceTitle || "Untitled"}</p>
      <p><strong>Created:</strong> ${new Date(createdAt).toLocaleString()}</p>
      <p><strong>Type:</strong> ${meta.type || "Private Validation"}</p>
      <p><strong>GPS:</strong> ${meta.gps || "—"}</p>
      <p><strong>BioID:</strong> ${meta.bioid || "—"}</p>
      <p><strong>Wallet:</strong> ${meta.wallet || "—"}</p>
      <p><strong>Storage ID:</strong> ${storageId}</p>
      <p><strong>Validated by:</strong> ${email || "Anonymous"}</p>
    `;

    // Habilitar botón solo si hay ZIP disponible
    if (data.data.recovered || meta.hasBinaryBackup || data.data.binary) {
      btn.disabled = false;
      btn.addEventListener("click", downloadZip);
    } else {
      btn.disabled = true;
    }
  } catch (err) {
    console.error(err);
    container.textContent = "⚠️ Error loading private record.";
  }
}

// ======================================================
// 💾 Descargar ZIP custodiado en Aereware
// ======================================================
async function downloadZip() {
  try {
    btn.disabled = true;
    btn.textContent = "Downloading...";

    const res = await fetch(`/api/verify/binary/${storageId}`);
    if (!res.ok) throw new Error("Download failed.");

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${storageId}.zip`;
    link.click();

    btn.textContent = "⬇️ Download ZIP";
    btn.disabled = false;
  } catch (err) {
    alert("❌ Unable to download ZIP: " + err.message);
    btn.disabled = false;
  }
}

// Init
loadPrivate();
