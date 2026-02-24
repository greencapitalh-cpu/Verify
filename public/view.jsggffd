const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<h2>Missing ID</h2>";
  throw new Error("Missing storage ID");
}

async function loadRecord() {
  try {
    const res = await fetch(`/api/records/${encodeURIComponent(id)}`);
    const raw = await res.json();

    console.log("RAW RESPONSE:", raw);

    // 🔥 Detectar dónde viene el metadata realmente
    const record =
      raw.evidence ? raw :
      raw.metadata ? raw.metadata :
      raw.record ? raw.record :
      raw.data ? raw.data :
      raw;

    if (!record) {
      document.body.innerHTML = "<h2>Record not found</h2>";
      return;
    }

    document.getElementById("title").innerText =
      record.evidence?.title || record.title || "Untitled Evidence";

    document.getElementById("txHash").innerText =
      record.anchors?.polygon?.txHash ||
      record.txHash ||
      "-";

    document.getElementById("date").innerText =
      record.evidence?.validatedAt
        ? new Date(record.evidence.validatedAt).toLocaleString()
        : "-";

    document.getElementById("gps").innerText =
      record.evidence?.gps ||
      record.gps ||
      "GPS not provided";

    document.getElementById("storageId").innerText =
      record.storageId || id;

    const filesContainer = document.getElementById("files");
    filesContainer.innerHTML = "";

    const files = record.files || record.evidence?.files || [];

    if (Array.isArray(files) && files.length > 0) {
      files.forEach(file => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.innerHTML = `
          <strong>${file.name || "File"}</strong><br/>
          <small>${file.hash || "-"}</small>
        `;
        filesContainer.appendChild(div);
      });
    } else {
      filesContainer.innerText = "No files registered.";
    }

    if (record.custody?.hasBinaryBackup === true) {
      const btn = document.getElementById("downloadBtn");
      btn.classList.remove("hidden");
      btn.onclick = () => {
        window.location.href =
          `/api/custody/download/${encodeURIComponent(id)}`;
      };
    }

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    document.body.innerHTML = "<h2>Error loading record</h2>";
  }
}

loadRecord();
