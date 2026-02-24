/*
// ======================================================
// 🟪 UDoChain Verify Private v4.9 — FINAL FUNCIONAL
// Private display — API desacoplada de validate.udochain.com
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");
const statusDiv = document.getElementById("status");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE (LISTO PARA MIGRACIÓN TOTAL)
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load private validation
// ======================================================
async function loadPrivateValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const res = await fetch(
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`
    );

    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='fail'>Validation not found or invalid storage ID.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // ======================================================
    // 🧾 Main information
    // ======================================================
    detailsDiv.innerHTML = `
      <div class="field">
        <span class="label">Evidence Title:</span>
        <span class="value">${data.evidenceTitle || "—"}</span>
      </div>

      ${
        data.summary
          ? `<div class="field">
               <span class="label">Summary:</span>
               <span class="value">${data.summary}</span>
             </div>`
          : ""
      }

      ${
        data.linkedSmartContract
          ? `<div class="field">
               <span class="label">Linked Smart Contract:</span>
               <span class="value">${data.linkedSmartContract}</span>
             </div>`
          : ""
      }

      <div class="field">
        <span class="label">Transaction Hash:</span>
        <span class="value">${data.txHash}</span>
      </div>

      <div class="field">
        <span class="label">Validated By:</span>
        <span class="value">${data.userEmail || "Unknown"}</span>
      </div>

      <div class="field">
        <span class="label">GPS:</span>
        <span class="value">${data.gps || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Date (UTC):</span>
        <span class="value">${dateFormatted}</span>
      </div>

      ${
        data.bioidHash
          ? `<div class="field">
               <span class="label">Identity Hash:</span>
               <span class="value">${data.bioidHash}</span>
             </div>`
          : ""
      }

      <div class="field">
        <span class="label">Storage ID:</span>
        <span class="value">${data.storageId || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Private Storage:</span>
        <span class="value">${data.w3Note || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Files:</span>
        <div class="value file-list">
          ${
            (data.files || [])
              .map(
                (f) => `<div>${f.name} — <small>${f.hash}</small></div>`
              )
              .join("") || "No files recorded"
          }
        </div>
      </div>
    `;

    // ======================================================
    // 📦 Downloads (Aereware)
    // ======================================================
    const downloads = [];

    // 📦 Custody ZIP
    if (data.binaryStorageId) {
      const cleanBinaryId = data.binaryStorageId.replace("ar://", "");
      const binaryUrl =
        `${VALIDATE_API}/api/validate/aereware/download/files/` +
        encodeURIComponent(cleanBinaryId);

      downloads.push(`
        <button class="download-btn"
          onclick="window.open('${binaryUrl}', '_blank')">
          Download Custody Files (ZIP)
        </button>
      `);
    }

    // 🧾 Metadata JSON
    if (data.storageId) {
      const cleanMetaId = data.storageId.replace("ar://", "");
      const metaUrl =
        `${VALIDATE_API}/api/validate/aereware/download/metadata/` +
        encodeURIComponent(cleanMetaId);

      downloads.push(`
        <button class="download-btn"
          style="background-color:#475569"
          onclick="window.open('${metaUrl}', '_blank')">
          Download Metadata (JSON)
        </button>
      `);
    }

    downloadsDiv.innerHTML =
      downloads.length > 0
        ? downloads.join("<br>")
        : "<p class='subtitle'>No downloadable content available.</p>";
  } catch (err) {
    console.error("❌ Verify private fetch error:", err);
    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML =
      "<p class='fail'>Error fetching private validation details.</p>";
  }
}

// ======================================================
// 🚀 INIT
// ======================================================
loadPrivateValidation();

*/

// ======================================================
// 🟪 UDoChain Verify Private v5.0 — PRODUCTION FIXED
// Compatible with /validate module mounting
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE CORRECTA
// ------------------------------------------------------
// Tu módulo está montado en /validate
// Y las rutas internas son /api/validate/...
// Resultado final:
// https://api.udochain.com/validate/api/validate/...

const API_BASE = "https://api.udochain.com";

// ======================================================
// 🧠 Load private validation
// ======================================================
async function loadPrivateValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const endpoint =
      `${API_BASE}/validate/api/validate/storage/` +
      encodeURIComponent(cleanId);

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error("Network response not OK");
    }

    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='fail'>Validation not found.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(
      data.validatedAt || data.createdAt
    ).toLocaleString();

    // ======================================================
    // 🧾






