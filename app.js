const video = document.querySelector("#videoElement");
const overlay = document.getElementById('overlayImage');
let scale = 1;

// カメラアクセス
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;
    })
    .catch(function(error) {
        console.log("Something went wrong!");
    });

document.getElementById('zoomIn').addEventListener('click', () => {
    scale *= 1.1;
    overlay.style.transform = `scale(${scale})`;
});

document.getElementById('zoomOut').addEventListener('click', () => {
    scale /= 1.1;
    overlay.style.transform = `scale(${scale})`;
});

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
