/**
 * Cuadro Vivo — Aplicación interactiva de cámara con marco decorativo
 */

// Elementos del DOM
const video = document.getElementById('webcam');
const cameraOffline = document.getElementById('cameraOffline');
const btnToggleCamera = document.getElementById('btnToggleCamera');
const btnActivateFromPlaceholder = document.getElementById('btnActivateFromPlaceholder');
const cameraBtnText = document.getElementById('cameraBtnText');
const cameraBtnIcon = document.getElementById('cameraBtnIcon');
const btnFlipMirror = document.getElementById('btnFlipMirror');
const mirrorText = document.getElementById('mirrorText');
const frameContainer = document.getElementById('frameContainer');
const flashOverlay = document.getElementById('flashOverlay');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownNumber = document.getElementById('countdownNumber');
const timerCheckbox = document.getElementById('timerCheckbox');
const btnCapture = document.getElementById('btnCapture');
const polaroidCaption = document.getElementById('polaroidCaption');
const captionDate = document.getElementById('captionDate');
const photoModal = document.getElementById('photoModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnTakeAnother = document.getElementById('btnTakeAnother');
const btnDownloadPhoto = document.getElementById('btnDownloadPhoto');
const previewImage = document.getElementById('previewImage');
const renderCanvas = document.getElementById('renderCanvas');

// Estado de la aplicación
let stream = null;
let isCameraOn = false;
let isMirrorOn = true;
let currentFrame = 'polaroid';
let currentFilter = 'normal';

// Mapeo de filtros CSS a filtros de Canvas
const filterMap = {
  normal: 'none',
  bw: 'grayscale(100%) contrast(115%)',
  sepia: 'sepia(75%) contrast(105%) brightness(95%)',
  warm: 'sepia(30%) saturate(140%) hue-rotate(-15deg)',
  cool: 'saturate(110%) hue-rotate(180deg) brightness(105%)',
  soft: 'brightness(110%) contrast(90%) saturate(115%)'
};

// Inicialización de fecha para el marco Polaroid
function updateDateDisplay() {
  const now = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  captionDate.textContent = now.toLocaleDateString('es-ES', options).toUpperCase();
}
updateDateDisplay();

// Iniciar cámara con permisos
async function startCamera() {
  try {
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    
    // Esperar a que el video esté listo para reproducir
    video.onloadedmetadata = () => {
      video.play();
      isCameraOn = true;
      cameraOffline.style.opacity = '0';
      setTimeout(() => {
        cameraOffline.style.display = 'none';
      }, 300);
      updateCameraButtons(true);
    };
  } catch (err) {
    console.error('Error al acceder a la cámara:', err);
    alert('No se pudo acceder a la cámara. Asegúrate de otorgar permisos al navegador o verificar que tu cámara no esté en uso por otra app.');
    updateCameraButtons(false);
  }
}

// Detener cámara
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
  isCameraOn = false;
  cameraOffline.style.display = 'flex';
  setTimeout(() => {
    cameraOffline.style.opacity = '1';
  }, 10);
  updateCameraButtons(false);
}

// Actualizar textos de botones de cámara
function updateCameraButtons(active) {
  if (active) {
    cameraBtnText.textContent = 'Apagar Cámara';
    cameraBtnIcon.textContent = '⏹️';
    btnToggleCamera.classList.add('active');
  } else {
    cameraBtnText.textContent = 'Encender Cámara';
    cameraBtnIcon.textContent = '📹';
    btnToggleCamera.classList.remove('active');
  }
}

// Toggle Cámara
function toggleCamera() {
  if (isCameraOn) {
    stopCamera();
  } else {
    startCamera();
  }
}

btnToggleCamera.addEventListener('click', toggleCamera);
btnActivateFromPlaceholder.addEventListener('click', startCamera);

// Modo Espejo (Flip)
function updateMirrorMode() {
  if (isMirrorOn) {
    video.classList.add('mirror-mode');
    mirrorText.textContent = 'Modo Espejo (On)';
  } else {
    video.classList.remove('mirror-mode');
    mirrorText.textContent = 'Modo Espejo (Off)';
  }
}
updateMirrorMode();

btnFlipMirror.addEventListener('click', () => {
  isMirrorOn = !isMirrorOn;
  updateMirrorMode();
});

// Selección de Marcos Decorativos
const frameChips = document.querySelectorAll('.frame-chip');
frameChips.forEach(chip => {
  chip.addEventListener('click', () => {
    frameChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    const frameType = chip.getAttribute('data-frame');
    currentFrame = frameType;

    // Quitar clases anteriores del marco
    frameContainer.className = 'frame-container';
    frameContainer.classList.add(`frame-${frameType}`);
  });
});

// Selección de Filtros
const filterChips = document.querySelectorAll('.filter-chip');
filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    const filterType = chip.getAttribute('data-filter');
    currentFilter = filterType;

    // Remover clases de filtro previas del video
    Object.keys(filterMap).forEach(f => video.classList.remove(`filter-${f}`));
    video.classList.add(`filter-${filterType}`);
  });
});

// Reproducir sonido sintetizado sutil (Web Audio API)
function playBeep(frequency = 440, duration = 0.15) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Si la API de audio no está permitida sin interacción previa, ignorar silenciosamente
  }
}

// Disparador de Captura (Foto)
btnCapture.addEventListener('click', () => {
  if (!isCameraOn) {
    alert('Por favor enciende tu cámara primero para tomar la foto.');
    return;
  }

  const useTimer = timerCheckbox.checked;

  if (useTimer) {
    startCountdown(3, executeCapture);
  } else {
    executeCapture();
  }
});

// Cuenta regresiva
function startCountdown(seconds, callback) {
  countdownOverlay.classList.add('active');
  let current = seconds;
  countdownNumber.textContent = current;
  playBeep(440, 0.1);

  const interval = setInterval(() => {
    current--;
    if (current > 0) {
      countdownNumber.textContent = current;
      playBeep(440, 0.1);
    } else {
      clearInterval(interval);
      countdownOverlay.classList.remove('active');
      playBeep(880, 0.25);
      callback();
    }
  }, 1000);
}

// Ejecución de la Captura y Render en Canvas
function executeCapture() {
  // Animación de flash
  flashOverlay.classList.remove('flash-active');
  void flashOverlay.offsetWidth; // Trigger reflow
  flashOverlay.classList.add('flash-active');

  setTimeout(() => {
    renderPhotoWithFrame();
  }, 100);
}

// Dibuja el marco y la imagen en el Canvas
function renderPhotoWithFrame() {
  const canvas = renderCanvas;
  const ctx = canvas.getContext('2d');

  // Dimensiones base de alta resolución para la foto
  let canvasW = 900;
  let canvasH = 1100; // Por defecto formato vertical elegante tipo cuadro

  if (currentFrame === 'polaroid') {
    canvasW = 800;
    canvasH = 1000;
  } else if (currentFrame === 'gold') {
    canvasW = 960;
    canvasH = 800;
  } else if (currentFrame === 'flowers') {
    canvasW = 900;
    canvasH = 750;
  } else if (currentFrame === 'neon') {
    canvasW = 900;
    canvasH = 720;
  } else if (currentFrame === 'wood') {
    canvasW = 960;
    canvasH = 780;
  } else if (currentFrame === 'glass') {
    canvasW = 900;
    canvasH = 720;
  }

  canvas.width = canvasW;
  canvas.height = canvasH;

  // 1. Dibujar el Fondo / Borde del Marco
  renderFrameBackground(ctx, canvasW, canvasH);

  // 2. Calcular la zona donde va el video
  const photoArea = getPhotoAreaCoordinates(currentFrame, canvasW, canvasH);

  // 3. Dibujar el fotograma del video dentro de la zona designada
  ctx.save();
  
  // Recorte para bordes redondeados si aplica
  if (photoArea.radius) {
    ctx.beginPath();
    ctx.roundRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h, photoArea.radius);
    ctx.clip();
  }

  // Aplicar filtro al contexto de Canvas
  if (filterMap[currentFilter] && filterMap[currentFilter] !== 'none') {
    ctx.filter = filterMap[currentFilter];
  }

  // Si está en modo espejo, invertir horizontalmente sólo dentro de la zona de la foto
  if (isMirrorOn) {
    ctx.translate(photoArea.x + photoArea.w, photoArea.y);
    ctx.scale(-1, 1);
    drawImageProp(ctx, video, 0, 0, photoArea.w, photoArea.h);
  } else {
    drawImageProp(ctx, video, photoArea.x, photoArea.y, photoArea.w, photoArea.h);
  }

  ctx.restore();

  // 4. Dibujar ornamentos y textos superiores del marco
  renderFrameOverlay(ctx, canvasW, canvasH, photoArea);

  // 5. Mostrar en el modal
  const dataURL = canvas.toDataURL('image/png');
  previewImage.src = dataURL;
  btnDownloadPhoto.href = dataURL;
  btnDownloadPhoto.download = `cuadro-vivo-${currentFrame}-${Date.now()}.png`;

  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
}

// Coordenadas del área de la foto según el marco
function getPhotoAreaCoordinates(frame, w, h) {
  switch (frame) {
    case 'polaroid':
      return { x: 40, y: 40, w: w - 80, h: h - 220, radius: 4 };
    case 'gold':
      return { x: 70, y: 70, w: w - 140, h: h - 170, radius: 0 };
    case 'flowers':
      return { x: 50, y: 50, w: w - 100, h: h - 100, radius: 18 };
    case 'neon':
      return { x: 30, y: 30, w: w - 60, h: h - 90, radius: 12 };
    case 'wood':
      return { x: 60, y: 60, w: w - 120, h: h - 120, radius: 6 };
    case 'glass':
      return { x: 35, y: 35, w: w - 70, h: h - 70, radius: 20 };
    default:
      return { x: 40, y: 40, w: w - 80, h: h - 80, radius: 8 };
  }
}

// Fondo de cada marco
function renderFrameBackground(ctx, w, h) {
  switch (currentFrame) {
    case 'polaroid':
      // Papel blanco texturado sutil
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, w, h);
      // Borde sutil
      ctx.strokeStyle = '#e2dfd8';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
      break;

    case 'gold':
      // Marco dorado exterior con gradiente
      const goldGrad = ctx.createLinearGradient(0, 0, w, h);
      goldGrad.addColorStop(0, '#d4af37');
      goldGrad.addColorStop(0.25, '#8c6721');
      goldGrad.addColorStop(0.5, '#fbf0b9');
      goldGrad.addColorStop(0.75, '#7d5a1b');
      goldGrad.addColorStop(1, '#caa14c');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, w, h);

      // Paspartú interior crema
      ctx.fillStyle = '#f8f5ee';
      ctx.fillRect(45, 45, w - 90, h - 90);

      // Sombra interior del paspartú
      ctx.strokeStyle = '#bfa76f';
      ctx.lineWidth = 4;
      ctx.strokeRect(45, 45, w - 90, h - 90);
      break;

    case 'flowers':
      // Fondo crema pastel con ribete amarillo
      ctx.fillStyle = '#fefdf9';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 28);
      ctx.fill();

      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 8;
      ctx.stroke();
      break;

    case 'neon':
      // Fondo ultra oscuro con resplandor neón
      ctx.fillStyle = '#06070a';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 18);
      ctx.fill();

      // Borde neón
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
      break;

    case 'wood':
      // Gradiente imitación madera oscura
      const woodGrad = ctx.createLinearGradient(0, 0, w, h);
      woodGrad.addColorStop(0, '#381f11');
      woodGrad.addColorStop(0.3, '#5c371d');
      woodGrad.addColorStop(0.7, '#442614');
      woodGrad.addColorStop(1, '#241208');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 14);
      ctx.fill();

      ctx.strokeStyle = '#180a03';
      ctx.lineWidth = 6;
      ctx.stroke();
      break;

    case 'glass':
      // Fondo oscuro moderno tipo acrílico/vidrio
      ctx.fillStyle = '#141a24';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 26);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
  }
}

// Decoraciones, textos y placas sobre el marco
function renderFrameOverlay(ctx, w, h, photoArea) {
  // Sombra interior sutil sobre la foto
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 3;
  ctx.strokeRect(photoArea.x, photoArea.y, photoArea.w, photoArea.h);

  if (currentFrame === 'polaroid') {
    // Texto escrito a mano
    const text = polaroidCaption.value || 'Momento Especial ✨';
    ctx.font = '600 44px "Caveat", cursive, sans-serif';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(text, w / 2, h - 110);

    // Fecha en letra imprenta limpia
    ctx.font = '600 16px "Inter", sans-serif';
    ctx.fillStyle = '#888';
    ctx.letterSpacing = '2px';
    ctx.fillText(captionDate.textContent, w / 2, h - 60);

  } else if (currentFrame === 'gold') {
    // Placa dorada en la parte inferior
    const plaqueW = 280;
    const plaqueH = 50;
    const plaqueX = (w - plaqueW) / 2;
    const plaqueY = h - 85;

    // Fondo de la placa
    const plqGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + plaqueH);
    plqGrad.addColorStop(0, '#f9e49a');
    plqGrad.addColorStop(1, '#b88924');
    ctx.fillStyle = plqGrad;
    ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);

    ctx.strokeStyle = '#5a3d0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(plaqueX, plaqueY, plaqueW, plaqueH);

    // Texto de la placa
    ctx.font = 'bold 15px "Playfair Display", serif';
    ctx.fillStyle = '#3a2605';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('RETRATO VIVO', w / 2, plaqueY + 22);

    ctx.font = 'italic 12px "Playfair Display", serif';
    ctx.fillStyle = '#52380a';
    ctx.letterSpacing = '1px';
    ctx.fillText('Colección Privada • Óleo Digital', w / 2, plaqueY + 40);

  } else if (currentFrame === 'flowers') {
    // Dibujar margaritas en las 4 esquinas del canvas
    drawDaisy(ctx, 55, 55, 26);
    drawDaisy(ctx, w - 55, 55, 26);
    drawDaisy(ctx, 55, h - 55, 26);
    drawDaisy(ctx, w - 55, h - 55, 26);

  } else if (currentFrame === 'neon') {
    // Tag Cyberpunk inferior
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.fillText('LIVE FEED // 2026', w / 2, h - 45);
    ctx.shadowBlur = 0;
  }
}

// Función auxiliar para dibujar una margarita estilizada en canvas
function drawDaisy(ctx, x, y, radius) {
  ctx.save();
  ctx.translate(x, y);

  const numPetals = 10;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 6;

  // Dibujar pétalos
  for (let i = 0; i < numPetals; i++) {
    ctx.rotate((2 * Math.PI) / numPetals);
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.75, radius * 0.35, radius * 0.7, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Centro amarillo de la flor
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.45, 0, 2 * Math.PI);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// Dibuja una imagen o video cubriendo proporcionalmente el espacio (object-fit: cover)
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
  offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  const iw = img.videoWidth || img.width;
  const ih = img.videoHeight || img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx, cy, cw, ch, ar = 1;

  if (nw < w) ar = w / nw;                             
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; 
  nw *= ar;
  nh *= ar;

  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// Cerrar Modal
function closeModal() {
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden', 'true');
}

btnCloseModal.addEventListener('click', closeModal);
btnTakeAnother.addEventListener('click', closeModal);

// Cerrar haciendo clic fuera de la tarjeta
photoModal.addEventListener('click', (e) => {
  if (e.target === photoModal) {
    closeModal();
  }
});

// Cerrar con Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && photoModal.classList.contains('open')) {
    closeModal();
  }
});
