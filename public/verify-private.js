// ======================================================
// 🟪 UDoChain Verify Private v4.1 — Secure Aereware Download
// ======================================================

const params = new URLSearchParams(window.location.search);
const storageId = params.get("storage");
const badgeDiv = document.getElementById("badge");
const detailsDiv = document.getElementById("details");
const downloadsDiv = document.getElementById("downloads");

async function loadPrivateValidation() {
  if (!storageId) {
    detailsDiv.innerHTML = "<p class='fail'>No storage ID provided in URL.</p>";
    return;
  }

  try {
    const res = await fetch(`https://validate.udochain.com/api/validate/storage/${storageId}`);
    const data = await res.json();

    if (!data?.ok) {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = `<p class="fail">Error fetching private validation details.</p>`;
      return;
    }

    badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;

    const dateFormatted = new Date(data.validatedAt).toLocaleString();

    detailsDiv.innerHTML = `
      <div class="field"><span class="label">Evidence Title:</span> <span class="value">${data.evidenceTitle || "—"}</span></div>
      <div class="field"><span class="label">Transaction Hash:</span> <span class="value">${data.txHash}</span></div>
      <div class="field"><span class="label">Validated By:</span> <span class="value">${data.userEmail || "Unknown"}</span></div>
      <div class="field"><span class="label">GPS:</span> <span class="value">${data.gps || "—"}</span></div>
      <div class="field"><span class="label">Date (UTC):</span> <span class="value">${dateFormatted}</span></div>
      <div class="field"><span class="label">Aereware Storage ID:</span> <span class="value">${data.storageId}</span></div>
      <div class="field"><span class="label">Private Storage:</span> <span class="value">${data.w3Note || "—"}</span></div>
    `;

    const downloadLink = `https://validate.udochain.com/api/validate/aereware/download/${data.storageId}`;
    downloadsDiv.innerHTML = `
      <a href="${downloadLink}" class="back-link" style="display:inline-block; margin-top:10px;">Download from Aereware</a>
    `;
  } catch (err) {
    console.error("❌ Error fetching private validation:", err);
    badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
    detailsDiv.innerHTML = `<p class='fail'>Error fetching private validation details.</p>`;
  }
}

loadPrivateValidation();
