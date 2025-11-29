// ======================================================
// 🌍 UDoChain Verify Private v4.2
// 100% público — muestra validaciones privadas + descargas
// ======================================================

const detailsDiv = document.getElementById("details");
const badgeDiv = document.getElementById("badge");
const fileList = document.getElementById("fileList");
const downloadArea = document.getElementById("downloadArea");

const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");

// ======================================================
// 🧠 Cargar validación privada
// ======================================================
async function loadPrivateValidation() {
  if (!storageId) {
    detailsDiv.innerHTML = "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const res = await fetch(`https://validate.udochain.com/api/validate/storage/${storageId}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = `<p class="fail">Validation not found or invalid storage ID.</p>`;
      return;
    }

    badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    detailsDiv.innerHTML = `
      <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
      <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
      <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
      <div class="field"><span class="label">BioID Hash:</span> <span class="value">${data.bioidHash || "—"}</span></div>
      <div class="field"><span class="label">Aereware Storage ID:</span> <span class="value">${data.storageId || "—"}</span></div>
      <div class="field"><span class="label">Private Note:</span> <span class="value">${data.w3Note || "—"}</span></div>
      <div class="field"><span class="label">Binary Backup:</span> <span class="value">${
        data.hasBinaryBackup ? "Stored on Aereware" : "Not available"
      }</span></div>
    `;

    // Mostrar lista de archivos
    if (data.files && data.files.length > 0) {
      fileList.innerHTML = data.files
        .map(
          (f) =>
            `<div class="field"><span class="label">${f.name}</span> <span class="value">${f.hash}</span></div>`
        )
        .join("");
    } else {
      fileList.innerHTML = "<p>No files recorded for this validation.</p>";
    }

    // Si tiene respaldo binario en Aereware, mostrar botón de descarga
    if (data.hasBinaryBackup && data.storageId) {
      const downloadUrl = `https://arweave.net/${data.storageId}`;
      downloadArea.innerHTML = `
        <a href="${downloadUrl}" class="back-link" target="_blank">
          Download ZIP from Aereware
        </a>
      `;
    } else {
      downloadArea.innerHTML = `<p class="subtitle">No binary backup available for this record.</p>`;
    }
  } catch (err) {
    console.error("❌ Error fetching private validation:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = "<p class='fail'>Error fetching private validation details.</p>";
  }
}

loadPrivateValidation();
