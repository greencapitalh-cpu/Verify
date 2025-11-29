// ======================================================
// 🌍 UDoChain Verify Public v4.2
// 100% público — limpio, sin emojis, sin íconos
// ======================================================

const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

// Obtener el parámetro "tx" desde la URL
const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");

// ======================================================
// 🧠 Función principal — Cargar validación desde el validador
// ======================================================
async function loadValidation() {
  if (!tx) {
    detailsDiv.innerHTML = "<p class='fail'>No transaction hash provided in URL.</p>";
    return;
  }

  try {
    // Llamada directa al endpoint público
    const res = await fetch(`https://validate.udochain.com/api/validate/tx/${tx}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = `<p class="fail">Validation not found or invalid transaction hash.</p>`;
      return;
    }

    badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    // Renderizar la información de validación
    detailsDiv.innerHTML = `
      <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
      <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
      <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
      <div class="field"><span class="label">Files:</span> 
        <div class="value file-list">
          ${(data.files || [])
            .map(
              (f) =>
                `<div>${f.name} — <small>${f.hash}</small></div>`
            )
            .join("") || "No files recorded"}
        </div>
      </div>
    `;

    // Guardar hashes para verificación local
    window.validatedFiles = data.files?.map((f) => f.hash.toLowerCase()) || [];
  } catch (err) {
    console.error("❌ Fetch error:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = "<p class='fail'>Error loading validation details.</p>";
  }
}

// ======================================================
// 📂 Subida + verificación de archivos
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
// 🔍 Verificar hash del archivo subido
// ======================================================
async function verifyFile(file) {
  if (!file) return;
  if (!window.validatedFiles?.length) {
    statusDiv.innerHTML = "<p class='fail'>Validation data not loaded yet.</p>";
    return;
  }

  statusDiv.textContent = "Analyzing file...";

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (window.validatedFiles.includes(fileHash.toLowerCase())) {
    statusDiv.innerHTML = `<p class="ok">This file matches the blockchain validation record.</p>`;
  } else {
    statusDiv.innerHTML = `<p class="fail">This file does not match any validated record.</p>`;
  }
}

// Ejecutar al cargar
loadValidation();
