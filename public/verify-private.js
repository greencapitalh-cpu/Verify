// ======================================================
// 🟪 UDoChain Verify Private v4.2
// 100% público — muestra datos y permite descarga
// ======================================================
const detailsDiv = document.getElementById("details");
const badgeDiv = document.getElementById("badge");
const downloadBtn = document.getElementById("downloadBtn");

// Obtener el parámetro "storage" desde la URL
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ======================================================
// 🧠 Cargar validación privada
// ======================================================
async function loadPrivateValidation() {
  if (!storage) {
    detailsDiv.innerHTML = "<p class='fail'>Missing storage ID in URL.</p>";
    return;
  }

  try {
    const res = await fetch(`https://validate.udochain.com/api/validate/storage/${storage}`);
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
      <div class="field"><span class="label">BioID Hash:</span> <span class="value">${data.bioidHash || "—"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">Aereware Storage ID:</span> <span class="value">${data.storageId}</span></div>
      <div class="field"><span class="label">Private Storage:</span> <span class="value">${data.w3Note || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
      <div class="field"><span class="label">Files:</span> 
        <div class="value file-list">
          ${(data.files || [])
            .map(f => `<div>${f.name} — <small>${f.hash}</small></div>`)
            .join("") || "No files recorded"}
        </div>
      </div>
    `;

    if (data.hasBinaryBackup && data.storageId) {
      downloadBtn.style.display = "block";
      downloadBtn.onclick = () => {
        window.location.href = `https://validate.udochain.com/api/validate/aereware/download/${encodeURIComponent(data.storageId)}`;
      };
    }

  } catch (err) {
    console.error("❌ Fetch error:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = "<p class='fail'>Error loading private validation details.</p>";
  }
}

// Ejecutar al cargar
loadPrivateValidation();
