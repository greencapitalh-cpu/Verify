// =======================================================
// 🔍 UDoChain Verify Frontend — Full v2 Functional
// =======================================================

const statusDiv = document.getElementById("status");
const fileInput = document.getElementById("fileInput");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const myValidations = document.getElementById("myValidations");
const validationList = document.getElementById("validationList");

const startQrBtn = document.getElementById("startQrBtn");
const qrFileInput = document.getElementById("qrFileInput");
const qrVideo = document.getElementById("qrVideo");

const params = new URLSearchParams(window.location.search);
const txParam = params.get("tx");
const storageParam = params.get("storage");
const cacheId = params.get("cache");

// =======================================================
// 🧩 Utils
// =======================================================
async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// =======================================================
// 🔍 Verify manually by file or hash
// =======================================================
verifyBtn.onclick = async () => {
  statusDiv.innerHTML = "⏳ Verifying...";
  let hash = hashInput.value.trim();
  if (fileInput.files.length && !hash) {
    hash = await sha256File(fileInput.files[0]);
  }
  if (!hash) return (statusDiv.textContent = "⚠️ Please upload a file or enter a hash.");

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
        TX: <a href="https://polygonscan.com/tx/${data.txHash}" target="_blank">${data.txHash}</a><br>
        <a href="${data.pdfUrl}" target="_blank">📄 View Certificate</a><br>
        ${
          data.storageId
            ? `<button class="btn-secondary" onclick="viewPrivate('${data.storageId}')">🔐 View Private Data</button>`
            : ""
        }
      `;
    } else {
      statusDiv.innerHTML = `❌ Not found on blockchain.<br>${data.message || ""}`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "⚠️ Error verifying evidence.";
  }
};

// =======================================================
// 🔒 Private data view
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
        <a href="/api/verify/binary/${storageId}" class="btn-secondary">⬇️ Download ZIP</a>
      `;
    } else {
      statusDiv.innerHTML = "❌ No private data found.";
    }
  } catch (err) {
    statusDiv.textContent = "⚠️ Error fetching private data.";
  }
}

// =======================================================
// 🧾 My Validations (logged user)
// =======================================================
const token = localStorage.getItem("token");
if (token) {
  myValidations.style.display = "block";
  loadUserValidations(token);
}

async function loadUserValidations(token) {
  try {
    const res = await fetch(`/api/verify/all/${token}`);
    const data = await res.json();

    if (!data.ok || !data.validations?.length) {
      validationList.innerHTML = "<p>No validations found.</p>";
      return;
    }

    validationList.innerHTML = data.validations
      .map(
        (v) => `
        <div class="validation-card">
          <b>${v.evidenceTitle}</b><br>
          TX: <a href="https://polygonscan.com/tx/${v.txHash}" target="_blank">${v.txHash}</a><br>
          <a href="${v.pdfUrl}" target="_blank">📄 PDF</a><br>
          ${
            v.storageId
              ? `<button onclick="viewPrivate('${v.storageId}')">🔐 Private</button>`
              : ""
          }
        </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    validationList.innerHTML = "<p>Error loading validations.</p>";
  }
}

// =======================================================
// 📷 QR SCANNER
// =======================================================
startQrBtn.onclick = async () => {
  try {
    const html5QrCode = new Html5Qrcode("qrVideo");
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        html5QrCode.stop();
        handleQrResult(decodedText);
      }
    );
  } catch (err) {
    console.error("QR start error:", err);
    qrFileInput.click();
  }
};

qrFileInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (ev) => handleQrResult(ev.target.result);
  reader.readAsDataURL(file);
};

// =======================================================
// 🔗 Handle QR result (with cache if login missing)
// =======================================================
async function handleQrResult(decodedText) {
  console.log("QR scanned:", decodedText);
  const url = new URL(decodedText);
  const tx = url.searchParams.get("tx");
  const storage = url.searchParams.get("storage");

  if (!localStorage.getItem("token")) {
    // Guardar cache temporal del QR
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
// ♻️ Auto-restore cached QR
// =======================================================
if (cacheId) {
  fetch(`/api/verify/qr-cache/${cacheId}`)
    .then((res) => res.json())
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
