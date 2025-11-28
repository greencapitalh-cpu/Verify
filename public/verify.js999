// ======================================================
// 🧩 UDoChain Verify.js v5.1
// Secure Verify Client — Token Linked + Aereware + Mongo
// ======================================================
const API_URL = "https://verify.udochain.com/api/verify";
const userToken = localStorage.getItem("udo_token");

if (!userToken) {
  window.location.href = "https://app.udochain.com/login";
}

const fileInput = document.getElementById("fileInput");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const resultBox = document.getElementById("result");

// ======================================================
// 🔐 Obtener hash SHA-256 del archivo
// ======================================================
async function computeHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ======================================================
// 🔍 Enviar verificación
// ======================================================
async function verifyEvidence(hash) {
  try {
    resultBox.textContent = "⏳ Verifying...";

    const res = await fetch(`${API_URL}/hash`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-udo-token": userToken,
      },
      body: JSON.stringify({ hash, userEmail: "", sessionId: "" }),
    });

    const data = await res.json();

    if (!data.ok) {
      resultBox.innerHTML = `<p>❌ ${data.message || "Not found"}</p>`;
      return;
    }

    resultBox.innerHTML = `
      <h3>✅ Validated Evidence</h3>
      <p><strong>Title:</strong> ${data.evidenceTitle}</p>
      <p><strong>Tx Hash:</strong> ${data.txHash}</p>
      <p><strong>Status:</strong> ${data.status || "Active"}</p>
      <p><strong>Version:</strong> ${data.version || 1}</p>
      <a href="${data.pdfUrl}" target="_blank" class="btn">Open Certificate PDF</a>
    `;
  } catch (err) {
    console.error("❌ Verify error:", err);
    resultBox.innerHTML = `<p>Error verifying evidence.</p>`;
  }
}

// ======================================================
// ⚙️ Manejo de evento principal
// ======================================================
verifyBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const hashValue = hashInput.value.trim();

  if (file) {
    const hash = await computeHash(file);
    verifyEvidence(hash);
  } else if (hashValue) {
    verifyEvidence(hashValue);
  } else {
    alert("Please upload a file or enter a hash.");
  }
});
