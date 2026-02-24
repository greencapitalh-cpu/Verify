const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.getElementById("title").innerText = "Invalid Record";
  throw new Error("Missing storage ID");
}

async function loadRecord() {
  try {
    const res = await fetch(`/api/records/${encodeURIComponent(id)}`);
    const record = await res.json();

    if (!record) {
      document.getElementById("title").innerText = "Record not found";
      return;
    }

    // 🔹 TITLE
    document.getElementById("title").innerText =
      record.evidence?.title || "Untitled Evidence";

    // 🔹 TX HASH
    document.getElementById("txHash").innerText =
      record.anchors?.polygon?.txHash || "-";

    // 🔹 DATE
    document.getElementById("date").innerText =
      record.evidence?.validatedAt
        ? new Date(record.evidence.validatedAt).toLocaleString()
        : "-";

    // 🔹 GPS
    document.getElementById("gps").innerText =
      record.evidence?.gps || "GPS not provided";

    // 🔹 STORAGE ID
    document.getElementById("storageId").innerText =
      record.storageId || id;

    // 🔹 FILES LIST
    const filesContainer = document.getElementById("files");
    filesContainer.innerHTML = "";

    if (Array.isArray(record.files) && record.files.length > 0) {
      record.files.forEach(file => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.innerHTML = `
          <strong>${file.name}</strong><br/>
          <small>SHA256: ${file.hash}</small>
        `;
        filesContainer.appendChild(div);
      });
    } else {
      filesContainer.innerText = "No files registered.";
    }

    // 🔹 CUSTODY DOWNLOAD BUTTON
    if (record.custody?.hasBinaryBackup === true) {
      const btn = document.getElementById("downloadBtn");
      btn.classList.remove("hidden");

      btn.onclick = () => {
        window.location.href =
          `/api/custody/download/${encodeURIComponent(id)}`;
      };
    }

  } catch (err) {
    console.error("Verify load error:", err);
    document.getElementById("title").innerText = "Error loading record";
  }
}

loadRecord();
