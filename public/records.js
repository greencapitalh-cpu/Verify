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
      listDiv.innerHTML = `<p class="status">No records found.</p>`;
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
      <div class="evidence-card">
        <h3 class="evidence-title">${v.evidenceTitle}</h3>
        <p class="evidence-meta">Hash: ${v.txHash}</p>
        <p class="evidence-meta">Date: ${new Date(v.createdAt).toLocaleString()}</p>

        <div class="evidence-actions">
          <a href="/verify-public?tx=${v.txHash}" class="btn-validate">View Public</a>
          <a href="/verify-private?storage=${v.storageId}&token=${token}&email=${email}" class="btn-validate" style="background:#2563eb;">View Private</a>
        </div>
      </div>
    `
    )
    .join("");
}

loadRecords();
