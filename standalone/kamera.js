// Grab HTML elements
const canvas = document.querySelector('canvas');
const button = document.querySelector('button');
const video = document.querySelector('video');

// Bind controls
button.onclick = readQR;

// Global variables
const ctx = canvas.getContext('2d');
let stream;

// Setup <video> preview of camera feed (not actually necessary)
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

/** Start looking for a QR code */
function readQR() {
    const videoTrack = stream.getVideoTracks()[0]; // Assumes track 0 is the right camera
    const trackCapture = new ImageCapture(videoTrack);

    readLoop(trackCapture);
}

/** Update canvas preview and attempt to read QR until one is found 
 * @param capturedTrack An ImageCapture of a MediaStreamTrack
*/
function readLoop(capturedTrack) {

    capturedTrack.grabFrame()
        .then(function (bitmap) {

            // Draw a frame on canvas + aiming rectangle
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            
            const rectX = (bitmap.width - 400) / 2;
            const rectY = (bitmap.height - 400) / 2;

            canvas.getContext('2d').drawImage(bitmap, 0, 0);
            ctx.beginPath();
            ctx.rect(rectX, rectY, 400, 400);
            ctx.stroke();

            // Attempt to find a QR code inside aiming rect
            const imgData = ctx.getImageData(rectX, rectY, 400, 400);
            const result = jsQR(imgData.data, 400, 400);

            // Loop until QR is found
            if (result) {
                console.log(result.data);
                return;
            }
            else {
                setTimeout(() => readQR(capturedTrack), 1000 / 30); // 30fps
            }
        })
        .catch(err => console.log(err));
}