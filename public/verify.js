const statusDiv = document.getElementById("status");
const fileInput = document.getElementById("fileInput");
const hashInput = document.getElementById("hashInput");

async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

document.getElementById("verifyBtn").onclick = async () => {
  statusDiv.innerHTML = "⏳ Verifying...";
  let hash = hashInput.value.trim();
  if (fileInput.files.length && !hash)
    hash = await sha256File(fileInput.files[0]);

  if (!hash) return (statusDiv.textContent = "⚠️ Provide a file or hash.");

  const res = await fetch("/api/verify/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hash }),
  });
  const data = await res.json();

  if (data.ok) {
    statusDiv.innerHTML = `
      ✅ <b>Verified!</b><br>
      ${data.evidenceTitle}<br>
      TX: <a href="https://polygonscan.com/tx/${data.txHash}" target="_blank">${data.txHash}</a><br>
      ${data.storageId ? `<button onclick="loadPrivate('${data.storageId}')">🔐 Private Data</button>` : ""}
    `;
  } else {
    statusDiv.innerHTML = `❌ Not found.<br>${data.message || ""}`;
  }
};

async function loadPrivate(storageId) {
  statusDiv.textContent = "🔍 Loading private data...";
  const res = await fetch(`/api/verify/private/${storageId}`);
  const data = await res.json();
  if (data.ok) {
    statusDiv.innerHTML = `
      🔒 <b>Private Evidence Found</b><br>
      Title: ${data.data.evidenceTitle}<br>
      GPS: ${data.data.meta?.gps || "N/A"}<br>
      <a href="https://arweave.net/${storageId.replace("ar://", "")}" target="_blank">View in Arweave</a>
    `;
  } else {
    statusDiv.textContent = "❌ Private data not found.";
  }
}
