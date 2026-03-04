// ======================================================
// 🟪 UDoChain Verify Private — FINAL STABLE VERSION
// Compatible with ValidateRoutes v6.1
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
let storage = params.get("storage");

const VERIFY_API = "https://api.udochain.com/validate/api/validate";

// ------------------------------------------------------
// Normalize ID
// ------------------------------------------------------
function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// Load validation
// ------------------------------------------------------
async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='notice'>No storage ID provided.</p>";
    return;
  }

  try {

    const cleanStorage = cleanId(storage);

    const res = await fetch(
      `${VERIFY_API}/storage/${encodeURIComponent(cleanStorage)}`
    );

    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='notice'>Validation not found.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(
      data.validatedAt
    ).toLocaleString();

    // ------------------------------------------------------
    // Details
    // ------------------------------------------------------
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
    // Download Button (ONLY if binary custody exists)
    // ------------------------------------------------------
    if (data.hasBinaryBackup && data.binaryStorageId) {

      const binaryId = cleanId(data.binaryStorageId);

      const downloadUrl =
        `${VERIFY_API}/aereware/download/files/${encodeURIComponent(binaryId)}`;

      downloadsDiv.innerHTML = `
        <button class="download-btn"
          onclick="window.location.href='${downloadUrl}'">
          Download Custody Files (ZIP)
        </button>
      `;

    } else {

      downloadsDiv.innerHTML = `
        <p class="notice">
          This validation was created without binary custody.
        </p>
      `;
    }

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";
  }
}

// ------------------------------------------------------
loadPrivateValidation();
