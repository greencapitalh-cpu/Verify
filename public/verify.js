// ======== UDoChain Verify QR Script ========

const resultDiv = document.getElementById("result");
const verifyBtn = document.getElementById("verifyBtn");
const hashInput = document.getElementById("hashInput");

function handleResult(text) {
  if (!text) return;
  resultDiv.textContent = "QR Detected: " + text;

  // If QR contains full URL → open directly
  if (text.startsWith("http")) {
    setTimeout(() => (window.location.href = text), 1200);
  } else {
    // Otherwise assume it's a hash
    setTimeout(() => {
      window.location.href = `/verify-public?tx=${encodeURIComponent(text)}`;
    }, 1200);
  }
}

// ✅ Initialize QR Reader
function startQR() {
  const html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      handleResult,
      (err) => console.warn("QR scan error:", err)
    )
    .catch((err) => {
      console.error("Camera init error:", err);
      resultDiv.textContent = "Camera access denied or unavailable.";
    });
}

startQR();

verifyBtn.addEventListener("click", () => {
  const hash = hashInput.value.trim();
  if (!hash) return (resultDiv.textContent = "Please enter a hash.");
  handleResult(hash);
});
