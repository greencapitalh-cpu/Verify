// ======================================================
// 🟪 UDoChain Verify Private v4.3
// 100% público — muestra datos privados y permite descargar ZIP de Aereware
// ======================================================

const detailsDiv = document.getElementById("details");
const badgeDiv = document.getElementById("badge");
const downloadsDiv = document.getElementById("downloads");

// Obtener storage ID desde la URL (?storage=ar://xxxxx)
const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");

async function loadPrivateValidation() {
  if (!storageId) {
    detailsDiv.innerHTML = "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const id = storageId.replace("ar://", "");
    const res = await fetch(`https://validate.udochain.com/api/validate/storage/${id}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = `<p class="fail">Error fetching private validation details.</p>`;
      return;
    }

    badgeDiv.innerHTML = `<div class="badge verified">Verified (Private Record)</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    detailsDiv.innerHTML = `
      <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
      <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
      <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">BioID Hash:</span> <span class="value">${data.bioidHash || "—"}</span></div>
      <div class="field"><span class="label">Storage ID:</span> <span class="value">${data.storageId}</span></div>
      <div class="field"><span class="label">Private Storage:</span> <span class="value">${data.w3Note || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
    `;

    // Si hay respaldo binario, muestra botón de descarga
    if (data.hasBinaryBackup) {
      downloadsDiv.innerHTML = `
        <a href="https://validate.udochain.com/api/validate/aereware/download/${id}"
           class="download-btn">Download from Aereware</a>
      `;
    } else {
      downloadsDiv.innerHTML = `<p class="subtitle" style="color:#64748b;">No binary backups available.</p>`;
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = "<p class='fail'>Error loading private validation details.</p>";
  }
}

loadPrivateValidation();
