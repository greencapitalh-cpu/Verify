// ======================================================
// 🌍 UDoChain Verify Public v3.9
// Compatible con validate.udochain.com/api/validate/tx/:txHash?email=...
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");

// ======================================================
// 🔹 Leer email desde hash (#email=) si existe
// ======================================================
let email = null;
if (window.location.hash.includes("#email=")) {
  email = decodeURIComponent(window.location.hash.replace("#email=", ""));
  console.log("📧 Email detected from QR:", email);
}

// ======================================================
// 🔹 Cargar datos desde la API de validación
// ======================================================
if (!tx) {
  detailsDiv.innerHTML = "<p class='fail'>No transaction hash provided.</p>";
} else {
  const apiUrl = email
    ? `https://validate.udochain.com/api/validate/tx/${tx}?email=${encodeURIComponent(email)}`
    : `https://validate.udochain.com/api/validate/tx/${tx}`;

  console.log("🔗 Fetching validation data from:", apiUrl);

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (!data?.ok) {
        badgeDiv.innerHTML = `<div class="badge unverified">❌ Unverified</div>`;
        detailsDiv.innerHTML =
          "<p class='fail'>Validation not found or invalid transaction hash.</p>";
        return;
      }

      badgeDiv.innerHTML = `<div class="badge verified">✅ Verified on Blockchain</div>`;

      const dateFormatted = new Date(data.validatedAt).toLocaleString();

      // Render main info
      detailsDiv.innerHTML = `
        <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
        <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
        <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || email || "Unknown"}</span></div>
        <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
        <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
        <div class="field"><span class="label">Files:</span> 
          <span class="value">
            ${(data.files || [])
              .map((f) => `<div>• ${f.name} (${f.hash})</div>`)
              .join("") || "No files recorded"}
          </span>
        </div>
      `;

      // Guardar lista de hashes para comparación local
      window.validatedFiles = data.files?.map((f) => f.hash.toLowerCase()) || [];
    })
    .catch((err) => {
      console.error("❌ Fetch error:", err);
      badgeDiv.innerHTML = `<div class="badge unverified">❌ Unverified</div>`;
      detailsDiv.innerHTML = "<p class='fail'>Error loading validation details.</p>";
    });
}

// ======================================================
// 📂 File upload + SHA-256 verification
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
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) verifyFile(file);
});

// ======================================================
// 🔍 Verify uploaded file hash
// ======================================================
async function verifyFile(file) {
  if (!file) return;
  if (!window.validatedFiles?.length) {
    statusDiv.innerHTML = "<p class='fail'>Validation data not loaded yet.</p>";
    return;
  }

  statusDiv.textContent = "⏳ Analyzing file...";

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (window.validatedFiles.includes(fileHash.toLowerCase())) {
    statusDiv.innerHTML = `<p class="ok">✅ This file matches the blockchain validation record.</p>`;
  } else {
    statusDiv.innerHTML = `<p class="fail">❌ This file does not match any validated record.</p>`;
  }
}
