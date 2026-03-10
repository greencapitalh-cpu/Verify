/*// ========== UDoChain Verify Functional Script + Animated Overlay ==========

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

function handleResult(text) {
  if (!text) return;
  resultDiv.textContent = "Detected: " + text;

  if (text.startsWith("http")) {
    setTimeout(() => (window.location.href = text), 1000);
  } else {
    setTimeout(() => {
      window.location.href = `/verify-public?tx=${encodeURIComponent(text)}`;
    }, 1000);
  }
}

// 1️⃣ Manual hash entry
verifyBtn.addEventListener("click", () => {
  const hash = hashInput.value.trim();
  if (!hash) return (resultDiv.textContent = "Please enter a hash.");
  handleResult(hash);
});

// 2️⃣ Camera scan with animated overlay
scanCamera.addEventListener("click", async () => {
  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;
  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// 3️⃣ Upload image with QR
scanGallery.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };
  fileInput.click();
});
*/
/*
// Mejora para q buscador lleve desde txhash a publico y storageId a private

// ======================================================
// 🔍 UDoChain Smart Verify (Detects txHash & storageId)
// ======================================================

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

const API_BASE = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🔎 MAIN SEARCH LOGIC
// ======================================================
async function searchIdentifier(value) {

  if (!value) {
    resultDiv.innerHTML = "Please enter an identifier.";
    return;
  }

  resultDiv.innerHTML = "Searching...";

  const isStorage = value.startsWith("ar://");
  const isTxHash = value.startsWith("0x") && value.length > 40;

  if (!isStorage && !isTxHash) {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>Invalid identifier format.</span>";
    return;
  }

  try {

    let endpoint;

    if (isStorage) {
      const cleanId = value.replace(/^ar:\/\//, "");
      endpoint = `${API_BASE}/storage/${encodeURIComponent(cleanId)}`;
    } else {
      endpoint = `${API_BASE}/tx/${encodeURIComponent(value)}`;
    }

    const res = await fetch(endpoint);

    if (!res.ok) throw new Error("Not found");

    const data = await res.json();

    if (!data?.ok) throw new Error("Not found");

    // ==================================================
    // ✅ REDIRECT BASED ON TYPE
    // ==================================================

    if (isStorage) {
      window.location.href =
        `/verify-private.html?storage=${encodeURIComponent(value)}`;
    } else {
      const storageId = data.storageId;
      window.location.href =
        `/verify-public.html?storage=${encodeURIComponent(storageId)}`;
    }

  } catch (err) {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>No validation found for this identifier.</span>";
  }
}

// ======================================================
// 1️⃣ Manual input
// ======================================================
verifyBtn.addEventListener("click", () => {
  searchIdentifier(hashInput.value.trim());
});

hashInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchIdentifier(hashInput.value.trim());
  }
});

// ======================================================
// 2️⃣ Handle QR result
// ======================================================
function handleResult(text) {
  if (!text) return;
  resultDiv.textContent = "Detected: " + text;

  setTimeout(() => {
    searchIdentifier(text.trim());
  }, 800);
}

// ======================================================
// 3️⃣ Camera scan
// ======================================================
scanCamera.addEventListener("click", async () => {
  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;
  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// ======================================================
// 4️⃣ Gallery scan
// ======================================================
scanGallery.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };

  fileInput.click();
});
*/


/*
//despues de modificaciones en backend para txhash


// ======================================================
// 🔍 UDoChain Smart Verify (Final Stable Version)
// Detects txHash → Public
// Detects storageId → Private
// ======================================================

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

const API_BASE = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🔎 MAIN SEARCH LOGIC
// ======================================================
async function searchIdentifier(value) {

  if (!value) {
    resultDiv.innerHTML = "Please enter an identifier.";
    return;
  }

  resultDiv.innerHTML = "Searching...";

  const trimmed = value.trim();

  const isStorage =
    trimmed.startsWith("ar://") ||
    /^[a-zA-Z0-9_-]{43}$/.test(trimmed);

  const isTxHash =
    /^0x[a-fA-F0-9]{64}$/.test(trimmed);

  if (!isStorage && !isTxHash) {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>Invalid identifier format.</span>";
    return;
  }

  try {

    let endpoint;

    if (isStorage) {
      const cleanId = trimmed.replace(/^ar:\/\//, "");
      endpoint = `${API_BASE}/storage/${encodeURIComponent(cleanId)}`;
    } else {
      endpoint = `${API_BASE}/tx/${encodeURIComponent(trimmed)}`;
    }

    const res = await fetch(endpoint);

    if (!res.ok) throw new Error("Not found");

    const data = await res.json();

    if (!data?.ok) throw new Error("Not found");

    // ==================================================
    // ✅ REDIRECT BASED ON TYPE
    // ==================================================

    if (isStorage) {

      // PRIVATE VERIFY
      window.location.href =
        `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;

    } else {

      // PUBLIC VERIFY (ONLY TXHASH)
      window.location.href =
        `/verify-public.html?tx=${encodeURIComponent(trimmed)}`;

    }

  } catch (err) {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>No validation found for this identifier.</span>";
  }
}

// ======================================================
// 1️⃣ Manual input
// ======================================================
verifyBtn.addEventListener("click", () => {
  searchIdentifier(hashInput.value.trim());
});

hashInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchIdentifier(hashInput.value.trim());
  }
});

// ======================================================
// 2️⃣ Handle QR result
// ======================================================
function handleResult(text) {
  if (!text) return;

  resultDiv.textContent = "Detected: " + text;

  setTimeout(() => {
    searchIdentifier(text.trim());
  }, 600);
}

// ======================================================
// 3️⃣ Camera scan
// ======================================================
scanCamera.addEventListener("click", async () => {
  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;
  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// ======================================================
// 4️⃣ Gallery scan
// ======================================================
scanGallery.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };

  fileInput.click();
});
*/
/*
//version q lee ox o ar antes 

// ======================================================
// 🔍 UDoChain Smart Verify — Production Stable
// Detects txHash → Public
// Detects storageId → Private
// Smart fallback detection
// ======================================================

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

const API_BASE = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🔎 MAIN SEARCH LOGIC (Smart Detection)
// ======================================================
async function searchIdentifier(value) {

  if (!value) {
    resultDiv.innerHTML = "Please enter an identifier.";
    return;
  }

  resultDiv.innerHTML = "Searching...";

  const trimmed = value.trim();

  try {

    // ==================================================
    // 1️⃣ If starts with 0x → treat as txHash
    // ==================================================
    if (trimmed.startsWith("0x")) {

      const res = await fetch(
        `${API_BASE}/tx/${encodeURIComponent(trimmed)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-public.html?tx=${encodeURIComponent(trimmed)}`;
        return;
      }
    }

    // ==================================================
    // 2️⃣ If starts with ar:// → treat as storage
    // ==================================================
    if (trimmed.startsWith("ar://")) {

      const cleanId = trimmed.replace(/^ar:\/\//, "");

      const res = await fetch(
        `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
        return;
      }
    }

    // ==================================================
    // 3️⃣ Unknown format → try tx first
    // ==================================================
    let res = await fetch(
      `${API_BASE}/tx/${encodeURIComponent(trimmed)}`
    );
    let data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-public.html?tx=${encodeURIComponent(trimmed)}`;
      return;
    }

    // ==================================================
    // 4️⃣ Try as storage fallback
    // ==================================================
    const cleanId = trimmed.replace(/^ar:\/\//, "");

    res = await fetch(
      `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
    );
    data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
      return;
    }

    throw new Error();

  } catch {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>No validation found for this identifier.</span>";
  }
}

// ======================================================
// 1️⃣ Manual input
// ======================================================
verifyBtn.addEventListener("click", () => {
  searchIdentifier(hashInput.value.trim());
});

hashInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchIdentifier(hashInput.value.trim());
  }
});

// ======================================================
// 2️⃣ Handle QR result
// ======================================================
function handleResult(text) {
  if (!text) return;

  resultDiv.textContent = "Detected: " + text;

  setTimeout(() => {
    searchIdentifier(text.trim());
  }, 600);
}

// ======================================================
// 3️⃣ Camera scan (Animated overlay)
// ======================================================
scanCamera.addEventListener("click", async () => {

  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;

  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// ======================================================
// 4️⃣ Gallery scan
// ======================================================
scanGallery.addEventListener("click", () => {

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };

  fileInput.click();
});
*/


/*
//version con dirección para q lea qr anterior de private y nuevos public

// ======================================================
// 🔍 UDoChain Smart Verify — Production Stable
// Compatible with:
// - Full URL QR (old system)
// - txHash QR (new public)
// - storageId QR (private)
// ======================================================

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

const API_BASE = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🔎 MAIN SEARCH LOGIC
// ======================================================
async function searchIdentifier(value) {

  if (!value) {
    resultDiv.innerHTML = "Please enter an identifier.";
    return;
  }

  const trimmed = value.trim();

  // ==================================================
  // 🔥 0️⃣ If QR already contains full URL → redirect
  // (Backward compatibility for existing QR codes)
  // ==================================================
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    window.location.href = trimmed;
    return;
  }

  resultDiv.innerHTML = "Searching...";

  try {

    // ==================================================
    // 1️⃣ If starts with 0x → treat as txHash
    // ==================================================
    if (trimmed.startsWith("0x")) {

      const res = await fetch(
        `${API_BASE}/tx/${encodeURIComponent(trimmed)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-public.html?tx=${encodeURIComponent(trimmed)}`;
        return;
      }
    }

    // ==================================================
    // 2️⃣ If starts with ar:// → treat as storage
    // ==================================================
    if (trimmed.startsWith("ar://")) {

      const cleanId = trimmed.replace(/^ar:\/\//, "");

      const res = await fetch(
        `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
        return;
      }
    }

    // ==================================================
    // 3️⃣ Unknown format → try tx first
    // ==================================================
    let res = await fetch(
      `${API_BASE}/tx/${encodeURIComponent(trimmed)}`
    );
    let data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-public.html?tx=${encodeURIComponent(trimmed)}`;
      return;
    }

    // ==================================================
    // 4️⃣ Try as storage fallback
    // ==================================================
    const cleanId = trimmed.replace(/^ar:\/\//, "");

    res = await fetch(
      `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
    );
    data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
      return;
    }

    throw new Error();

  } catch {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>No validation found for this identifier.</span>";
  }
}

// ======================================================
// 1️⃣ Manual input
// ======================================================
verifyBtn.addEventListener("click", () => {
  searchIdentifier(hashInput.value.trim());
});

hashInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchIdentifier(hashInput.value.trim());
  }
});

// ======================================================
// 2️⃣ Handle QR result
// ======================================================
function handleResult(text) {
  if (!text) return;

  resultDiv.textContent = "Detected: " + text;

  setTimeout(() => {
    searchIdentifier(text.trim());
  }, 600);
}

// ======================================================
// 3️⃣ Camera scan (Animated overlay)
// ======================================================
scanCamera.addEventListener("click", async () => {

  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay"><div id="scanner-line"></div></div>
  `;

  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// ======================================================
// 4️⃣ Gallery scan
// ======================================================
scanGallery.addEventListener("click", () => {

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };

  fileInput.click();
});

*/







//version q lee tx

// ======================================================
// 🔍 UDoChain Smart Verify — PRODUCTION STABLE
// Compatible with:
// - Full URL QR (old system)
// - txHash QR (public)
// - storageId QR (private)
// - Manual input
// ======================================================

const resultDiv = document.getElementById("result");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const scanGallery = document.getElementById("scanGallery");
const scanCamera = document.getElementById("scanCamera");
const qrPreview = document.getElementById("qr-preview");

const API_BASE = "https://api.udochain.com/validate/api/verify";

// ======================================================
// 🔎 MAIN SEARCH LOGIC
// ======================================================
async function searchIdentifier(value) {

  if (!value) {
    resultDiv.innerHTML = "Please enter an identifier.";
    return;
  }

  const trimmed = value.trim();

  // --------------------------------------------------
  // 0️⃣ If QR already contains full URL → redirect
  // (Backward compatibility)
  // --------------------------------------------------
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    window.location.href = trimmed;
    return;
  }

  resultDiv.innerHTML = "Searching...";

  try {

    // ==================================================
    // 1️⃣ If starts with 0x → treat as txHash (PUBLIC)
    // ==================================================
    if (trimmed.startsWith("0x")) {

      const cleanTx = trimmed.toLowerCase();

      const res = await fetch(
        `${API_BASE}/tx/${encodeURIComponent(cleanTx)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-public.html?tx=${encodeURIComponent(cleanTx)}`;
        return;
      }
    }

    // ==================================================
    // 2️⃣ If starts with ar:// → treat as storage (PRIVATE)
    // ==================================================
    if (trimmed.startsWith("ar://")) {

      const cleanId = trimmed.replace(/^ar:\/\//, "");

      const res = await fetch(
        `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
      );

      const data = await res.json();

      if (res.ok && data?.ok) {
        window.location.href =
          `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
        return;
      }
    }

    // ==================================================
    // 3️⃣ Unknown format → try as tx first
    // ==================================================
    let res = await fetch(
      `${API_BASE}/tx/${encodeURIComponent(trimmed.toLowerCase())}`
    );

    let data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-public.html?tx=${encodeURIComponent(trimmed.toLowerCase())}`;
      return;
    }

    // ==================================================
    // 4️⃣ Fallback → try as storage
    // ==================================================
    const cleanId = trimmed.replace(/^ar:\/\//, "");

    res = await fetch(
      `${API_BASE}/storage/${encodeURIComponent(cleanId)}`
    );

    data = await res.json();

    if (res.ok && data?.ok) {
      window.location.href =
        `/verify-private.html?storage=${encodeURIComponent(trimmed)}`;
      return;
    }

    throw new Error("Not found");

  } catch {
    resultDiv.innerHTML =
      "<span style='color:#b91c1c'>No validation found for this identifier.</span>";
  }
}

// ======================================================
// 1️⃣ Manual input
// ======================================================
verifyBtn.addEventListener("click", () => {
  searchIdentifier(hashInput.value);
});

hashInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchIdentifier(hashInput.value);
  }
});

// ======================================================
// 2️⃣ Handle QR result
// ======================================================
function handleResult(text) {
  if (!text) return;

  const cleaned = text.trim();

  resultDiv.textContent = "Detected: " + cleaned;

  setTimeout(() => {
    searchIdentifier(cleaned);
  }, 600);
}

// ======================================================
// 3️⃣ Camera scan (Animated overlay)
// ======================================================
scanCamera.addEventListener("click", async () => {

  qrPreview.innerHTML = `
    <div id="qr-reader" style="width:100%;"></div>
    <div id="qr-overlay">
      <div id="scanner-line"></div>
    </div>
  `;

  qrPreview.style.display = "block";

  const qrCode = new Html5Qrcode("qr-reader");

  try {
    await qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        qrCode.stop();
        qrPreview.style.display = "none";
        handleResult(decodedText);
      }
    );
  } catch (err) {
    console.error("Camera error:", err);
    resultDiv.textContent = "Camera access denied or unavailable.";
  }
});

// ======================================================
// 4️⃣ Gallery scan
// ======================================================
scanGallery.addEventListener("click", () => {

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("qr-preview");

    try {
      const text = await qrCode.scanFile(file, true);
      handleResult(text);
    } catch {
      resultDiv.textContent = "No QR detected in the image.";
    }
  };

  fileInput.click();
});




