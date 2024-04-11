// app.js
const videoElement = document.getElementById('camera-stream');
const overlayElement = document.getElementById('overlay');
const qrShadedRegion = document.getElementById('qr-shaded-region');

// カメラの起動と設定
navigator.mediaDevices.getUserMedia({ video: {
        facingMode: 'environment' // この行を追加
    }
})
  .then(stream => {
    videoElement.srcObject = stream;
    startQRScanner(videoElement);
  })
  .catch(error => {
    console.error('Error accessing camera:', error);
  });

// QRコードスキャナーの設定
function startQRScanner(videoElement) {
  const scanner = new Instascan.Scanner({ video: videoElement });
  scanner.addListener('scan', function (content) {
    console.log('QR Code detected:', content);
    // QRコードの値を処理する
    // ...
  });
  Instascan.Camera.getCameras()
    .then(cameras => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
        qrShadedRegion.style.display = 'none'; // QRコード検出エリアを非表示
      } else {
        console.error('No cameras found.');
      }
    })
    .catch(error => {
      console.error('Error accessing cameras:', error);
    });
}
// 写真撮影ボタンの設定
const captureBtn = document.getElementById('capture-btn');
captureBtn.addEventListener('click', capturePhoto);

// 写真撮影関数
function capturePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const capturedImageData = canvas.toDataURL('image/png');

  const downloadLink = document.createElement('a');
  downloadLink.download = 'captured_photo.png';
  downloadLink.href = capturedImageData;
  downloadLink.click();
}
// QRコード検出エリアの更新
function updateQRShadedRegion(box) {
  if (box) {
    qrShadedRegion.style.display = 'block';
    qrShadedRegion.style.left = `${box.x}px`;
    qrShadedRegion.style.top = `${box.y}px`;
    qrShadedRegion.style.width = `${box.width}px`;
    qrShadedRegion.style.height = `${box.height}px`;
  } else {
    qrShadedRegion.style.display = 'none';
  }
}

// カメラのストリームを停止
function stopCameraStream() {
  const stream = videoElement.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

// 写真撮影
function capturePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const capturedImageData = canvas.toDataURL('image/png');

  // 撮影した写真の処理
  console.log('Captured Photo:', capturedImageData);

  // 例: 写真をリンクとしてダウンロードさせる
  const downloadLink = document.createElement('a');
  downloadLink.download = 'captured_photo.png';
  downloadLink.href = capturedImageData;
  downloadLink.click();
}
