// =======================================================
// 🔍 UDoChain Verify Frontend — QR System Style v2
// =======================================================
const statusDiv = document.getElementById("status");
const fileInput = document.getElementById("fileInput");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const startQrBtn = document.getElementById("startQrBtn");

const params = new URLSearchParams(window.location.search);
const txParam = params.get("tx");
const storageParam = params.get("storage");
const cacheId = params.get("cache");

// =======================================================
// 🧩 File hash util
// =======================================================
async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// =======================================================
// 🔍 Manual verification
// =======================================================
verifyBtn.onclick = async () => {
  statusDiv.innerHTML = "⏳ Verifying...";
  let hash = hashInput.value.trim();

  if (fileInput.files.length && !hash) {
    hash = await sha256File(fileInput.files[0]);
  }

  if (!hash) return (statusDiv.textContent = "⚠️ Upload a file or enter a hash.");

  try {
    const res = await fetch("/api/verify/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    });
    const data = await res.json();

    if (data.ok) {
      statusDiv.innerHTML = `
        ✅ <strong>Evidence Verified!</strong><br>
        <b>${data.evidenceTitle}</b><br>
        TX: ${
          data.txHash
            ? `<a href="https://polygonscan.com/tx/${data.txHash}" target="_blank">${data.txHash}</a><br>`
            : ""
        }
        ${
          data.pdfUrl
            ? `<a href="${data.pdfUrl}" target="_blank">📄 View Certificate</a><br>`
            : ""
        }
        ${
          data.storageId
            ? `<button class="btn-primary" onclick="viewPrivate('${data.storageId}')">View Private Data</button>`
            : ""
        }
      `;
    } else {
      statusDiv.innerHTML = `❌ Not found.<br>${data.message || ""}`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "⚠️ Error verifying evidence.";
  }
};

// =======================================================
// 🔒 Private data
// =======================================================
async function viewPrivate(storageId) {
  statusDiv.innerHTML = "🔐 Loading private metadata...";
  try {
    const res = await fetch(`/api/verify/private/${storageId}`);
    const data = await res.json();

    if (data.ok) {
      const meta = data.data.meta || data.data;
      statusDiv.innerHTML = `
        🔒 <strong>Private Record Found</strong><br>
        Title: ${meta.evidenceTitle || "N/A"}<br>
        GPS: ${meta.gps || "N/A"}<br>
        BioID: ${meta.bioidHash || "N/A"}<br>
        <a href="https://arweave.net/${storageId.replace("ar://", "")}" target="_blank">🌐 View on Arweave</a><br>
        <a href="/api/verify/binary/${storageId}" class="btn-primary">⬇️ Download ZIP</a>
      `;
    } else {
      statusDiv.innerHTML = "❌ No private data found.";
    }
  } catch (err) {
    statusDiv.textContent = "⚠️ Error fetching private data.";
  }
}

// =======================================================
// 📷 QR SYSTEM SCAN (Camera or Gallery)
// =======================================================
startQrBtn.onclick = async () => {
  const choice = confirm("Use camera to scan?\nPress Cancel to import from gallery.");
  if (choice) startCameraQR();
  else importFromGallery();
};

async function startCameraQR() {
  const overlay = document.createElement("div");
  overlay.className = "qr-overlay";
  overlay.innerHTML = `<div class="qr-frame"></div><p>Scanning QR...</p>`;
  document.body.appendChild(overlay);

  const video = document.createElement("video");
  overlay.querySelector(".qr-frame").appendChild(video);

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
          handleQrResult(code.data);
          return;
        }
      }
      requestAnimationFrame(scan);
    };
    scan();
  } catch (err) {
    console.error("Camera error:", err);
    alert("Camera access failed.");
    document.body.removeChild(overlay);
  }
}

function stopCamera(stream, overlay) {
  stream.getTracks().forEach((t) => t.stop());
  document.body.removeChild(overlay);
}

function importFromGallery() {
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
        if (code) handleQrResult(code.data);
        else alert("No QR code found.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// =======================================================
// 🔗 Handle QR result
// =======================================================
async function handleQrResult(decodedText) {
  console.log("QR scanned:", decodedText);
  const url = new URL(decodedText);
  const tx = url.searchParams.get("tx");
  const storage = url.searchParams.get("storage");

  if (!localStorage.getItem("token")) {
    const res = await fetch("/api/verify/qr-cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrData: decodedText }),
    });
    const data = await res.json();
    if (data.ok) {
      window.location.href = `https://app.udochain.com/login?redirect=https://verify.udochain.com?cache=${data.cacheId}`;
      return;
    }
  } else {
    if (storage) viewPrivate(storage);
    else if (tx) {
      hashInput.value = tx;
      verifyBtn.click();
    }
  }
}

// =======================================================
// ♻️ Restore cached QR
// =======================================================
if (cacheId) {
  fetch(`/api/verify/qr-cache/${cacheId}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.ok) handleQrResult(data.data.qrData);
      else statusDiv.textContent = "QR cache expired.";
    });
}

// =======================================================
// 🔗 Auto verification from URL
// =======================================================
if (storageParam) viewPrivate(storageParam);
if (txParam && !storageParam) {
  hashInput.value = txParam;
  verifyBtn.click();
}
