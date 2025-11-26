const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");
const container = document.getElementById("privateData");
const btn = document.getElementById("downloadZip");

async function loadPrivate() {
  try {
    const res = await fetch(`/api/verify/private/${storageId}`);
    const data = await res.json();
    if (!data.ok) return (container.textContent = "❌ Not found.");

    const meta = data.data.meta || data.data;
    container.innerHTML = `
      <p><strong>Evidence:</strong> ${meta.evidenceTitle}</p>
      <p><strong>Created:</strong> ${new Date(meta.createdAt).toLocaleString()}</p>
      <p><strong>GPS:</strong> ${meta.gps || "—"}</p>
      <p><strong>Wallet:</strong> ${meta.wallet || "—"}</p>
      <p><strong>Storage:</strong> ${storageId}</p>
    `;
  } catch (err) {
    container.textContent = "⚠️ Error loading private record.";
  }
}
loadPrivate();

btn.addEventListener("click", () => {
  window.location.href = `/api/verify/binary/${storageId}`;
});
