const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const email = params.get("email");

if (!token || !email) {
  window.location.href = "https://app.udochain.com/login";
}

localStorage.setItem("udo_token", token);
localStorage.setItem("user_email", email);

const listDiv = document.getElementById("recordsList");
const loadingDiv = document.getElementById("loading");

async function loadRecords() {
  try {
    const res = await fetch(`/api/verify/all/${token}`, {
      headers: {
        "x-udo-token": token,
        "x-udo-email": email,
      },
    });
    const data = await res.json();
    loadingDiv.style.display = "none";

    if (!data.ok || !data.validations?.length) {
      listDiv.innerHTML = `<p style="text-align:center;color:#777;">No records found.</p>`;
      return;
    }

    renderRecords(data.validations);
  } catch (err) {
    console.error(err);
    loadingDiv.textContent = "Error loading records.";
  }
}

function renderRecords(records) {
  listDiv.innerHTML = records
    .map(
      (v) => `
      <div class="record-card">
        <div class="record-header">
          <h3 class="record-title">${v.evidenceTitle}</h3>
          <span class="status ${v.status}">${v.status}</span>
        </div>
        <div class="record-meta">
          <div><b>Hash:</b> ${v.txHash}</div>
          <div><b>Date:</b> ${new Date(v.createdAt).toLocaleString()}</div>
        </div>
        <div class="actions">
          <a href="/verify-public?tx=${v.txHash}" class="public">View Public</a>
          <a href="/verify-private?storage=${v.storageId}&token=${token}&email=${email}" class="private">View Private</a>
        </div>
      </div>`
    )
    .join("");
}

loadRecords();
