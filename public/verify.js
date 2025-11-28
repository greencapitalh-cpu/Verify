// ========== UDoChain Verify Functional Script + Animated Overlay ==========

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

function handleResult(text) {
  if (!text) return;
  resultDiv.textContent = "Detected: " + text;

  if (text.startsWith("http")) {
    setTimeout(() => (window.location.href = text), 1000);
  } else {
    setTimeout(() => {
      window.location.href = `/verify-public?tx=${encodeURIComponent(text)}`;
    }, 1000);
  }
}

// 1️⃣ Manual hash entry
verifyBtn.addEventListener("click", () => {
  const hash = hashInput.value.trim();
  if (!hash) return (resultDiv.textContent = "Please enter a hash.");
  handleResult(hash);
});

// 2️⃣ Camera scan with animated overlay
scanCamera.addEventListener("click", async () => {
  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;
  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// 3️⃣ Upload image with QR
scanGallery.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };
  fileInput.click();
});
