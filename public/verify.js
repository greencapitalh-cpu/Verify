import {
  BrowserQRCodeReader
} from "https://cdn.jsdelivr.net/npm/@zxing/browser@latest/+esm";

const scanBtn = document.getElementById("scanQR");
const uploadInput = document.getElementById("qrUpload");
const video = document.getElementById("qrVideo");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const statusDiv = document.getElementById("status");

let codeReader;

// Escaneo en tiempo real con cámara
scanBtn.addEventListener("click", async () => {
  try {
    statusDiv.textContent = "📷 Activating camera...";
    video.style.display = "block";

    codeReader = new BrowserQRCodeReader();
    const result = await codeReader.decodeOnceFromVideoDevice(undefined, "qrVideo");
    if (result?.text) handleDecodedQR(result.text);
  } catch (err) {
    alert("Unable to access camera: " + err.message);
  }
});

// Subir imagen QR desde galería
uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgUrl = URL.createObjectURL(file);
  const result = await BrowserQRCodeReader.decodeFromImageUrl(imgUrl);
  if (result?.text) handleDecodedQR(result.text);
  else statusDiv.textContent = "❌ No valid QR found.";
});

// Procesar resultado del QR
function handleDecodedQR(data) {
  statusDiv.textContent = "✅ QR detected. Redirecting...";
  if (data.includes("udochain.com")) {
    window.location.href = data;
  } else if (data.startsWith("0x")) {
    hashInput.value = data;
    statusDiv.textContent = "QR read successfully. Ready to verify.";
  } else {
    statusDiv.textContent = data;
  }
}

// Verificación manual
verifyBtn.addEventListener("click", () => {
  const tx = hashInput.value.trim();
  if (!tx) return alert("Enter or scan a valid transaction hash.");
  window.location.href = `https://verify.udochain.com/?tx=${tx}`;
});
