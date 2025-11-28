// ===== UDoChain Verify Public =====
const detailsDiv = document.getElementById("details");
const dropZone = document.getElementById("dropZone");
const statusDiv = document.getElementById("status");
const badgeDiv = document.getElementById("badge");

const params = new URLSearchParams(window.location.search);
const tx = params.get("tx");

if (!tx) {
  detailsDiv.innerHTML = "<p class='fail'>No transaction hash provided.</p>";
} else {
  fetch(`https://validate.udochain.com/api/validate/tx/${tx}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.tx) {
        badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
        detailsDiv.innerHTML = "<p class='fail'>Validation not found or invalid hash.</p>";
        return;
      }

      badgeDiv.innerHTML = `<div class="badge verified">Verified on Blockchain</div>`;
      detailsDiv.innerHTML = `
        <div class="field"><span class="label">Document Name:</span> <span class="value">${data.fileName || "—"}</span></div>
        <div class="field"><span class="label">Hash:</span> <span class="value">${data.tx}</span></div>
        <div class="field"><span class="label">Validated by:</span> <span class="value">${data.email || "Unknown"}</span></div>
        <div class="field"><span class="label">Network:</span> <span class="value">${data.network || "Polygon"}</span></div>
        <div class="field"><span class="label">Date:</span> <span class="value">${new Date(data.date || data.createdAt).toLocaleString()}</span></div>
      `;
    })
    .catch(() => {
      badgeDiv.innerHTML = `<div class="badge unverified">Unverified</div>`;
      detailsDiv.innerHTML = "<p class='fail'>Error loading validation details.</p>";
    });
}

// ===== File verification =====
dropZone.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => verifyFile(e.target.files[0]);
  input.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) verifyFile(file);
});

async function verifyFile(file) {
  if (!tx) {
    statusDiv.innerHTML = "<p class='fail'>Missing reference hash.</p>";
    return;
  }

  statusDiv.textContent = "Analyzing file...";
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (fileHash === tx.toLowerCase().replace(/^0x/, "")) {
    statusDiv.innerHTML = `<p class="ok">This file matches the blockchain record.</p>`;
  } else {
    statusDiv.innerHTML = `<p class="fail">File does not match this validation.</p>`;
  }
}
