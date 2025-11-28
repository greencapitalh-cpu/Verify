// ======================================================
// 🧩 UDoChain Verify v3.5 — Functional QR + Hash Scanner
// ======================================================

// --- Referencias del DOM ---
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const result = document.getElementById("result");

// ======================================================
// ✅ Validar formato de hash
// ======================================================
function isValidHash(str) {
  return /^[a-f0-9]{64}$/i.test(str.trim());
}

// ======================================================
// 🔍 Verificar hash manualmente
// ======================================================
verifyBtn.addEventListener("click", () => {
  const hash = hashInput.value.trim();
  if (!hash) return showMessage("Please enter a document hash.", "error");
  if (!isValidHash(hash)) return showMessage("Invalid hash format.", "error");

  showMessage("Checking document...", "info");

  // Redirige a verify-public.html con el hash
  setTimeout(() => {
    window.location.href = `verify-public.html?tx=${hash}`;
  }, 800);
});

// ======================================================
// 🖼️ Escanear QR desde galería
// ======================================================
scanGallery.addEventListener("click", async () => {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showMessage("Processing image...", "info");

      if (!("BarcodeDetector" in window)) {
        return showMessage("Your browser does not support QR scanning.", "error");
      }

      const bitmap = await createImageBitmap(file);
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const codes = await detector.detect(bitmap);

      if (codes.length > 0) {
        handleQRValue(codes[0].rawValue.trim());
      } else {
        showMessage("No QR code found in the image.", "error");
      }
    };
    input.click();
  } catch (err) {
    console.error(err);
    showMessage("Error opening gallery.", "error");
  }
});

// ======================================================
// 📸 Escanear QR en vivo con cámara
// ======================================================
scanCamera.addEventListener("click", async () => {
  try {
    if (!("BarcodeDetector" in window)) {
      return showMessage("Live QR scanning is not supported.", "error");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    // Overlay de escaneo
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
    overlay.appendChild(video);
    document.body.appendChild(overlay);

    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const interval = setInterval(async () => {
      const codes = await detector.detect(video);
      if (codes.length > 0) {
        clearInterval(interval);
        stream.getTracks().forEach((t) => t.stop());
        overlay.remove();
        handleQRValue(codes[0].rawValue.trim());
      }
    }, 400);
  } catch (err) {
    console.error(err);
    showMessage("Unable to access camera.", "error");
  }
});

// ======================================================
// 🔄 Procesar valor leído del QR
// ======================================================
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
// 🧾 Mostrar mensajes en pantalla
// ======================================================
function showMessage(text, type = "info") {
  result.textContent = text;
  result.style.color =
    type === "error" ? "#b91c1c" : type === "info" ? "#475569" : "#184b8c";
}
