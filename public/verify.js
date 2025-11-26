<script type="module">
import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.esm.js";

const scanBtn = document.getElementById("scanQR");
const uploadInput = document.getElementById("qrUpload");
const hashInput = document.getElementById("hashInput");
const verifyBtn = document.getElementById("verifyBtn");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// ===============
// 📸 Escanear con cámara
// ===============
scanBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    const scanLoop = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          stream.getTracks().forEach(t => t.stop());
          handleDecodedQR(code.data);
          return;
        }
      }
      requestAnimationFrame(scanLoop);
    };
    scanLoop();
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
});

// ===============
// 📤 Subir imagen desde galería
// ===============
uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) handleDecodedQR(code.data);
    else alert("No se detectó ningún QR válido en la imagen.");
  };
});

// ===============
// 🧠 Procesa el QR decodificado
// ===============
function handleDecodedQR(data) {
  if (data.includes("udochain.com")) {
    window.location.href = data; // Redirige al enlace del QR (verify)
  } else if (data.startsWith("0x")) {
    hashInput.value = data;
    alert("Código QR leído correctamente. Puedes verificarlo ahora.");
  } else {
    alert("QR leído: " + data);
  }
}

// ===============
// 🔍 Botón de verificación manual
// ===============
verifyBtn.addEventListener("click", () => {
  const tx = hashInput.value.trim();
  if (!tx) return alert("Ingrese o escanee un hash de transacción válido.");
  window.location.href = `https://verify.udochain.com/?tx=${tx}`;
});
</script>
