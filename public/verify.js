const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");
const storage = params.get("storage");
const token = params.get("token") || localStorage.getItem("token");
const email = params.get("email") || localStorage.getItem("userEmail");
const statusDiv = document.getElementById("status");
const fileInput = document.getElementById("fileInput");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const qrReader = document.getElementById("qr-reader");
const btnCam = document.getElementById("btnScanCamera");
const btnFile = document.getElementById("btnScanFile");
let html5QrCode = null;

// Guardar QR temporal si no logueado
if (!token && (tx || storage)) {
  localStorage.setItem("pendingQR", window.location.href);
  window.location.href = "https://app.udochain.com/login?redirect=https://verify.udochain.com";
}
const pendingQR = localStorage.getItem("pendingQR");
if (token && pendingQR) {
  localStorage.removeItem("pendingQR");
  window.location.href = pendingQR;
}

// --- QR SCANNER ---
function handleScanResult(decodedText) {
  html5QrCode?.stop().catch(() => {});
  qrReader.style.display = "none";
  window.location.href = decodedText.includes("verify.udochain.com")
    ? decodedText
    : `?tx=${decodedText}`;
}

btnCam.onclick = () => {
  qrReader.style.display = "block";
  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, handleScanResult)
    .catch(() => (statusDiv.textContent = "⚠️ Camera unavailable."));
};

btnFile.onclick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.scanFile(file, true)
      .then(handleScanResult)
      .catch(() => alert("⚠️ Invalid QR image."));
  };
  input.click();
};

// --- Manual Verify ---
async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

verifyBtn.onclick = async () => {
  statusDiv.textContent = "⏳ Verifying...";
  let hash = hashInput.value.trim();
  if (fileInput.files.length && !hash) hash = await sha256File(fileInput.files[0]);
  if (!hash) return (statusDiv.textContent = "⚠️ Upload a file or enter a hash.");

  try {
    const res = await fetch("/api/verify/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    });
    const data = await res.json();
    if (!data.ok) return (statusDiv.innerHTML = `❌ ${data.message}`);
    statusDiv.innerHTML = `
      ✅ <strong>${data.evidenceTitle}</strong><br>
      TX: <a href="https://polygonscan.com/tx/${data.txHash}" target="_blank">${data.txHash}</a><br>
      <a href="${data.pdfUrl}" target="_blank">📘 View Public Certificate</a><br>
      ${data.storageId ? `<button onclick="verifyPrivate('${data.storageId}')">🔐 View Private Data</button>` : ""}
    `;
  } catch {
    statusDiv.textContent = "⚠️ Verification failed.";
  }
};

// --- Private Verify ---
async function verifyPrivate(storageId) {
  statusDiv.textContent = "🔐 Fetching private data...";
  const res = await fetch(`/api/verify/private/${encodeURIComponent(storageId)}`);
  const data = await res.json();
  if (!data.ok) return (statusDiv.textContent = `❌ ${data.message}`);
  const m = data.data.meta;
  const dl = data.data.downloadUrl;
  statusDiv.innerHTML = `
    🔒 <strong>Private Evidence</strong><br>
    Evidence: ${m.evidenceTitle || "N/A"}<br>
    GPS: ${m.gps || "N/A"}<br>
    BioID: ${m.bioidHash || "N/A"}<br>
    Date: ${m.validatedAt ? new Date(m.validatedAt).toLocaleString() : "N/A"}<br>
    ${dl ? `<a href="${dl}" target="_blank" class="btn">⬇️ Download Evidence ZIP</a>` : ""}
  `;
}
