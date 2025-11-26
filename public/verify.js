// ======================================================
// 📷 verify.js — QR Scan / Entry v4.5
// ======================================================
import { BrowserQRCodeReader } from "https://cdn.jsdelivr.net/npm/@zxing/browser@latest/+esm";

const scanBtn = document.getElementById("scanQR");
const uploadInput = document.getElementById("qrUpload");
const video = document.getElementById("qrVideo");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const statusDiv = document.getElementById("status");

let codeReader;

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

uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const imgUrl = URL.createObjectURL(file);
  const result = await BrowserQRCodeReader.decodeFromImageUrl(imgUrl);
  if (result?.text) handleDecodedQR(result.text);
  else statusDiv.textContent = "❌ No valid QR found.";
});

function handleDecodedQR(data) {
  statusDiv.textContent = "✅ QR detected...";
  // 🔹 Solo un escaneo: si ya apunta a verify.udochain.com, entra directo
  if (data.includes("verify.udochain.com")) {
    window.location.href = data;
    return;
  }
  // 🔹 Si apunta a otra app UDoChain (validate, etc.) redirige
  if (data.includes("udochain.com")) {
    window.location.href = data;
    return;
  }
  // 🔹 Si contiene hash directo
  if (data.startsWith("0x")) {
    hashInput.value = data;
    statusDiv.textContent = "QR read successfully. Ready to verify.";
  } else {
    statusDiv.textContent = data;
  }
}

verifyBtn.addEventListener("click", () => {
  const tx = hashInput.value.trim();
  if (!tx) return alert("Enter or scan a valid transaction hash.");
  window.location.href = `https://verify.udochain.com/verify-public.html?tx=${tx}`;
});
