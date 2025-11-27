// ======================================================
// 📋 UDoChain Verify — Records.js v4.6
// ======================================================
const API_URL = "https://verify.udochain.com/api/verify";
const userToken = localStorage.getItem("udo_token");

// 🔒 Bloqueo de acceso no logueado
if (!userToken) {
  window.location.href = "https://app.udochain.com/login";
}

const listContainer = document.getElementById("recordsList");
const filterType = document.getElementById("filterType");
const filterStatus = document.getElementById("filterStatus");

let records = [];

// ======================================================
// 🚀 Cargar registros del usuario
// ======================================================
async function loadRecords() {
  try {
    const res = await fetch(`${API_URL}/all/${userToken}`);
    const data = await res.json();

    if (!data.ok || !data.validations) {
      listContainer.innerHTML = `<p>${data.message || "No records found."}</p>`;
      return;
    }

    records = data.validations;
    render(records);
  } catch (err) {
    console.error("❌ Error loading records:", err);
    listContainer.innerHTML = `<p>Error loading records.</p>`;
  }
}

// ======================================================
// 🎨 Renderizar lista
// ======================================================
function render(list) {
  listContainer.innerHTML = "";
  if (!list.length) {
    listContainer.innerHTML = "<p>No records found.</p>";
    return;
  }

  list.forEach((r) => {
    const div = document.createElement("div");
    div.className = "record-card";

    div.innerHTML = `
      <div class="record-header">
        <span class="record-title">${r.evidenceTitle || "Untitled"}</span>
        <span class="record-type">${r.type || "Validate"}</span>
      </div>
      <div class="status ${r.status || "active"}">
        Status: ${r.status || "Active"}
      </div>
      <div>Date: ${new Date(r.createdAt).toLocaleDateString()}</div>
      <div>QR: ${r.qrActive ? "✅ Active" : "🚫 Blocked"}</div>
      <a href="${r.pdfUrl}" target="_blank" class="btn">View PDF</a>
      <div class="record-actions">
        ${
          r.qrActive
            ? `<button onclick="blockQR('${r.txHash}')">Block QR</button>`
            : `<button onclick="regenerateQR('${r.txHash}')">New QR</button>`
        }
      </div>
    `;
    listContainer.appendChild(div);
  });
}

// ======================================================
// 🎛️ Filtros
// ======================================================
function applyFilters() {
  const type = filterType.value;
  const status = filterStatus.value;

  const filtered = records.filter((r) => {
    const matchType = type === "all" || r.type === type;
    const matchStatus = status === "all" || r.status === status;
    return matchType && matchStatus;
  });

  render(filtered);
}

filterType.addEventListener("change", applyFilters);
filterStatus.addEventListener("change", applyFilters);

// ======================================================
// 🔒 Acciones de QR
// ======================================================
async function blockQR(txHash) {
  if (!confirm("Block this QR?")) return;
  const res = await fetch(`${API_URL}/block-qr/${txHash}`, { method: "POST" });
  const data = await res.json();
  alert(data.message || "QR blocked.");
  loadRecords();
}

async function regenerateQR(txHash) {
  if (!confirm("Generate new QR for this evidence?")) return;
  const res = await fetch(`${API_URL}/regenerate-qr/${txHash}`, {
    method: "POST",
  });
  const data = await res.json();
  alert(data.message || "New QR generated.");
  loadRecords();
}

// ======================================================
// 🏁 Inicializar
// ======================================================
loadRecords();
