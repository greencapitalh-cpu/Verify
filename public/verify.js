const scanBtn = document.getElementById("scanBtn");
const statusDiv = document.getElementById("status");
scanBtn.addEventListener("click", openQRMenu);

function openQRMenu() {
  const menu = document.createElement("div");
  menu.className = "qr-menu";
  menu.innerHTML = `
    <button class="camera">📷 Scan with camera</button>
    <button class="gallery">🖼 Import from gallery</button>
    <button onclick="this.parentElement.remove()">Cancel</button>
  `;
  document.body.appendChild(menu);

  menu.querySelector(".camera").onclick = () => {
    menu.remove();
    startCameraScan();
  };
  menu.querySelector(".gallery").onclick = () => {
    menu.remove();
    pickFromGallery();
  };
}

async function startCameraScan() {
  const overlay = document.createElement("div");
  overlay.className = "qr-overlay";
  overlay.innerHTML = `
    <div class="qr-box">
      <video id="video" playsinline></video>
      <button id="flashToggle" class="flash-toggle">💡</button>
    </div>
    <p style="color:white;margin-top:1rem;">Scanning QR...</p>
  `;
  document.body.appendChild(overlay);

  const video = overlay.querySelector("#video");
  const flashToggle = overlay.querySelector("#flashToggle");

  let track, imageCapture;
  let flashOn = false;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    await video.play();

    track = stream.getVideoTracks()[0];
    if ("ImageCapture" in window) {
      imageCapture = new ImageCapture(track);
    }

    flashToggle.addEventListener("click", async () => {
      try {
        flashOn = !flashOn;
        await track.applyConstraints({
          advanced: [{ torch: flashOn }],
        });
        flashToggle.textContent = flashOn ? "🔦" : "💡";
      } catch {
        alert("Flash not supported on this device.");
      }
    });

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

function pickFromGallery() {
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
        else alert("No QR detected.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function handleQR(decodedText) {
  console.log("QR scanned:", decodedText);
  statusDiv.textContent = "✅ QR detected: " + decodedText;

  const url = new URL(decodedText);
  const tx = url.searchParams.get("tx");
  const storage = url.searchParams.get("storage");

  if (storage) {
    statusDiv.innerHTML = "🔐 Redirecting to private verification...";
    window.location.href = `/api/verify/private/${storage}`;
  } else if (tx) {
    document.getElementById("hashInput").value = tx;
    document.getElementById("verifyBtn").click();
  } else {
    alert("Invalid QR content.");
  }
}
