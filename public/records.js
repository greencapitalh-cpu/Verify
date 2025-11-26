const token = localStorage.getItem("token");
const container = document.getElementById("recordsList");

async function loadRecords() {
  try {
    const res = await fetch(`/api/verify/all/${token}`);
    const data = await res.json();

    if (!data.ok) {
      container.textContent = "No records found.";
      return;
    }

    container.innerHTML = data.validations
      .map(
        (v) => `
      <div class="record-card ${v.qrActive === false ? "inactive" : ""}">
        <p><strong>${v.evidenceTitle}</strong></p>
        <p>${new Date(v.createdAt).toLocaleDateString()}</p>
        <p>Type: ${v.type || "Unknown"}</p>
        <p>TxHash: ${v.txHash}</p>
        <div class="record-actions">
          <button class="btn-primary" onclick="window.location.href='${v.pdfUrl}'">📄 PDF</button>
          ${
            v.qrActive
              ? `<button class="btn-secondary" onclick="blockQR('${v.txHash}')">Block QR</button>`
              : `<button class="btn-primary" onclick="regenerateQR('${v.txHash}')">Regenerate QR</button>`
          }
        </div>
      </div>`
      )
      .join("");
  } catch {
    container.textContent = "⚠️ Error loading records.";
  }
}
loadRecords();

async function blockQR(txHash) {
  await fetch(`/api/verify/block-qr/${txHash}`, { method: "POST" });
  loadRecords();
}

async function regenerateQR(txHash) {
  await fetch(`/api/verify/regenerate-qr/${txHash}`, { method: "POST" });
  loadRecords();
}
