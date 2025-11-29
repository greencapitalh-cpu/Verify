// ======================================================
// 🟪 UDoChain Verify Private v4.5
// Public display — shows private validation data + downloads real binary ZIP
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");
const statusDiv = document.getElementById("status");

// Obtener el parámetro "storage" desde la URL
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ======================================================
// 🧠 Función principal — Cargar validación privada
// ======================================================
async function loadPrivateValidation() {
  if (!storage) {
    detailsDiv.innerHTML = "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");
    const res = await fetch(`https://validate.udochain.com/api/validate/storage/${encodeURIComponent(cleanId)}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = `<p class="fail">Validation not found or invalid storage ID.</p>`;
      return;
    }

    badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // Mostrar la información principal
    detailsDiv.innerHTML = `
      <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
      <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
      <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
      ${data.bioidHash ? `<div class="field"><span class="label">BioID Hash:</span> <span class="value">${data.bioidHash}</span></div>` : ""}
      <div class="field"><span class="label">Storage ID:</span> <span class="value">${data.storageId || "—"}</span></div>
      <div class="field"><span class="label">Private Storage:</span> <span class="value">${data.w3Note || "—"}</span></div>
      <div class="field"><span class="label">Files:</span>
        <div class="value file-list">
          ${(data.files || []).map(f => `<div>${f.name} — <small>${f.hash}</small></div>`).join("") || "No files recorded"}
        </div>
      </div>
    `;

    // ✅ Mostrar botón que descarga desde tu backend (ZIP real)
    if (data.hasBinaryBackup || (data.storageId && data.storageId.startsWith("ar://"))) {
      const cleanStorageId = data.storageId.replace("ar://", "");
      const downloadUrl = `https://validate.udochain.com/api/validate/aereware/download/${encodeURIComponent(cleanStorageId)}`;

      downloadsDiv.innerHTML = `
        <button class="download-btn" onclick="window.open('${downloadUrl}', '_blank')">
          <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" viewBox="0 0 24 24">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4m-9 8h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Download Binary Backup
        </button>
      `;
    } else {
      downloadsDiv.innerHTML = "<p class='subtitle'>No downloadable binary files available.</p>";
    }

  } catch (err) {
    console.error("❌ Fetch error:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = "<p class='fail'>Error fetching private validation details.</p>";
  }
}

// Ejecutar al cargar
loadPrivateValidation();
