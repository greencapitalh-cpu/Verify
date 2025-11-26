const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");
const dataBox = document.getElementById("publicData");

async function loadPublic() {
  try {
    const res = await fetch("/api/verify/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: tx }),
    });
    const data = await res.json();

    if (!data.ok) return (dataBox.textContent = "❌ Not found.");

    dataBox.innerHTML = `
      <p><strong>Evidence:</strong> ${data.evidenceTitle}</p>
      <p><strong>Date:</strong> ${new Date(data.validatedAt).toLocaleString()}</p>
      <p><strong>TxHash:</strong> ${data.txHash}</p>
      <p><strong>Network:</strong> Polygon</p>
      <p><strong>Source:</strong> ${data.source || "MongoDB"}</p>
    `;
  } catch (err) {
    dataBox.textContent = "⚠️ Error loading data.";
  }
}
loadPublic();

// Comparar hash local del archivo
document.getElementById("checkFileBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Upload a file first.");
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  document.getElementById("checkResult").textContent =
    hashHex === tx ? "✅ Hash matches." : "❌ File does not match.";
});
