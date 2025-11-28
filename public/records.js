// ======================================================
// 📋 UDoChain Verify — Records Dashboard v5.0
// ======================================================
const API_URL = "https://verify.udochain.com/api/verify";
const userToken = localStorage.getItem("udo_token");

if (!userToken) {
  window.location.href = "https://app.udochain.com/login";
}

const listContainer = document.getElementById("recordsList");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const orderBy = document.getElementById("orderBy");

let records = [];

// ======================================================
// 🚀 Load records
// ======================================================
async function loadRecords() {
  try {
    const res = await fetch(`${API_URL}/all/${userToken}`);
    const data = await res.json();
    if (!data.ok || !data.validations) {
      listContainer.innerHTML = `<p>${data.message || "No records found."}</p>`;
      return;
    }
    records = data.validations;
    render(records);
  } catch (err) {
    console.error("❌ Error loading records:", err);
    listContainer.innerHTML = `<p>Error loading records.</p>`;
  }
}

// ======================================================
// 🎨 Render list
// ======================================================
function render(list) {
  listContainer.innerHTML = "";
  if (!list.length) {
    listContainer.innerHTML = "<p>No records found.</p>";
    return;
  }

  list.forEach((r) => {
    const div = document.createElement("div");
    div.className = "record-item";
    div.innerHTML = `
      <div class="record-info">
        <div class="record-title">${r.evidenceTitle || "Untitled"}</div>
        <div class="record-meta">
          <span class="record-type">${r.type}</span>
          <span class="record-date">${new Date(r.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="record-actions">
        <button class="btn-view" onclick="openRecord('${r.txHash}')">View</button>
      </div>
    `;
    listContainer.appendChild(div);
  });
}

// ======================================================
// 🔎 Search & Filters
// ======================================================
function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const type = filterType.value;
  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;
  const order = orderBy.value;

  let filtered = records.filter((r) => {
    const matchQuery =
      r.evidenceTitle?.toLowerCase().includes(q) ||
      r.txHash?.toLowerCase().includes(q);
    const matchType = type === "all" || r.type === type;
    const created = new Date(r.createdAt);
    const matchDate =
      (!from || created >= from) && (!to || created <= to);
    return matchQuery && matchType && matchDate;
  });

  if (order === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (order === "oldest") filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (order === "az") filtered.sort((a, b) => (a.evidenceTitle || "").localeCompare(b.evidenceTitle || ""));
  if (order === "za") filtered.sort((a, b) => (b.evidenceTitle || "").localeCompare(a.evidenceTitle || ""));

  render(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterType.addEventListener("change", applyFilters);
dateFrom.addEventListener("change", applyFilters);
dateTo.addEventListener("change", applyFilters);
orderBy.addEventListener("change", applyFilters);

// ======================================================
// 📂 Open Record Detail
// ======================================================
window.openRecord = function (txHash) {
  window.location.href = `record-detail.html?tx=${txHash}`;
};

// ======================================================
// 🏁 Init
// ======================================================
loadRecords();
