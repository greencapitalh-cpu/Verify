// ======================================================
// 🧾 UDoChain Verify — Record Detail Manager v5.0
// ======================================================
const API_URL = "https://verify.udochain.com/api/verify";
const token = localStorage.getItem("udo_token");
if (!token) {
  window.location.href = "https://app.udochain.com/login";
}

const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");
const container = document.getElementById("recordContainer");

const btnPublic = document.getElementById("btnPublic");
const btnPrivate = document.getElementById("btnPrivate");
const btnBlock = document.getElementById("btnBlock");
const btnRegenerate = document.getElementById("btnRegenerate");

let currentRecord = null;

// ======================================================
// 🔍 Load Evidence Detail
// ======================================================
async function loadRecord() {
  try {
    const res = await fetch(`${API_URL}/all/${token}`);
    const data = await res.json();
    if (!data.ok || !data.validations) {
      container.innerHTML = "<p>❌ Record not found.</p>";
      return;
    }
    const found = data.validations.find((r) => r.txHash === tx);
    if (!found) {
      container.innerHTML = "<p>⚠️ Evidence not found.</p>";
      return;
    }
    currentRecord = found;
    renderRecord(found);
  } catch (err) {
    console.error("❌ Error loading record:", err);
    container.innerHTML = "<p>Error loading evidence.</p>";
  }
}

// ======================================================
// 🎨 Render Evidence Info
// ======================================================
function renderRecord(r) {
  container.innerHTML = `
    <h2>${r.evidenceTitle || "Untitled Evidence"}</h2>
    <p><strong>Type:</strong> ${r.type}</p>
    <p><strong>Date:</strong> ${new Date(r.createdAt).toLocaleString()}</p>
    <p><strong>Status:</strong> <span class="status ${r.status}">${r.status}</span></p>
    <p><strong>QR:</strong> ${r.qrActive ? "✅ Active" : "🚫 Disabled"}</p>
    <p><strong>Transaction:</strong> ${r.txHash}</p>
    <div class="links">
      ${
        r.pdfUrl
          ? `<a href="${r.pdfUrl}" target="_blank" class="btn-link">Open PDF</a>`
          : ""
      }
      ${
        r.storageId
          ? `<a href="https://verify.udochain.com/verify-private.html?storage=${r.storageId}&token=${token}" class="btn-link">Open Private View</a>`
          : ""
      }
    </div>
  `;

  // Update buttons visibility
  btnPublic.style.display = r.privateAccess ? "inline-block" : "none";
  btnPrivate.style.display = !r.privateAccess ? "inline-block" : "none";
}

// ======================================================
// 🔒 Actions
// ======================================================
btnPublic.addEventListener("click", async () => {
  alert("✅ Evidence marked as Public (simulation).");
});
btnPrivate.addEventListener("click", async () => {
  alert("🔒 Evidence marked as Private (simulation).");
});
btnBlock.addEventListener("click", async () => {
  if (!confirm("Deactivate this QR?")) return;
  const res = await fetch(`${API_URL}/block-qr/${tx}`, { method: "POST" });
  const data = await res.json();
  alert(data.message || "QR deactivated.");
  loadRecord();
});
btnRegenerate.addEventListener("click", async () => {
  if (!confirm("Generate new PDF/QR for this record?")) return;
  const res = await fetch(`${API_URL}/regenerate-qr/${tx}`, { method: "POST" });
  const data = await res.json();
  alert(data.message || "New PDF generated.");
  loadRecord();
});

// ======================================================
// 🏁 Init
// ======================================================
loadRecord();
