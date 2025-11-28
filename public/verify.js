// UDoChain Verify — Search or Scan
const params = new URLSearchParams(window.location.search);
const token = params.get("token") || localStorage.getItem("udo_token");
const email = params.get("email") || localStorage.getItem("user_email");

if (!token || !email) {
  window.location.href = "https://app.udochain.com/login";
}

localStorage.setItem("udo_token", token);
localStorage.setItem("user_email", email);

const hashInput = document.getElementById("hashInput");
const searchBtn = document.getElementById("searchBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const result = document.getElementById("result");

// Buscar hash manualmente
searchBtn.onclick = () => {
  const hash = hashInput.value.trim();
  if (!hash) return alert("Please enter a hash.");
  window.location.href = `/verify-public?tx=${hash}`;
};

// Escanear desde galería (lector QR por imagen)
scanGallery.onclick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const { default: QrScanner } = await import("https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js");
      const qrResult = await QrScanner.scanImage(event.target.result);
      handleQR(qrResult);
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

// Escanear con cámara en vivo
scanCamera.onclick = async () => {
  const { default: QrScanner } = await import("https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js");
  const videoElem = document.createElement("video");
  videoElem.style.width = "100%";
  result.innerHTML = "";
  result.appendChild(videoElem);

  const scanner = new QrScanner(videoElem, (qr) => {
    scanner.stop();
    handleQR(qr);
  });
  await scanner.start();
};

// Interpretar QR (público o privado)
function handleQR(qr) {
  if (!qr) return alert("No QR detected.");
  if (qr.includes("verify-public")) {
    window.location.href = qr;
  } else if (qr.includes("verify-private")) {
    const url = new URL(qr);
    url.searchParams.set("token", token);
    url.searchParams.set("email", email);
    window.location.href = url.toString();
  } else if (qr.startsWith("0x") || qr.length > 30) {
    window.location.href = `/verify-public?tx=${qr}`;
  } else {
    alert("Unrecognized QR data.");
  }
}
