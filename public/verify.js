import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.esm.js";

const scanBtn = document.getElementById("scanQR");
const uploadInput = document.getElementById("qrUpload");
const video = document.getElementById("qrVideo");
const canvas = document.getElementById("qrCanvas");
const ctx = canvas.getContext("2d");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const statusDiv = document.getElementById("status");

// ===============
// 🎥 ESCANEO EN TIEMPO REAL
// ===============
scanBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    video.style.display = "block";
    video.play();
    statusDiv.innerHTML = "📷 Scanning... point camera at a QR code";

    const scanLoop = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          stream.getTracks().forEach((t) => t.stop());
          video.style.display = "none";
          handleDecodedQR(code.data);
          return;
        }
      }
      requestAnimationFrame(scanLoop);
    };
    scanLoop();
  } catch (err) {
    alert("Camera not accessible: " + err.message);
  }
});

// ===============
// 🖼️ SUBIR IMAGEN DESDE GALERÍA
// ===============
uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) handleDecodedQR(code.data);
    else statusDiv.textContent = "❌ No valid QR found in image.";
  };
});

// ===============
// 🔎 PROCESAR EL QR DETECTADO
// ===============
function handleDecodedQR(data) {
  statusDiv.innerHTML = "✅ QR detected, processing...";
  if (data.includes("udochain.com")) {
    window.location.href = data;
  } else if (data.startsWith("0x")) {
    hashInput.value = data;
    statusDiv.textContent = "QR read successfully. Ready to verify.";
  } else {
    statusDiv.textContent = "QR data: " + data;
  }
}

// ===============
// 🔍 VERIFICACIÓN MANUAL
// ===============
verifyBtn.addEventListener("click", () => {
  const tx = hashInput.value.trim();
  if (!tx) return alert("Please enter or scan a transaction hash.");
  window.location.href = `https://verify.udochain.com/?tx=${tx}`;
});
