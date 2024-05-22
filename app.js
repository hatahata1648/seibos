const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlayImage = document.getElementById('overlay-image');
const captureBtn = document.getElementById('capture-btn');
const previewContainer = document.getElementById('preview-container');
const capturedImage = document.getElementById('captured-image');
const closeBtn = document.getElementById('close-btn');
const downloadLink = document.getElementById('download-link');
const imageInput = document.getElementById('image-input');
const shutterSound = document.getElementById('shutter-sound');
const overlay = document.getElementById('overlay');

let initialPinchDistance = 0;
let initialScale = 1;

// カメラの初期化
const constraints = {
  video: {
    facingMode: 'environment'
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => console.error(err));

// 写真の撮影と保存
captureBtn.addEventListener('click', () => {
  const videoRatio = video.videoWidth / video.videoHeight;
  const canvasWidth = video.videoWidth;
  const canvasHeight = canvasWidth / videoRatio;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
  
  if (overlayImage.src) {
    const imageWidth = overlayImage.width * initialScale;
    const imageHeight = overlayImage.height * initialScale;
    const offsetX = (canvasWidth - imageWidth) / 2;
    const offsetY = (canvasHeight - imageHeight) / 2;
    ctx.drawImage(overlayImage, offsetX, offsetY, imageWidth, imageHeight);
  }
  
  const dataURL = canvas.toDataURL('image/png');
  capturedImage.src = dataURL;
  previewContainer.style.display = 'flex';
  downloadLink.href = dataURL;
  downloadLink.style.display = 'block';
  shutterSound.play();
  
  const previewOverlay = document.getElementById('preview-overlay');
  previewOverlay.style.animation = 'none';
  requestAnimationFrame(() => {
    previewOverlay.style.animation = null;
  });
  requestAnimationFrame(() => {
    previewOverlay.style.animation = 'flash 0.5s ease-out';
  });
});

// プレビューを閉じる
closeBtn.addEventListener('click', () => {
  previewContainer.style.display = 'none';
});

// 画像のオーバーレイ
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    overlayImage.src = reader.result;
    initialScale = 1;
    overlayImage.style.transform = 'scale(1)';
  };
  if (file) {
    reader.readAsDataURL(file);
  }
});

// ピンチジェスチャーの開始
overlay.addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) {
    initialPinchDistance = getDistance(event.touches[0], event.touches[1]);
    initialScale = parseFloat(overlayImage.style.transform.replace('scale(', '').replace(')', '')) || 1;
  }
});

// ピンチジェスチャーの移動
overlay.addEventListener('touchmove', (event) => {
  if (event.touches.length === 2) {
    const currentPinchDistance = getDistance(event.touches[0], event.touches[1]);
    const scale = initialScale * (currentPinchDistance / initialPinchDistance);
    overlayImage.style.transform = `scale(${scale})`;
  }
});

// ピンチジェスチャーの終了
overlay.addEventListener('touchend', () => {
  initialPinchDistance = 0;
  initialScale = parseFloat(overlayImage.style.transform.replace('scale(', '').replace(')', '')) || 1;
});

// 2点間の距離を計算する関数
function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
