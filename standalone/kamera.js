// Grab HTML elements
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const button = document.querySelector('button');

// Init + global var
button.onclick = snapshot;
canvas.hidden = true;
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
            canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
            const imgData = canvas.getContext('2d').getImageData();
            console.log(imgData);
        })
        .catch(err => console.log(err));
}