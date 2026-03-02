/*// ======================================================
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
loadPrivateValidation();*/

/*
//version sin botón metadata y mejor estética y sin pasar por render para descarga

// ======================================================
// 🟪 UDoChain Verify Private — Clean Version
// Direct Arweave download (no Render proxy)
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate";

async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>Invalid storage ID.</p>";
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
        "<p>Validation not found.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // =========================
    // Evidence Info
    // =========================
    detailsDiv.innerHTML = `
      <div class="field">
        <span class="label">Evidence Title</span>
        <span class="value">${data.evidenceTitle || "—"}</span>
      </div>

      ${
        data.summary
          ? `<div class="field">
               <span class="label">Summary</span>
               <span class="value">${data.summary}</span>
             </div>`
          : ""
      }

      ${
        data.linkedSmartContract
          ? `<div class="field">
               <span class="label">Smart Contract</span>
               <span class="value">${data.linkedSmartContract}</span>
             </div>`
          : ""
      }

      <div class="field">
        <span class="label">Transaction Hash</span>
        <span class="value">${data.txHash}</span>
      </div>

      <div class="field">
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>

      <div class="field">
        <span class="label">Validated At</span>
        <span class="value">${dateFormatted}</span>
      </div>

      ${
  Array.isArray(data.files) &&
  data.files.some(f => f?.name && f?.hash)
    ? `
      <div class="field">
        <span class="label">Files</span>
        ${
          data.files
            .filter(f => f?.name && f?.hash)
            .map(
              f => `
              <div class="file-item">
                ${f.name}
                <div class="file-hash">${f.hash}</div>
              </div>
            `
            )
            .join("")
        }
      </div>
    `
    : ""
      }
    `;

    // =========================
    // Direct ZIP download
    // =========================
    if (data.binaryStorageId) {

      const cleanBinaryId =
        data.binaryStorageId.replace("ar://", "");

      const directUrl =
        `https://arweave.net/${cleanBinaryId}`;

      downloadsDiv.innerHTML = `
        <button class="download-btn"
          onclick="window.open('${directUrl}', '_blank')">
          Download Original Files (ZIP)
        </button>
      `;

    } else {
      downloadsDiv.innerHTML =
        "<p>No downloadable files available.</p>";
    }

  } catch (err) {

    console.error(err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

loadPrivateValidation();

*/

/*
//ve4sion con password

// ======================================================
// 🟪 UDoChain Verify Private — Custody Protected Version
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate";
const CUSTODY_API = "https://api.udochain.com/validate/api/custody";

let currentStorageId = null;

// ======================================================
// 🔍 Load Validation
// ======================================================
async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>Invalid storage ID.</p>";
    return;
  }

  try {

    const cleanId = storage.replace(/^ar:\/\//, "");
    currentStorageId = storage;

    const res = await fetch(
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`
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

    const dateFormatted =
      new Date(data.validatedAt).toLocaleString();

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
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>

      <div class="field">
        <span class="label">Validated At</span>
        <span class="value">${dateFormatted}</span>
      </div>
    `;

    // 🔐 Custody download section
    downloadsDiv.innerHTML = `
      <div style="margin-top:1rem;">
        <input
          type="password"
          id="custodyPassword"
          placeholder="Enter custody password"
          style="
            width:100%;
            padding:12px;
            border-radius:10px;
            border:1px solid #e2e8f0;
            margin-bottom:10px;
          "
        />
        <button class="download-btn" id="protectedDownload">
          Download Protected Files (ZIP)
        </button>
        <div id="custodyStatus"
          style="margin-top:10px;font-size:0.9rem;">
        </div>
      </div>
    `;

    document
      .getElementById("protectedDownload")
      .addEventListener("click", downloadWithPassword);

  } catch (err) {

    console.error(err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

// ======================================================
// 🔐 Download with Password
// ======================================================
async function downloadWithPassword() {

  const password =
    document.getElementById("custodyPassword").value.trim();

  const statusDiv =
    document.getElementById("custodyStatus");

  if (!password) {
    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Password required.</span>";
    return;
  }

  statusDiv.innerHTML = "Verifying password...";

  try {

    const res = await fetch(
      `${CUSTODY_API}/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storageId: currentStorageId,
          password
        })
      }
    );

    if (!res.ok) {
      throw new Error("Invalid password");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "udochain-evidence.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    statusDiv.innerHTML =
      "<span style='color:#065f46'>Download started.</span>";

  } catch (err) {

    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Invalid password or access denied.</span>";
  }
}

loadPrivateValidation();
*/
/*
// versionbq descarga y el pitó para password

// ======================================================
// 🟪 UDoChain Verify Private — Custody Protected Version
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate";
const CUSTODY_API = "https://api.udochain.com/validate/api/custody";

let currentStorageId = null;

// ======================================================
// 🔍 Load Validation
// ======================================================
async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>Invalid storage ID.</p>";
    return;
  }

  try {

    const cleanId = storage.replace(/^ar:\/\//, "");
    currentStorageId = storage;

    const res = await fetch(
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`
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

    const dateFormatted =
      new Date(data.validatedAt).toLocaleString();

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
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>

      <div class="field">
        <span class="label">Validated At</span>
        <span class="value">${dateFormatted}</span>
      </div>
    `;

    // ==================================================
    // 🔐 Custody Protected Download UI
    // ==================================================
    downloadsDiv.innerHTML = `
      <div style="margin-top:1rem; position:relative;">

        <div style="position:relative;">
          <input
            type="password"
            id="custodyPassword"
            placeholder="Enter custody password"
            style="
              width:100%;
              padding:12px 40px 12px 12px;
              border-radius:10px;
              border:1px solid #e2e8f0;
              margin-bottom:10px;
              font-size:0.95rem;
            "
          />

          <span
            id="togglePassword"
            style="
              position:absolute;
              right:12px;
              top:50%;
              transform:translateY(-50%);
              cursor:pointer;
              font-size:1.1rem;
              color:#64748b;
            "
          >
            👁
          </span>
        </div>

        <button class="download-btn" id="protectedDownload">
          Download Protected Files (ZIP)
        </button>

        <div id="custodyStatus"
          style="margin-top:10px;font-size:0.9rem;">
        </div>

      </div>
    `;

    document
      .getElementById("protectedDownload")
      .addEventListener("click", downloadWithPassword);

    // 👁 Toggle visibility
    document
      .getElementById("togglePassword")
      .addEventListener("click", function () {

        const input =
          document.getElementById("custodyPassword");

        if (input.type === "password") {
          input.type = "text";
          this.textContent = "🙈";
        } else {
          input.type = "password";
          this.textContent = "👁";
        }
      });

  } catch (err) {

    console.error(err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

// ======================================================
// 🔐 Download with Password
// ======================================================
async function downloadWithPassword() {

  const password =
    document.getElementById("custodyPassword").value.trim();

  const statusDiv =
    document.getElementById("custodyStatus");

  if (!password) {
    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Password required.</span>";
    return;
  }

  statusDiv.innerHTML = "Verifying password...";

  try {

    const res = await fetch(
      `${CUSTODY_API}/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storageId: currentStorageId,
          password
        })
      }
    );

    const data = await res.json();

    if (!data.ok || !data.downloadUrl) {
      throw new Error("Invalid password");
    }

    // 🔥 Abrir descarga real desde Arweave
    window.open(data.downloadUrl, "_blank");

    statusDiv.innerHTML =
      "<span style='color:#065f46'>Download started.</span>";

  } catch (err) {

    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Invalid password or access denied.</span>";
  }
}

loadPrivateValidation();

*/
/*
//versión con ojos en password

// ======================================================
// 🟪 UDoChain Verify Private — Custody Protected Version
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate";
const CUSTODY_API = "https://api.udochain.com/validate/api/custody";

let currentStorageId = null;

// ======================================================
// 🔍 Load Validation
// ======================================================
async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>Invalid storage ID.</p>";
    return;
  }

  try {

    const cleanId = storage.replace(/^ar:\/\//, "");
    currentStorageId = storage;

    const res = await fetch(
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`
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

    const dateFormatted =
      new Date(data.validatedAt).toLocaleString();

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
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>

      <div class="field">
        <span class="label">Validated At</span>
        <span class="value">${dateFormatted}</span>
      </div>
    `;

    // ==================================================
    // 🔐 Custody Protected Download UI
    // ==================================================
    downloadsDiv.innerHTML = `
      <div style="margin-top:1rem;">

        <div class="password-wrapper">
          <input
            type="password"
            id="custodyPassword"
            class="password-input"
            placeholder="Enter custody password"
          />

          <button type="button"
            id="togglePassword"
            class="password-toggle"
            aria-label="Toggle password visibility">

            <!-- Eye Open -->
            <svg id="eyeOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>

            <!-- Eye Closed -->
            <svg id="eyeClosed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
              <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-5.94"/>
              <path d="M1 1l22 22"/>
              <path d="M9.88 9.88A3 3 0 0014.12 14.12"/>
            </svg>

          </button>
        </div>

        <button class="download-btn" id="protectedDownload">
          Download Protected Files (ZIP)
        </button>

        <div id="custodyStatus"
          style="margin-top:10px;font-size:0.9rem;">
        </div>

      </div>
    `;

    document
      .getElementById("protectedDownload")
      .addEventListener("click", downloadWithPassword);

    // ==================================================
    // 👁 Toggle visibility (PRO)
    // ==================================================
    const toggleBtn = document.getElementById("togglePassword");
    const input = document.getElementById("custodyPassword");
    const eyeOpen = document.getElementById("eyeOpen");
    const eyeClosed = document.getElementById("eyeClosed");

    toggleBtn.addEventListener("click", () => {

      if (input.type === "password") {
        input.type = "text";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
      } else {
        input.type = "password";
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
      }

    });

  } catch (err) {

    console.error(err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

// ======================================================
// 🔐 Download with Password
// ======================================================
async function downloadWithPassword() {

  const password =
    document.getElementById("custodyPassword").value.trim();

  const statusDiv =
    document.getElementById("custodyStatus");

  if (!password) {
    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Password required.</span>";
    return;
  }

  statusDiv.innerHTML = "Verifying password...";

  try {

    const res = await fetch(
      `${CUSTODY_API}/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storageId: currentStorageId,
          password
        })
      }
    );

    const data = await res.json();

    if (!data.ok || !data.downloadUrl) {
      throw new Error("Invalid password");
    }

    // 🔥 Abrir descarga real
    window.open(data.downloadUrl, "_blank");

    statusDiv.innerHTML =
      "<span style='color:#065f46'>Download started.</span>";

  } catch (err) {

    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Invalid password or access denied.</span>";
  }
}

loadPrivateValidation();
*/


// ======================================================
// 🟪 UDoChain Verify Private — Custody Protected Version
// Proxy Download Compatible (Render streams file)
// ======================================================

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate";
const CUSTODY_API = "https://api.udochain.com/validate/api/custody";

let currentStorageId = null;

// ======================================================
// 🔍 Load Validation
// ======================================================
async function loadPrivateValidation() {

  if (!storage) {
    detailsDiv.innerHTML = "<p>Invalid storage ID.</p>";
    return;
  }

  try {

    const cleanId = storage.replace(/^ar:\/\//, "");
    currentStorageId = storage;

    const res = await fetch(
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`
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

    const dateFormatted =
      new Date(data.validatedAt).toLocaleString();

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
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>

      <div class="field">
        <span class="label">Validated At</span>
        <span class="value">${dateFormatted}</span>
      </div>
    `;

    // ==================================================
    // 🔐 Custody Protected Download UI
    // ==================================================
    downloadsDiv.innerHTML = `
      <div style="margin-top:1rem;">

        <div class="password-wrapper">
          <input
            type="password"
            id="custodyPassword"
            class="password-input"
            placeholder="Enter custody password"
          />

          <button type="button"
            id="togglePassword"
            class="password-toggle"
            aria-label="Toggle password visibility">

            <svg id="eyeOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>

            <svg id="eyeClosed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
              <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-5.94"/>
              <path d="M1 1l22 22"/>
              <path d="M9.88 9.88A3 3 0 0014.12 14.12"/>
            </svg>

          </button>
        </div>

        <button class="download-btn" id="protectedDownload">
          Download Protected Files (ZIP)
        </button>

        <div id="custodyStatus"
          style="margin-top:10px;font-size:0.9rem;">
        </div>

      </div>
    `;

    document
      .getElementById("protectedDownload")
      .addEventListener("click", downloadWithPassword);

    // ==================================================
    // 👁 Toggle visibility
    // ==================================================
    const toggleBtn = document.getElementById("togglePassword");
    const input = document.getElementById("custodyPassword");
    const eyeOpen = document.getElementById("eyeOpen");
    const eyeClosed = document.getElementById("eyeClosed");

    toggleBtn.addEventListener("click", () => {

      if (input.type === "password") {
        input.type = "text";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
      } else {
        input.type = "password";
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
      }

    });

  } catch (err) {

    console.error(err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p>Error loading validation.</p>";
  }
}

// ======================================================
// 🔐 Download with Password (Proxy Compatible)
// ======================================================
async function downloadWithPassword() {

  const password =
    document.getElementById("custodyPassword").value.trim();

  const statusDiv =
    document.getElementById("custodyStatus");

  if (!password) {
    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Password required.</span>";
    return;
  }

  statusDiv.innerHTML = "Verifying password...";

  try {

    const res = await fetch(
      `${CUSTODY_API}/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storageId: currentStorageId,
          password
        })
      }
    );

    if (!res.ok) {
      throw new Error("Invalid password");
    }

    // 🔥 Ahora recibimos archivo directamente
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "evidence.zip";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    statusDiv.innerHTML =
      "<span style='color:#065f46'>Download started.</span>";

  } catch (err) {

    statusDiv.innerHTML =
      "<span style='color:#991b1b'>Invalid password or access denied.</span>";
  }
}

loadPrivateValidation();
