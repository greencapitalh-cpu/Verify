// ======================================================
// 🌍 UDoChain Unified View — Public + Custody FINAL
// ======================================================

const VALIDATE_API = "https://api.udochain.com/validate";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const tx = params.get("tx");

const badgeDiv = document.getElementById("badge");
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");

const token = localStorage.getItem("udo_token");

// ------------------------------------------------------
// 🔍 Fetch validation
// ------------------------------------------------------
async function fetchValidation() {
  try {
    let url = null;

    if (id) {
      const cleanId = id.replace(/^ar:\/\//, "");
      url = `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`;
    }

    if (!url && tx) {
      url = `${VALIDATE_API}/api/validate/tx/${encodeURIComponent(tx)}`;
    }

    if (!url) {
      renderUnverified("No validation identifier provided.");
      return;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!data?.ok) {
      renderUnverified("Validation not found.");
      return;
    }

    renderValidation(data);

  } catch (err) {
    console.error("View fetch error:", err);
    renderUnverified("Error loading validation.");
  }
}

// ------------------------------------------------------
// ❌ Unverified state
// ------------------------------------------------------
function renderUnverified(message) {
  badgeDiv.innerHTML =
    `<div class="badge unverified">Unverified</div>`;
  detailsDiv.innerHTML = `<p>${message}</p>`;
}

// ------------------------------------------------------
// ✅ Render verified record
// ------------------------------------------------------
function renderValidation(data) {

  badgeDiv.innerHTML =
    `<div class="badge verified">Verified Record</div>`;

  const dateFormatted =
    data.validatedAt
      ? new Date(data.validatedAt).toLocaleString()
      : "—";

  detailsDiv.innerHTML = `
    <div class="field">
      <span class="label">Evidence Title:</span>
      <span class="value">${data.evidenceTitle || "—"}</span>
    </div>

    <div class="field">
      <span class="label">Transaction Hash:</span>
      <span class="value">${data.txHash || "—"}</span>
    </div>

    <div class="field">
      <span class="label">Date:</span>
      <span class="value">${dateFormatted}</span>
    </div>

    <div class="field">
      <span class="label">GPS:</span>
      <span class="value">${data.gps || "—"}</span>
    </div>

    <div class="field">
      <span class="label">Storage ID:</span>
      <span class="value">${data.storageId || "—"}</span>
    </div>

    <div class="field">
      <span class="label">Files:</span>
      <div class="value">
        ${
          (data.files || [])
            .map(f => `<div>${f.name} — <small>${f.hash}</small></div>`)
            .join("") || "No files recorded"
        }
      </div>
    </div>
  `;

  renderCustodyButton(data);
}

// ------------------------------------------------------
// 📦 Custody button (Modo B)
// ------------------------------------------------------
function renderCustodyButton(data) {

  if (!data.binaryStorageId) return;

  const cleanBinary =
    data.binaryStorageId.replace("ar://", "");

  const downloadUrl =
    `${VALIDATE_API}/api/validate/aereware/download/files/` +
    encodeURIComponent(cleanBinary);

  downloadsDiv.innerHTML = `
    <button class="download-btn" id="downloadBtn">
      Download Custody Files
    </button>
  `;

  document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {

      if (token) {
        window.open(downloadUrl, "_blank");
      } else {
        window.location.href =
          "https://app.udochain.com/login";
      }

    });
}

// ------------------------------------------------------
fetchValidation();
