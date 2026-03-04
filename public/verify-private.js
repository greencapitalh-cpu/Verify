const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VERIFY_API = "https://api.udochain.com/validate/api/verify";
const VALIDATE_API = "https://api.udochain.com/validate";

async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>No storage ID provided.</p>";
    return;
  }

  try {

    const cleanId = storage.replace(/^ar:\/\//, "");

    const res = await fetch(
      `${VERIFY_API}/storage/${encodeURIComponent(cleanId)}`
    );

    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p>Validation not found.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(
      data.validatedAt || data.createdAt
    ).toLocaleString();

    // 🔹 Información básica (sin lista de files)
    detailsDiv.innerHTML = `
      <div class="field">
        <span class="label">Evidence Title</span>
        <span class="value">${data.evidenceTitle || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Transaction Hash</span>
        <span class="value">${data.txHash}</span>
      </div>

      <div class="field">
        <span class="label">Date (UTC)</span>
        <span class="value">${dateFormatted}</span>
      </div>

      <div class="field">
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>
    `;

    // ------------------------------------------------------
    // 🔥 SOPORTA DOS FORMAS DE CUSTODIA
    // ------------------------------------------------------

    let downloadId = null;

    // ✅ Forma nueva
    if (data.binaryStorageId && data.binaryStorageId !== data.storageId) {
      downloadId = data.binaryStorageId;
    }

    // ✅ Forma legacy
    else if (data.hasBinaryBackup === true && data.storageId) {
      downloadId = data.storageId;
    }

    if (downloadId) {

      const cleanDownloadId =
        downloadId.replace(/^ar:\/\//, "");

      const binaryUrl =
        `${VALIDATE_API}/api/aereware/download/files/` +
        encodeURIComponent(cleanDownloadId);

      downloadsDiv.innerHTML = `
        <button class="download-btn"
          onclick="window.open('${binaryUrl}', '_blank')">
          Download Custody Files (ZIP)
        </button>
      `;

    } else {

      downloadsDiv.innerHTML = `
        <p style="text-align:center;color:#64748b;">
          This validation was created without binary custody.
        </p>
      `;
    }

  } catch (err) {

    console.error("Verify private error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

loadPrivateValidation();
