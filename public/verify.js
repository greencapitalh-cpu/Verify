// ======================================================
// ✅ UDoChain Verify — Cross-Browser QR + Hash Scanner v6.0
// Works on Chrome, Safari, Firefox, Edge (Desktop + Mobile)
// ======================================================

// Importa jsQR desde CDN
import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";

// --- Elementos del DOM ---
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const result = document.getElementById("result");

// ======================================================
// 🧠 Helpers
// ======================================================
function isValidHash(str) {
  return /^[a-f0-9]{64}$/i.test(str.trim());
}

function showMessage(text, type = "info") {
  result.textContent = text;
  result.style.color =
    type === "error" ? "#b91c1c" : type === "info" ? "#475569" : "#184b8c";
}

function handleQRValue(value) {
  if (!value) return;
  showMessage("Redirecting...", "info");

  if (value.startsWith("http")) {
    window.location.href = value;
  } else if (isValidHash(value)) {
    window.location.href = `verify-public.html?tx=${value}`;
  } else {
    showMessage("Unrecognized QR content.", "error");
  }
}

// ======================================================
// 🔍 Manual Hash Input
// ======================================================
verifyBtn.addEventListener("click", () => {
  const hash = hashInput.value.trim();
  if (!hash) return showMessage("Please enter a document hash.", "error");
  if (!isValidHash(hash)) return showMessage("Invalid hash format.", "error");

  showMessage("Checking document...", "info");
  setTimeout(() => {
    window.location.href = `verify-public.html?tx=${hash}`;
  }, 600);
});

// ======================================================
// 🖼️ Escanear QR desde imagen
// ======================================================
scanGallery.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showMessage("Processing image...", "info");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, img.width, img.height);
      if (code) {
        handleQRValue(code.data.trim());
      } else {
        showMessage("No QR code detected.", "error");
      }
    };
  };
  input.click();
});

// ======================================================
// 📸 Escanear QR con cámara (universal)
// ======================================================
scanCamera.addEventListener("click", async () => {
  try {
    // Solicita permisos de cámara (modo trasero en móviles)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    // Overlay de cámara
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 32px;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
    `;
    closeBtn.onclick = () => {
      stream.getTracks().forEach((t) => t.stop());
      overlay.remove();
    };

    overlay.appendChild(video);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const loop = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          clearInterval(loop);
          stream.getTracks().forEach((t) => t.stop());
          overlay.remove();
          handleQRValue(code.data.trim());
        }
      }
    }, 300);
  } catch (err) {
    console.error("Camera error:", err);
    showMessage("Unable to access camera.", "error");
  }
});
