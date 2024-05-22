const overlay = document.getElementById('overlayImage');
let scale = 1;

document.getElementById('zoomIn').addEventListener('click', () => {
    scale *= 1.1;
    overlay.style.transform = `scale(${scale})`;
});

document.getElementById('zoomOut').addEventListener('click', () => {
    scale /= 1.1;
    overlay.style.transform = `scale(${scale})`;
});

// 撮影機能はそのまま使用可能
document.getElementById('capture').addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = 'snapshot.png';
    a.click();
});
