const API_URL = "https://verify.udochain.com/api/verify";
const userToken = localStorage.getItem("udo_token");
const listContainer = document.getElementById("recordsList");
const filterType = document.getElementById("filterType");

let records = [];

// Load private records
async function loadPrivateRecords() {
  try {
    const res = await fetch(`${API_URL}/all/${userToken}`);
    const data = await res.json();

    if (!data.ok) {
      listContainer.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    // Filter private and active
    records = data.validations.filter((v) => v.privateAccess && v.qrActive);
    render(records);
  } catch (err) {
    listContainer.innerHTML = `<p>Error loading private records.</p>`;
  }
}

function render(list) {
  listContainer.innerHTML = "";
  if (!list.length) {
    listContainer.innerHTML = "<p>No private records found.</p>";
    return;
  }

  list.forEach((r) => {
    const div = document.createElement("div");
    div.className = "record-card";

    div.innerHTML = `
      <div class="record-header">
        <span class="record-title">${r.evidenceTitle || "Untitled"}</span>
        <span class="record-type">${r.type}</span>
      </div>
      <div class="status active">Active</div>
      <div>Date: ${new Date(r.createdAt).toLocaleDateString()}</div>
      <div class="record-actions">
        <button onclick="openPDF('${r.pdfUrl}')">View PDF</button>
        ${
          r.storageId
            ? `<button onclick="downloadZip('${r.storageId}')">Download ZIP</button>`
            : ""
        }
      </div>
    `;
    listContainer.appendChild(div);
  });
}

function openPDF(url) {
  if (!url) return alert("PDF not available.");
  window.open(url, "_blank");
}

async function downloadZip(storageId) {
  try {
    const res = await fetch(`${API_URL}/binary/${storageId}`);
    if (!res.ok) return alert("Unable to download ZIP from Aereware.");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${storageId}.zip`;
    link.click();
  } catch (err) {
    alert("Download failed: " + err.message);
  }
}

// Filter by type
function applyFilters() {
  const type = filterType.value;
  const filtered = records.filter(
    (r) => type === "all" || r.type === type
  );
  render(filtered);
}

filterType.addEventListener("change", applyFilters);

// Init
loadPrivateRecords();
