/*
// ======================================================
// 🌍 UDoChain Verify Public v4.4 — FINAL FUNCIONAL
// API SOURCE: api.udochain.com (Validate desacoplado)
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");

// ------------------------------------------------------
// 🔗 API BASE (LISTO PARA MIGRACIÓN TOTAL)
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load validation (PUBLIC)
// ======================================================
async function loadValidation() {
  if (!tx) {
    detailsDiv.innerHTML =
      "<p class='fail'>No transaction hash provided in URL.</p>";
    return;
  }

  try {
    const res = await fetch(`${VALIDATE_API}/api/validate/tx/${tx}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='fail'>Validation not found or invalid transaction hash.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // --------------------------------------------------
    // 🧾 Render public evidence
    // --------------------------------------------------
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
        <span class="label">GPS:</span>
        <span class="value">${data.gps || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Date (UTC):</span>
        <span class="value">${dateFormatted}</span>
      </div>

      <div class="field">
        <span class="label">Files:</span>
        <div class="value file-list">
          ${
            (data.files || [])
              .map(
                (f) =>
                  `<div>${f.name} — <small>${f.hash}</small></div>`
              )
              .join("") || "No files recorded"
          }
        </div>
      </div>
    `;

    // --------------------------------------------------
    // 🔐 Cache hashes for local verification
    // --------------------------------------------------
    window.validatedFiles =
      data.files?.map((f) => f.hash.toLowerCase()) || [];
  } catch (err) {
    console.error("❌ Verify public fetch error:", err);
    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML =
      "<p class='fail'>Error loading validation details.</p>";
  }
}

// ======================================================
// 📂 File upload / drop
// ======================================================
dropZone.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*.*";
  input.onchange = (e) => verifyFile(e.target.files[0]);
  input.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) verifyFile(file);
});

// ======================================================
// 🔍 Local file hash verification
// ======================================================
async function verifyFile(file) {
  if (!file) return;

  if (!window.validatedFiles?.length) {
    statusDiv.innerHTML =
      "<p class='fail'>Validation data not loaded yet.</p>";
    return;
  }

  statusDiv.textContent = "Analyzing file...";

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fileHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();

  if (window.validatedFiles.includes(fileHash)) {
    statusDiv.innerHTML =
      `<p class="ok">This file matches the blockchain validation record.</p>`;
  } else {
    statusDiv.innerHTML =
      `<p class="fail">This file does not match any validated record.</p>`;
  }
}

// ======================================================
// 🚀 INIT
// ======================================================
loadValidation();

*/
// ======================================================
// 🌍 UDoChain Verify Public — READS LIKE PRIVATE
// Usa ?storage= igual que verify-private
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS (IGUAL QUE PRIVATE)
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load validation (LEE STORAGE COMO PRIVATE)
// ======================================================
async function loadValidation() {
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
        "<p class='fail'>Validation not found.</p>";
      return;
    }

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // --------------------------------------------------
    // 🧾 Render evidence
    // --------------------------------------------------
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
        <span class="label">GPS:</span>
        <span class="value">${data.gps || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Date (UTC):</span>
        <span class="value">${dateFormatted}</span>
      </div>

      <div class="field">
        <span class="label">Files:</span>
        <div class="value file-list">
          ${
            (data.files || [])
              .map(
                (f) =>
                  `<div>${f.name} — <small>${f.hash}</small></div>`
              )
              .join("") || "No files recorded"
          }
        </div>
      </div>
    `;

    // --------------------------------------------------
    // 🔐 Cache hashes for local verification
    // --------------------------------------------------
    window.validatedFiles =
      data.files?.map((f) => f.hash.toLowerCase()) || [];

  } catch (err) {
    console.error("❌ Verify public fetch error:", err);
    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML =
      "<p class='fail'>Error loading validation details.</p>";
  }
}

// ======================================================
// 📂 File upload / drop
// ======================================================

dropZone.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*/*";
  input.onchange = (e) => verifyFile(e.target.files[0]);
  input.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) verifyFile(file);
});

// ======================================================
// 🔍 Local file hash verification
// ======================================================
async function verifyFile(file) {
  if (!file) return;

  if (!window.validatedFiles?.length) {
    statusDiv.innerHTML =
      "<p class='fail'>Validation data not loaded yet.</p>";
    return;
  }

  statusDiv.textContent = "Analyzing file...";

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const fileHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();

  if (window.validatedFiles.includes(fileHash)) {
    statusDiv.innerHTML =
      `<p class="ok">This file matches the blockchain validation record.</p>`;
  } else {
    statusDiv.innerHTML =
      `<p class="fail">This file does not match any validated record.</p>`;
  }
}

// ======================================================
// 🚀 INIT
// ======================================================
loadValidation();
