const recordsList = document.getElementById("recordsList");
const filterType = document.getElementById("filterType");
const orderBy = document.getElementById("orderBy");
const searchInput = document.getElementById("searchInput");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const email = params.get("email");

if (!token) {
  window.location.href = "https://app.udochain.com/login";
}

let allRecords = [];

async function fetchRecords() {
  try {
    recordsList.innerHTML = `<div class="loading">Loading records...</div>`;
    const res = await fetch(`/api/verify/all/${token}`);
    const data = await res.json();
    if (!data.ok || !data.validations) {
      recordsList.innerHTML = `<div class="loading">No records found.</div>`;
      return;
    }
    allRecords = data.validations;
    renderRecords();
  } catch (err) {
    console.error("Error loading records:", err);
    recordsList.innerHTML = `<div class="loading">Error loading records.</div>`;
  }
}

function renderRecords() {
  let filtered = [...allRecords];

  const type = filterType.value;
  if (type !== "all") filtered = filtered.filter((r) => r.type === type);

  const search = searchInput.value.toLowerCase();
  if (search)
    filtered = filtered.filter(
      (r) =>
        r.evidenceTitle.toLowerCase().includes(search) ||
        r.txHash.toLowerCase().includes(search)
    );

  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;
  if (from || to) {
    filtered = filtered.filter((r) => {
      const date = new Date(r.createdAt);
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });
  }

  const order = orderBy.value;
  if (order === "newest")
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (order === "oldest")
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (order === "az")
    filtered.sort((a, b) =>
      a.evidenceTitle.localeCompare(b.evidenceTitle, "en", { sensitivity: "base" })
    );
  else if (order === "za")
    filtered.sort((a, b) =>
      b.evidenceTitle.localeCompare(a.evidenceTitle, "en", { sensitivity: "base" })
    );

  if (!filtered.length) {
    recordsList.innerHTML = `<div class="loading">No results found.</div>`;
    return;
  }

  recordsList.innerHTML = filtered
    .map(
      (r) => `
      <div class="record-item" onclick="window.location.href='/verify-private?tx=${r.txHash}&token=${token}'">
        <div class="record-info">
          <div class="record-title">${r.evidenceTitle}</div>
          <div class="record-meta">
            <span class="record-type">${r.type}</span>
            <span class="status ${r.status}">${r.status}</span>
            <span>${new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="record-actions">
          <button class="btn-view">View</button>
        </div>
      </div>`
    )
    .join("");
}

[filterType, orderBy, searchInput, dateFrom, dateTo].forEach((el) =>
  el.addEventListener("input", renderRecords)
);

fetchRecords();
