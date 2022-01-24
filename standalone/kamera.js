// Grab HTML elements
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const button = document.querySelector('button');

// Init
button.onclick = readqr;

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

/** Start reading QR */
function readqr() {
    const vTrack = stream.getVideoTracks()[0];
    const frame = new ImageCapture(vTrack);

    frame.grabFrame()
        .then(function (bitmap) {

            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            // Draw frame on canvas + aiming rect 
            canvas.getContext('2d').drawImage(bitmap, 0, 0);
            const imgData = ctx.getImageData(120, 40, 400, 400);
            ctx.beginPath();
            ctx.rect(120, 40, 400, 400);
            ctx.stroke();

            const result = jsQR(imgData.data, 400, 400);

            // Loop until qr is read
            if (result) {
                console.log(result.data);
                return;
            }
            else {
                setTimeout(readqr, 1000 / 30);
            }
        })
        .catch(err => console.log(err));
}

/**  */
function readloop() {
    const vTrack = stream.getVideoTracks()[0];
    const frame = new ImageCapture(vTrack);

    frame.grabFrame()
        .then(function (bitmap) {

            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            // Draw frame on canvas + aiming rect 
            canvas.getContext('2d').drawImage(bitmap, 0, 0);
            const imgData = ctx.getImageData(120, 40, 400, 400);
            ctx.beginPath();
            ctx.rect(120, 40, 400, 400);
            ctx.stroke();

            const result = jsQR(imgData.data, 400, 400);

            // Loop until qr is read
            if (result) {
                console.log(result.data);
                return;
            }
            else {
                setTimeout(readqr, 1000 / 24);
            }
        })
        .catch(err => console.log(err));
}