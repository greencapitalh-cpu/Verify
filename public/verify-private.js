// ======================================================
// 🌍 UDoChain Verify Private v4.0
// 100% público — Compatible con validate.udochain.com/api/validate/storage/:id
// ======================================================

const detailsDiv = document.getElementById("details");
const badgeDiv = document.getElementById("badge");
const fileList = document.getElementById("fileList");
const filesSection = document.getElementById("files-section");

const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");

if (!storageId) {
  detailsDiv.innerHTML = "<p class='fail'>No storage ID provided.</p>";
} else {
  fetch(`https://validate.udochain.com/api/validate/storage/${storageId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data?.ok) {
        badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
        detailsDiv.innerHTML =
          "<p class='fail'>Validation not found or invalid storage ID.</p>";
        return;
      }

      badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;

      const dateFormatted = new Date(data.validatedAt).toLocaleString();

      detailsDiv.innerHTML = `
        <h2>Private Validation Details</h2>
        <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
        <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
        <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
        <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
        <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
        <div class="field"><span class="label">BioID Hash:</span> <span class="value">${data.bioidHash || "—"}</span></div>
        <div class="field"><span class="label">Aereware Storage ID:</span> <span class="value">${data.storageId || "—"}</span></div>
        <div class="field"><span class="label">Binary Backup:</span> <span class="value">${data.hasBinaryBackup ? "Stored on Aereware ✅" : "Not available"}</span></div>
        <div class="field"><span class="label">Private Note:</span> <span class="value">${data.w3Note || "—"}</span></div>
      `;

      // Mostrar lista de archivos
      if (data.files && data.files.length > 0) {
        filesSection.style.display = "block";
        fileList.innerHTML = data.files
          .map(
            (f) =>
              `<div class="file-item">${f.name} — <small>${f.hash}</small></div>`
          )
          .join("");
      }

      // Si hay respaldo binario, agregar botón de descarga
      if (data.hasBinaryBackup && data.storageId) {
        const downloadUrl = `https://arweave.net/${data.storageId}`;
        const downloadBtn = document.createElement("a");
        downloadBtn.href = downloadUrl;
        downloadBtn.className = "download-btn";
        downloadBtn.textContent = "Download Binary ZIP from Aereware";
        detailsDiv.appendChild(downloadBtn);
      }
    })
    .catch((err) => {
      console.error("❌ Fetch error:", err);
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='fail'>Error fetching private validation details.</p>";
    });
}
