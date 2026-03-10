/*// ======================================================
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
*/
/*

const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
let storage = params.get("storage");

const VERIFY_API = "https://api.udochain.com/validate/api/validate";

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// Download UX flow
// ------------------------------------------------------
function startDownload(url, button, statusDiv) {

  button.classList.add("loading");
  button.disabled = true;

  statusDiv.innerText = "Preparing secure archive...";

  setTimeout(() => {

    statusDiv.innerText = "Downloading evidence...";

    window.location.href = url;

  }, 700);
}

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

    if (data.hasBinaryBackup && data.binaryStorageId) {

      const binaryId = cleanId(data.binaryStorageId);

      const downloadUrl =
        `${VERIFY_API}/aereware/download/files/${encodeURIComponent(binaryId)}`;

      downloadsDiv.innerHTML = `
        <button id="downloadBtn" class="download-btn">
          Download Custody Files (ZIP)
        </button>

        <div id="downloadStatus" class="download-status"></div>
      `;

      const btn = document.getElementById("downloadBtn");
      const status = document.getElementById("downloadStatus");

      btn.addEventListener("click", () => {
        startDownload(downloadUrl, btn, status);
      });

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

loadPrivateValidation();
*/
/*
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
let storage = params.get("storage");

const VERIFY_API = "https://api.udochain.com/validate/api/validate";

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// EMAIL REQUEST
// ------------------------------------------------------

async function requestDownload(email, storageId) {

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {

    const res = await fetch(`${VERIFY_API}/request-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        storageId
      })
    });

    const data = await res.json();

    if (data.ok) {

      alert("A secure download link has been sent to your email.");

    } else {

      alert(data.error || "Error sending download link.");

    }

  } catch (err) {

    console.error("Download request error:", err);
    alert("Error sending request.");

  }

}

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

    // --------------------------------------------------
    // DOWNLOAD SECTION
    // --------------------------------------------------

    if (!data.hasBinaryBackup) {

      downloadsDiv.innerHTML = `
        <p class="notice">
          This validation was created without binary custody.
        </p>
      `;

      return;
    }

    // --------------------------------------------------
    // DOWNLOAD DISABLED
    // --------------------------------------------------

    if (data.downloadPolicy === "disabled") {

      downloadsDiv.innerHTML = `
        <p class="notice">
          Download disabled by the evidence owner.
        </p>
      `;

      return;
    }

    // --------------------------------------------------
    // DOWNLOAD ACTIVE → EMAIL FLOW
    // --------------------------------------------------

    downloadsDiv.innerHTML = `

      <div class="notice">
        To protect the integrity of this evidence, downloads are delivered through a secure email link.
      </div>

      <input
        id="emailInput"
        type="email"
        placeholder="Enter your email address"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:1px solid #e2e8f0;
          margin-top:14px;
        "
      />

      <button
        id="sendBtn"
        class="download-btn"
      >
        Request Secure Download
      </button>

      <div class="download-status">
        You will receive a temporary download link in your email.
      </div>
    `;

    const btn = document.getElementById("sendBtn");

    btn.addEventListener("click", () => {

      const email = document
        .getElementById("emailInput")
        .value
        .trim();

      requestDownload(email, data.storageId);

    });

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";

  }

}

loadPrivateValidation();
*/







/*
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
let storage = params.get("storage");

const VERIFY_API = "https://api.udochain.com/validate/api/verify";

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// EMAIL REQUEST
// ------------------------------------------------------

async function requestDownload(email, storageId) {

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {

    const res = await fetch(`${VERIFY_API}/request-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        storageId
      })
    });

    const data = await res.json();

    if (data.ok) {

      alert("A secure download link has been sent to your email.");

    } else {

      alert(data.error || "Error sending download link.");

    }

  } catch (err) {

    console.error("Download request error:", err);
    alert("Error sending request.");

  }

}

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

    // --------------------------------------------------
    // DOWNLOAD SECTION
    // --------------------------------------------------

    if (!data.hasBinaryBackup) {

      downloadsDiv.innerHTML = `
        <p class="notice">
          This validation was created without binary custody.
        </p>
      `;

      return;
    }

    if (data.downloadPolicy === "disabled") {

      downloadsDiv.innerHTML = `
        <p class="notice">
          Download disabled by the evidence owner.
        </p>
      `;

      return;
    }

    downloadsDiv.innerHTML = `

      <div class="notice">
        To protect the integrity of this evidence, downloads are delivered through a secure email link.
      </div>

      <input
        id="emailInput"
        type="email"
        placeholder="Enter your email address"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:1px solid #e2e8f0;
          margin-top:14px;
        "
      />

      <button
        id="sendBtn"
        class="download-btn"
      >
        Request Secure Download
      </button>

      <div class="download-status">
        You will receive a temporary download link in your email.
      </div>
    `;

    const btn = document.getElementById("sendBtn");

    btn.addEventListener("click", () => {

      const email = document
        .getElementById("emailInput")
        .value
        .trim();

      requestDownload(email, data.storageId);

    });

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";

  }

}

loadPrivateValidation();*/

/*
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);

let storage = params.get("storage");
let authToken = params.get("auth");

const VERIFY_API = "https://api.udochain.com/validate/api/verify";
const DOWNLOAD_API = "https://api.udochain.com/validate/api/validate";

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// DETECT LOGIN TOKEN
// ------------------------------------------------------

function getAuthToken() {

  // primero verificar si viene desde dashboard
  if (authToken) {
    return authToken;
  }

  // fallback localStorage
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }

}

// ------------------------------------------------------
// EMAIL REQUEST
// ------------------------------------------------------

async function requestDownload(email, storageId) {

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {

    const res = await fetch(`${VERIFY_API}/request-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        storageId
      })
    });

    const data = await res.json();

    if (data.ok) {

      alert("A secure download link has been sent to your email.");

    } else {

      alert(data.error || "Error sending download link.");

    }

  } catch (err) {

    console.error("Download request error:", err);
    alert("Error sending request.");

  }

}

// ------------------------------------------------------
// DIRECT DOWNLOAD (LOGGED USER)
// ------------------------------------------------------

function directDownload(binaryId) {

  const cleanBinary = cleanId(binaryId);

  const url =
`${DOWNLOAD_API}/aereware/download/files/${encodeURIComponent(cleanBinary)}`;

  window.open(url, "_blank");

}

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

    // --------------------------------------------------
    // DOWNLOAD SECTION
    // --------------------------------------------------

    if (!data.hasBinaryBackup) {

      downloadsDiv.innerHTML = `
        <p class="notice">
          This validation was created without binary custody.
        </p>
      `;

      return;
    }

    if (data.downloadPolicy === "disabled") {

      downloadsDiv.innerHTML = `
        <p class="notice">
          Download disabled by the evidence owner.
        </p>
      `;

      return;
    }

    const token = getAuthToken();

    // --------------------------------------------------
    // USER LOGGED → DIRECT DOWNLOAD
    // --------------------------------------------------

    if (token && data.binaryStorageId) {

      downloadsDiv.innerHTML = `

        <button
          id="directDownloadBtn"
          class="download-btn"
        >
          Download Evidence Files
        </button>

        <div class="download-status">
          Direct download available for authenticated users.
        </div>
      `;

      const btn = document.getElementById("directDownloadBtn");

      btn.addEventListener("click", () => {
        directDownload(data.binaryStorageId);
      });

      return;
    }

    // --------------------------------------------------
    // PUBLIC USER → EMAIL REQUEST
    // --------------------------------------------------

    downloadsDiv.innerHTML = `

      <div class="notice">
        To protect the integrity of this evidence, downloads are delivered through a secure email link.
      </div>

      <input
        id="emailInput"
        type="email"
        placeholder="Enter your email address"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:1px solid #e2e8f0;
          margin-top:14px;
        "
      />

      <button
        id="sendBtn"
        class="download-btn"
      >
        Request Secure Download
      </button>

      <div class="download-status">
        You will receive a temporary download link in your email.
      </div>
    `;

    const btn = document.getElementById("sendBtn");

    btn.addEventListener("click", () => {

      const email = document
        .getElementById("emailInput")
        .value
        .trim();

      requestDownload(email, data.storageId);

    });

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";

  }

}

loadPrivateValidation();*/








/*
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);

let storage = params.get("storage");
let authToken = params.get("auth");

const VERIFY_API = "https://api.udochain.com/validate/api/verify";
const DOWNLOAD_API = "https://api.udochain.com/validate/api/validate";

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// REMOVE TOKEN FROM URL (SECURITY)
// ------------------------------------------------------

if (authToken) {

  const cleanUrl =
    window.location.origin +
    window.location.pathname +
    `?storage=${encodeURIComponent(storage)}`;

  window.history.replaceState({}, document.title, cleanUrl);

}

// ------------------------------------------------------
// DETECT LOGIN TOKEN
// ------------------------------------------------------

function getAuthToken() {

  // primero verificar si viene desde dashboard
  if (authToken) {
    return authToken;
  }

  // fallback localStorage
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }

}

// ------------------------------------------------------
// EMAIL REQUEST
// ------------------------------------------------------

async function requestDownload(email, storageId) {

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {

    const res = await fetch(`${VERIFY_API}/request-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        storageId
      })
    });

    const data = await res.json();

    if (data.ok) {

      alert("A secure download link has been sent to your email.");

    } else {

      alert(data.error || "Error sending download link.");

    }

  } catch (err) {

    console.error("Download request error:", err);
    alert("Error sending request.");

  }

}

// ------------------------------------------------------
// DIRECT DOWNLOAD (LOGGED USER)
// ------------------------------------------------------

function directDownload(binaryId) {

  const cleanBinary = cleanId(binaryId);

  const url =
`${DOWNLOAD_API}/aereware/download/files/${encodeURIComponent(cleanBinary)}`;

  window.open(url, "_blank");

}

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

    // --------------------------------------------------
    // DOWNLOAD SECTION
    // --------------------------------------------------

    if (!data.hasBinaryBackup) {

      downloadsDiv.innerHTML = `
        <p class="notice">
          This validation was created without binary custody.
        </p>
      `;

      return;
    }

    if (data.downloadPolicy === "disabled") {

      downloadsDiv.innerHTML = `
        <p class="notice">
          Download disabled by the evidence owner.
        </p>
      `;

      return;
    }

    const token = getAuthToken();

    // --------------------------------------------------
    // USER LOGGED → DIRECT DOWNLOAD
    // --------------------------------------------------

    if (token && data.binaryStorageId) {

      downloadsDiv.innerHTML = `

        <button
          id="directDownloadBtn"
          class="download-btn"
        >
          Download Evidence Files
        </button>

        <div class="download-status">
          Direct download available for authenticated users.
        </div>
      `;

      const btn = document.getElementById("directDownloadBtn");

      btn.addEventListener("click", () => {
        directDownload(data.binaryStorageId);
      });

      return;
    }

    // --------------------------------------------------
    // PUBLIC USER → EMAIL REQUEST
    // --------------------------------------------------

    downloadsDiv.innerHTML = `

      <div class="notice">
        To protect the integrity of this evidence, downloads are delivered through a secure email link.
      </div>

      <input
        id="emailInput"
        type="email"
        placeholder="Enter your email address"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:1px solid #e2e8f0;
          margin-top:14px;
        "
      />

      <button
        id="sendBtn"
        class="download-btn"
      >
        Request Secure Download
      </button>

      <div class="download-status">
        You will receive a temporary download link in your email.
      </div>
    `;

    const btn = document.getElementById("sendBtn");

    btn.addEventListener("click", () => {

      const email = document
        .getElementById("emailInput")
        .value
        .trim();

      requestDownload(email, data.storageId);

    });

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";

  }

}

loadPrivateValidation();
*/






const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);

let storage = params.get("storage");
let authToken = params.get("auth");

const VERIFY_API = "https://api.udochain.com/validate/api/verify";
const DOWNLOAD_API = "https://api.udochain.com/validate/api/validate";

const USER_LANG = navigator.language || "en";

// ------------------------------------------------------
// SIMPLE TEXT TRANSLATIONS
// ------------------------------------------------------

const TEXT = {

  en: {
    emailRequired: "Please enter your email address.",
    requestSuccess: "Your request has been registered. Please check your email.",
    requestOwnerApproval: "Your request was registered. The evidence owner will review your access request.",
    requestError: "Unable to process your request.",
    validationNotFound: "Validation not found.",
    noStorage: "No storage ID provided.",
    noBinary: "This validation was created without binary custody.",
    downloadDisabled: "Downloads are disabled by the evidence owner.",
    downloadAvailable: "Direct download available for authenticated users.",
    downloadEmailInfo: "To protect the integrity of this evidence, downloads are delivered through a secure email link.",
    downloadEmailStatus: "You will receive a temporary download link in your email."
  },

  es: {
    emailRequired: "Por favor ingrese su correo electrónico.",
    requestSuccess: "Su solicitud fue registrada. Revise su correo electrónico.",
    requestOwnerApproval: "Su solicitud fue registrada. El propietario de la evidencia revisará su solicitud.",
    requestError: "No se pudo procesar la solicitud.",
    validationNotFound: "Validación no encontrada.",
    noStorage: "No se proporcionó un identificador de almacenamiento.",
    noBinary: "Esta validación fue creada sin custodia binaria.",
    downloadDisabled: "Las descargas están deshabilitadas por el propietario de la evidencia.",
    downloadAvailable: "Descarga directa disponible para usuarios autenticados.",
    downloadEmailInfo: "Para proteger la integridad de esta evidencia, las descargas se envían mediante un enlace seguro por correo.",
    downloadEmailStatus: "Recibirá un enlace de descarga temporal en su correo."
  }

};

function t(key) {

  const lang = USER_LANG.startsWith("es") ? "es" : "en";
  return TEXT[lang][key] || key;

}

// ------------------------------------------------------
// CLEAN STORAGE ID
// ------------------------------------------------------

function cleanId(id) {
  return id.replace(/^ar:\/\//, "");
}

// ------------------------------------------------------
// REMOVE TOKEN FROM URL (SECURITY)
// ------------------------------------------------------

if (authToken) {

  const cleanUrl =
    window.location.origin +
    window.location.pathname +
    `?storage=${encodeURIComponent(storage)}`;

  window.history.replaceState({}, document.title, cleanUrl);

}

// ------------------------------------------------------
// DETECT LOGIN TOKEN
// ------------------------------------------------------

function getAuthToken() {

  if (authToken) {
    return authToken;
  }

  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }

}

// ------------------------------------------------------
// EMAIL REQUEST
// ------------------------------------------------------

async function requestDownload(email, storageId) {

  if (!email) {

    alert(t("emailRequired"));
    return;

  }

  try {

    const res = await fetch(`${VERIFY_API}/request-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        storageId,
        lang: USER_LANG
      })
    });

    const data = await res.json();

    if (data.ok) {

      if (data.message) {
        alert(t("requestOwnerApproval"));
      } else {
        alert(t("requestSuccess"));
      }

    } else {

      alert(data.error || t("requestError"));

    }

  } catch (err) {

    console.error("Download request error:", err);
    alert(t("requestError"));

  }

}

// ------------------------------------------------------
// DIRECT DOWNLOAD (LOGGED USER)
// ------------------------------------------------------

function directDownload(binaryId) {

  const cleanBinary = cleanId(binaryId);

  const url =
`${DOWNLOAD_API}/aereware/download/files/${encodeURIComponent(cleanBinary)}`;

  window.open(url, "_blank");

}

// ------------------------------------------------------
// LOAD VALIDATION
// ------------------------------------------------------

async function loadPrivateValidation() {

  if (!storage) {

    detailsDiv.innerHTML =
      `<p class='notice'>${t("noStorage")}</p>`;

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
        `<p class='notice'>${t("validationNotFound")}</p>`;

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
        <span class="label">Date (UTC)</span>
        <span class="value">${dateFormatted}</span>
      </div>

      <div class="field">
        <span class="label">Storage ID</span>
        <span class="value">${data.storageId}</span>
      </div>
    `;

    // --------------------------------------------------
    // DOWNLOAD SECTION
    // --------------------------------------------------

    if (!data.hasBinaryBackup) {

      downloadsDiv.innerHTML = `
        <p class="notice">
          ${t("noBinary")}
        </p>
      `;

      return;

    }

    if (data.downloadPolicy === "disabled") {

      downloadsDiv.innerHTML = `
        <p class="notice">
          ${t("downloadDisabled")}
        </p>
      `;

      return;

    }

    const token = getAuthToken();

    // --------------------------------------------------
    // USER LOGGED → DIRECT DOWNLOAD
    // --------------------------------------------------

    if (token && data.binaryStorageId) {

      downloadsDiv.innerHTML = `

        <button
          id="directDownloadBtn"
          class="download-btn"
        >
          Download Evidence Files
        </button>

        <div class="download-status">
          ${t("downloadAvailable")}
        </div>
      `;

      const btn =
        document.getElementById("directDownloadBtn");

      btn.addEventListener("click", () => {

        directDownload(data.binaryStorageId);

      });

      return;

    }

    // --------------------------------------------------
    // PUBLIC USER → EMAIL REQUEST
    // --------------------------------------------------

    downloadsDiv.innerHTML = `

      <div class="notice">
        ${t("downloadEmailInfo")}
      </div>

      <input
        id="emailInput"
        type="email"
        placeholder="Enter your email address"
        style="
          width:100%;
          padding:12px;
          border-radius:10px;
          border:1px solid #e2e8f0;
          margin-top:14px;
        "
      />

      <button
        id="sendBtn"
        class="download-btn"
      >
        Request Secure Download
      </button>

      <div class="download-status">
        ${t("downloadEmailStatus")}
      </div>
    `;

    const btn =
      document.getElementById("sendBtn");

    btn.addEventListener("click", () => {

      const email =
        document
        .getElementById("emailInput")
        .value
        .trim();

      requestDownload(email, data.storageId);

    });

  } catch (err) {

    console.error("❌ Private verify error:", err);

    badgeDiv.innerHTML =
      `<div class="badge unverified">Error</div>`;

    detailsDiv.innerHTML =
      "<p class='notice'>Error loading validation data.</p>";

  }

}

loadPrivateValidation();
