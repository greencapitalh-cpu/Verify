const params = new URLSearchParams(window.location.search);
const token = params.get("token") || localStorage.getItem("udo_token");
const email = params.get("email") || localStorage.getItem("user_email");

if (!token || !email) {
  window.location.href = "https://app.udochain.com/login";
}

localStorage.setItem("udo_token", token);
localStorage.setItem("user_email", email);

async function loadRecords() {
  const res = await fetch(`/api/verify/all/${token}`, {
    headers: {
      "x-udo-token": token,
      "x-udo-email": email
    }
  });

  const data = await res.json();
  const div = document.getElementById("recordsList");

  if (!data.ok) {
    div.innerHTML = `<p>Error: ${data.error}</p>`;
    return;
  }

  if (data.validations.length === 0) {
    div.innerHTML = `<p>No records found.</p>`;
    return;
  }

  div.innerHTML = data.validations
    .map(
      (v) => `
      <div class="evidence-card">
        <h3 class="evidence-title">${v.evidenceTitle}</h3>
        <p class="evidence-meta">${new Date(v.createdAt).toLocaleString()}</p>
        <p>Status: ${v.status}</p>
        <div class="evidence-actions">
          <a href="${v.pdfUrl}" target="_blank" class="btn-validate">Open PDF</a>
        </div>
      </div>
    `
    )
    .join("");
}

loadRecords();
