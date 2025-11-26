const scanBtn = document.getElementById("scanBtn");
const statusDiv = document.getElementById("status");
scanBtn.addEventListener("click", openQRMenu);

function openQRMenu() {
  const menu = document.createElement("div");
  menu.className = "qr-menu";
  menu.innerHTML = `
    <button class="confirm" id="cameraScan">Scan with camera</button>
    <button id="uploadScan">Upload image with QR</button>
    <button id="cancelScan">Cancel</button>
  `;
  document.body.appendChild(menu);

  document.getElementById("cameraScan").onclick = () => {
    menu.remove();
    startCameraScan();
  };
  document.getElementById("uploadScan").onclick = () => {
    menu.remove();
    uploadImageForQR();
  };
  document.getElementById("cancelScan").onclick = () => menu.remove();
}

async function startCameraScan() {
  const overlay = document.createElement("div");
  overlay.className = "qr-overlay";
  overlay.innerHTML = `
    <div class="qr-box">
      <video id="video" playsinline></video>
      <div class="scan-line"></div>
    </div>
    <p style="color:white;margin-top:1rem;">Scanning QR...</p>
  `;
  document.body.appendChild(overlay);

  const video = overlay.querySelector("#video");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const jsQR = await import("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs");

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR.default(imageData.data, canvas.width, canvas.height);
        if (code) {
          stopCamera(stream, overlay);
          handleQR(code.data);
          return;
        }
      }
      requestAnimationFrame(scan);
    };
    scan();
  } catch (err) {
    alert("Camera access denied or unavailable.");
    overlay.remove();
  }
}

function stopCamera(stream, overlay) {
  stream.getTracks().forEach((t) => t.stop());
  overlay.remove();
}

function uploadImageForQR() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const jsQR = await import("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR.default(imageData.data, canvas.width, canvas.height);
        if (code) handleQR(code.data);
        else alert("No QR detected in the image.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function handleQR(decodedText) {
  console.log("QR scanned:", decodedText);
  statusDiv.textContent = "QR detected: " + decodedText;

  try {
    const url = new URL(decodedText);
    const tx = url.searchParams.get("tx");
    const storage = url.searchParams.get("storage");

    if (storage) {
      statusDiv.innerHTML = "Redirecting to private verification...";
      window.location.href = `/api/verify/private/${storage}`;
    } else if (tx) {
      document.getElementById("hashInput").value = tx;
      document.getElementById("verifyBtn").click();
    } else {
      alert("Invalid QR content.");
    }
  } catch {
    alert("Invalid QR format.");
  }
}
