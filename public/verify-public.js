const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");
const dataBox = document.getElementById("publicData");
const checkResult = document.getElementById("checkResult");

// ======================================================
// 🔍 Cargar información pública desde el backend
// ======================================================
async function loadPublic() {
  if (!tx) {
    dataBox.textContent = "⚠️ No transaction hash provided.";
    return;
  }

  try {
    const res = await fetch("/api/verify/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: tx }),
    });
    const data = await res.json();

    if (!data.ok) {
      dataBox.innerHTML = `<p>❌ Evidence not found or verification blocked.</p>`;
      return;
    }

    dataBox.innerHTML = `
      <p><strong>Evidence:</strong> ${data.evidenceTitle || "Untitled"}</p>
      <p><strong>Date:</strong> ${new Date(
        data.validatedAt
      ).toLocaleString()}</p>
      <p><strong>Transaction Hash:</strong> ${data.txHash}</p>
      <p><strong>Source:</strong> ${data.source || "MongoDB"}</p>
      <p><strong>Network:</strong> Polygon</p>
    `;
  } catch (err) {
    dataBox.textContent = "⚠️ Error loading verification data.";
  }
}

// ======================================================
// 🧮 Comparar hash local del archivo subido
// ======================================================
document.getElementById("checkFileBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("📄 Please upload a file first.");

  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (hashHex === tx.replace(/^0x/, "")) {
      checkResult.textContent = "✅ Hash matches the blockchain record.";
      checkResult.className = "check-result success";
    } else {
      checkResult.textContent = "❌ File does not match the registered hash.";
      checkResult.className = "check-result fail";
    }
  } catch (err) {
    checkResult.textContent = "⚠️ Error verifying file.";
    checkResult.className = "check-result fail";
  }
});

// Init
loadPublic();
