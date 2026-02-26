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
  }*/
/*
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
   window.validatedFiles = (data.files || []) .filter(f => f && typeof f.hash === "string") .map(f => f.hash.toLowerCase());
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
  input.accept = "*%*";
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

/*
// ======================================================
// 🌍 UDoChain Verify Public v5.0 — STORAGE MODE
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load validation (PUBLIC - STORAGE)
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
*/
/*
// ======================================================
// 🌍 UDoChain Verify Public v5.1 — STORAGE MODE (STABLE)
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load validation (PUBLIC - STORAGE)
// ======================================================
async function loadValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const endpoint =
      `${VALIDATE_API}/api/validate/storage/${encodeURIComponent(cleanId)}`;

    const res = await fetch(endpoint);

    // 🔴 Validación crítica (evita quedarse colgado)
    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
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
  input.accept = "*%*";
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

/*
// ======================================================
// 🌍 UDoChain Verify Public — STABLE STORAGE VERSION
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate";

// ======================================================
// 🧠 Load PUBLIC validation via storageId
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

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
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

    // --------------------------------------------------
    // 🧾 Render PUBLIC evidence
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
        <span class="value">${data.txHash || "—"}</span>
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
    window.validatedFiles = (data.files || [])
      .filter(f => f && typeof f.hash === "string")
      .map(f => f.hash.toLowerCase());

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
  input.accept = "*%*";
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
loadValidation();*/

/*

// ======================================================
// 🌍 UDoChain Verify Public — STABLE STORAGE VERSION v6.0
// Backend aligned with /validate/api/verify
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE (ALINEADO CON BACKEND REAL)
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🧠 Load PUBLIC validation via storageId
// ======================================================
async function loadValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const endpoint =
      `${VALIDATE_API}/storage/${encodeURIComponent(cleanId)}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }

    const data = await res.json();

    if (!data?.ok || !data.data) {
      badgeDiv.innerHTML =
        `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML =
        "<p class='fail'>Validation not found.</p>";
      return;
    }

    const payload = data.data;

    badgeDiv.innerHTML =
      `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(
      payload.evidence?.validatedAt
    ).toLocaleString();

    // --------------------------------------------------
    // 🧾 Render PUBLIC evidence (Metadata v2 compatible)
    // --------------------------------------------------
    detailsDiv.innerHTML = `
      <div class="field">
        <span class="label">Evidence Title:</span>
        <span class="value">${payload.evidence?.title || "—"}</span>
      </div>

      ${
        payload.evidence?.summary
          ? `<div class="field">
               <span class="label">Summary:</span>
               <span class="value">${payload.evidence.summary}</span>
             </div>`
          : ""
      }

      <div class="field">
        <span class="label">Transaction Hash:</span>
        <span class="value">${payload.anchors?.polygon?.txHash || "—"}</span>
      </div>

      <div class="field">
        <span class="label">GPS:</span>
        <span class="value">${payload.evidence?.gps || "—"}</span>
      </div>

      <div class="field">
        <span class="label">Date (UTC):</span>
        <span class="value">${dateFormatted}</span>
      </div>

      <div class="field">
        <span class="label">Files:</span>
        <div class="value file-list">
          ${
            (payload.files || [])
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
    window.validatedFiles = (payload.files || [])
      .filter(f => f && typeof f.hash === "string")
      .map(f => f.hash.toLowerCase());

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
  input.accept = "*%*";
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

/*
// ======================================================
// 🌍 UDoChain Verify Public — STABLE PRODUCTION (Mongo)
// Compatible with:
// GET /validate/api/verify/storage/:storageId
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// ------------------------------------------------------
// 🔗 PARAMS
// ------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

// ------------------------------------------------------
// 🔗 API BASE (ALIGNED WITH BACKEND)
// ------------------------------------------------------
const VALIDATE_API = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🧠 Load PUBLIC validation via storageId (Mongo)
// ======================================================
async function loadValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const endpoint =
      `${VALIDATE_API}/storage/${encodeURIComponent(cleanId)}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
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

    // --------------------------------------------------
    // 🧾 Render PUBLIC evidence (Mongo structure)
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
        <span class="value">${data.txHash || "—"}</span>
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
    window.validatedFiles = (data.files || [])
      .filter(f => f && typeof f.hash === "string")
      .map(f => f.hash.toLowerCase());

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
  input.accept = "*%*";
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


/*
// Mejora de estética y botón a dashboard 
// ======================================================
// 🌍 UDoChain Verify Public — PRODUCTION (Mongo)
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate/api/verify";

async function loadValidation() {
  if (!storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const cleanId = storage.replace(/^ar:\/\//, "");

    const endpoint =
      `${VALIDATE_API}/storage/${encodeURIComponent(cleanId)}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
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

    const filesHTML = (data.files || [])
      .filter(f => f && f.name && f.hash)
      .map(f => `
        <div class="file-item">
          <div class="file-name">${f.name}</div>
          <div class="file-hash">${f.hash}</div>
        </div>
      `).join("");

    detailsDiv.innerHTML = `
      <div class="field">
        <div class="label">Evidence Title</div>
        <div class="value">${data.evidenceTitle || "—"}</div>
      </div>

      ${data.summary ? `
      <div class="field">
        <div class="label">Summary</div>
        <div class="value">${data.summary}</div>
      </div>` : ""}

      ${data.linkedSmartContract ? `
      <div class="field">
        <div class="label">Linked Smart Contract</div>
        <div class="value">${data.linkedSmartContract}</div>
      </div>` : ""}

      <div class="field">
        <div class="label">Transaction Hash</div>
        <div class="value">${data.txHash || "—"}</div>
      </div>

      <div class="field">
        <div class="label">GPS</div>
        <div class="value">${data.gps || "—"}</div>
      </div>

      <div class="field">
        <div class="label">Date (UTC)</div>
        <div class="value">${dateFormatted}</div>
      </div>

      <div class="field">
        <div class="label">Files</div>
        ${filesHTML || "<div class='value'>No files recorded</div>"}
      </div>
    `;

    window.validatedFiles = (data.files || [])
      .filter(f => f && typeof f.hash === "string")
      .map(f => f.hash.toLowerCase());

  } catch (err) {
    console.error("❌ Verify public fetch error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p class='fail'>Error loading validation details.</p>";
  }
}

dropZone.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*%*";
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
    .map(b => b.toString(16).padStart(2, "0"))
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

loadValidation();*/

// versión que conecta a través de txhash


// ======================================================
// 🌍 UDoChain Verify Public — PRODUCTION (TX + STORAGE)
// Compatible with:
// - ?tx=0x... (NEW PUBLIC)
// - ?storage=ar://... (LEGACY)
// Backend: /validate/api/verify
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");
const storage = params.get("storage");

const VALIDATE_API = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🧠 LOAD VALIDATION (TX OR STORAGE)
// ======================================================
async function loadValidation() {

  if (!tx && !storage) {
    detailsDiv.innerHTML =
      "<p class='fail'>No transaction hash or storage ID provided in URL.</p>";
    return;
  }

  try {

    let endpoint;

    // 🔥 PRIORITY 1 → TX (NEW PUBLIC MODE)
    if (tx) {
      endpoint = `${VALIDATE_API}/tx/${encodeURIComponent(tx.toLowerCase())}`;
    }

    // 🔥 PRIORITY 2 → STORAGE (LEGACY)
    else if (storage) {
      const cleanId = storage.replace(/^ar:\/\//, "");
      endpoint = `${VALIDATE_API}/storage/${encodeURIComponent(cleanId)}`;
    }

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
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

    const filesHTML = (data.files || [])
      .filter(f => f && f.name && f.hash)
      .map(f => `
        <div class="file-item">
          <div class="file-name">${f.name}</div>
          <div class="file-hash">${f.hash}</div>
        </div>
      `).join("");

    detailsDiv.innerHTML = `
      <div class="field">
        <div class="label">Evidence Title</div>
        <div class="value">${data.evidenceTitle || "—"}</div>
      </div>

      ${data.summary ? `
      <div class="field">
        <div class="label">Summary</div>
        <div class="value">${data.summary}</div>
      </div>` : ""}

      ${data.linkedSmartContract ? `
      <div class="field">
        <div class="label">Linked Smart Contract</div>
        <div class="value">${data.linkedSmartContract}</div>
      </div>` : ""}

      <div class="field">
        <div class="label">Transaction Hash</div>
        <div class="value">${data.txHash || tx || "—"}</div>
      </div>

      <div class="field">
        <div class="label">GPS</div>
        <div class="value">${data.gps || "—"}</div>
      </div>

      <div class="field">
        <div class="label">Date (UTC)</div>
        <div class="value">${dateFormatted}</div>
      </div>

      <div class="field">
        <div class="label">Files</div>
        ${filesHTML || "<div class='value'>No files recorded</div>"}
      </div>
    `;

    // 🔐 Cache hashes for local verification
    window.validatedFiles = (data.files || [])
      .filter(f => f && typeof f.hash === "string")
      .map(f => f.hash.toLowerCase());

  } catch (err) {

    console.error("❌ Verify public fetch error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Unverified</div>`;

    detailsDiv.innerHTML =
      "<p class='fail'>Error loading validation details.</p>";
  }
}

// ======================================================
// 📂 FILE UPLOAD
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
// 🔍 LOCAL FILE HASH VERIFICATION
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
    .map(b => b.toString(16).padStart(2, "0"))
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

