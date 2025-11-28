// ======================================================
// 🧠 UDoChain Verify — Main Verification Logic
// ======================================================
const params = new URLSearchParams(window.location.search);
const token = params.get("token") || localStorage.getItem("udo_token");
const email = params.get("email") || localStorage.getItem("user_email");

// Redirect if not logged in
if (!token || !email) {
  window.location.href = "https://app.udochain.com/login";
}

localStorage.setItem("udo_token", token);
localStorage.setItem("user_email", email);

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const verifyBtn = document.getElementById("verifyBtn");
const hashInput = document.getElementById("hashInput");
const scanQRBtn = document.getElementById("scanQR");
const result = document.getElementById("result");

// Drag & Drop
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", async (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) await handleFile(file);
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) await handleFile(file);
});

// Verify hash manually
verifyBtn.onclick = async () => {
  const hash = hashInput.value.trim();
  if (!hash) return alert("Please enter a hash.");
  await verifyHash(hash);
};

// Handle file upload
async function handleFile(file) {
  const buffer = await file.arrayBuffer();
  const hash = await sha256Hex(buffer);
  await verifyHash(hash);
}

// SHA-256
async function sha256Hex(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Verify hash with backend
async function verifyHash(hash) {
  result.innerHTML = "⏳ Checking...";
  try {
    const res = await fetch("/api/verify/hash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-udo-token": token,
        "x-udo-email": email,
      },
      body: JSON.stringify({ hash }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Verification failed.");

    let html = `
      <h3>${data.evidenceTitle || "Document"}</h3>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Version:</strong> ${data.version}</p>
      <p><strong>Validated:</strong> ${new Date(data.validatedAt).toLocaleString()}</p>
      <p><strong>TxHash:</strong> ${data.txHash}</p>
    `;

    if (data.qrActive === false) {
      html += `<p style="color:red;font-weight:600;">⚠️ This verification QR has been revoked by the owner.</p>`;
    }

    if (data.storageId) {
      html += `
        <a class="btn-validate" href="/verify-private?storage=${data.storageId}&token=${token}&email=${email}">View Private</a>
        <a class="btn-icon" href="/verify-public?tx=${data.txHash}">View Public</a>
      `;
    }

    result.innerHTML = html;
  } catch (err) {
    result.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
}

// Optional QR scan (simple input for now)
scanQRBtn.onclick = () => {
  const qr = prompt("Paste QR content (URL or hash):");
  if (qr?.includes("verify-public")) {
    window.location.href = qr;
  } else if (qr?.includes("verify-private")) {
    window.location.href = qr + `&token=${token}&email=${email}`;
  } else if (qr?.length > 20) {
    verifyHash(qr);
  } else {
    alert("Invalid QR data.");
  }
};
