const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const email = params.get("email");

if (!token || !email) {
  window.location.href = "https://app.udochain.com/login";
}

localStorage.setItem("udo_token", token);
localStorage.setItem("user_email", email);

async function loadRecords() {
  const res = await fetch(`/api/verify/all/${token}`, {
    headers: {
      "x-udo-token": token,
      "x-udo-email": email,
    },
  });
  const data = await res.json();
  const div = document.getElementById("recordsList");

  if (!data.ok) {
    div.innerHTML = `<p>Error: ${data.error}</p>`;
    return;
  }

  div.innerHTML = data.validations
    .map(
      (v) => `
      <div>
        <h3>${v.evidenceTitle}</h3>
        <p>${v.txHash}</p>
        <p>Status: ${v.status}</p>
        <a href="/verify-private?storage=${v.storageId}&token=${token}&email=${email}">Private</a>
        <a href="/verify-public?tx=${v.txHash}">Public</a>
      </div><hr/>`
    )
    .join("");
}

loadRecords();
