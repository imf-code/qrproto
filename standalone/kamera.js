// Grab HTML elements
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const button = document.querySelector('button');

// Init
button.onclick = snapshot;

// Global variables
const ctx = canvas.getContext('2d');
let stream;

// Setup preview
const constraints = window.constraints = {
    audio: false,
    video: true
}
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        stream = window.stream = mediaStream;
        video.srcObject = mediaStream;
        video.play();
    })
    .catch(err => console.log(err));

/** Take a snapshot */
function snapshot() {
    const vTrack = stream.getVideoTracks()[0];
    const frame = new ImageCapture(vTrack);

    frame.grabFrame()
        .then(function (bitmap) {

            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            canvas.getContext('2d').drawImage(bitmap, 0, 0);
            const imgData = ctx.getImageData(220, 140, 200, 200);
            const result = jsQr(imgData, 200, 200);

            if (result) {
                console.log(result.data);
                return;
            }
            else {
                setTimeout(snapshot, 1000 / 10);
            }
        })
        .catch(err => console.log(err));
}