let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 5, refineLandmarks: false, flipped: false };

let uvMapImage;

let triangulation;
let uvCoords;

// DOM elements
let statusP;
let cameraButton;
let saveButton;
let imagesGallery = [];

function preload() {
    faceMesh = ml5.faceMesh(options);
    uvMapImage = loadImage("tomato.jpeg");
}

function setup() {
    createCanvas(900, 650, WEBGL);

    // Create and style a status paragraph element
    statusP = createP("Initializing FaceMesh...");
    statusP.position(10, 10);
    statusP.style("color", "white");
    statusP.style("font-size", "16px");

    // Start the webcam capture
    video = createCapture(VIDEO, function () {
        video.size(900, 650);
        video.hide();
    });

    // Button to save the captured image
    saveButton = createButton("take a photo!");
    saveButton.position(width / 2 - 60, height - 30);
    saveButton.mousePressed(saveImage);

    // Start detecting faces from the webcam video
    faceMesh.detectStart(video, gotFaces);

    // Get the coordinates for the UV mapping
    triangulation = faceMesh.getTriangles();
    uvCoords = faceMesh.getUVCoords();
}

function draw() {
    background(30);
    translate(-width / 2, -height / 2); // Reset origin to top-left for 2D drawing

    // Mirror the video and drawing
    push();
    translate(width, 0); // Move to the right edge
    scale(-1, 1); // Flip horizontally

    // Draw the mirrored webcam feed
    if (video) {
        image(video, 0, 0, width, height);
    }

    // Draw face mesh overlays
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];

        noStroke();
        texture(uvMapImage);
        textureMode(NORMAL);
        beginShape(TRIANGLES);
        for (let j = 0; j < triangulation.length; j++) {
            let indexA = triangulation[j][0];
            let indexB = triangulation[j][1];
            let indexC = triangulation[j][2];

            let a = face.keypoints[indexA];
            let b = face.keypoints[indexB];
            let c = face.keypoints[indexC];

            const uvA = { x: uvCoords[indexA][0], y: uvCoords[indexA][1] };
            const uvB = { x: uvCoords[indexB][0], y: uvCoords[indexB][1] };
            const uvC = { x: uvCoords[indexC][0], y: uvCoords[indexC][1] };

            vertex(a.x, a.y, uvA.x, uvA.y);
            vertex(b.x, b.y, uvB.x, uvB.y);
            vertex(c.x, c.y, uvC.x, uvC.y);
        }
        endShape();
    }
    pop();

    // Update status message
    if (faces.length > 0) {
        statusP.html(faces.length + " face(s) detected! Rendering...");
    } else {
        statusP.html("No face detected. Please align your face with the camera.");
    }
}

// FaceMesh callback
function gotFaces(results) {
    faces = results;
}

// Save current frame and show + fade-out text
function saveImage() {
    let img = get();
    imagesGallery.push(img);
    img.save("captured-image", "jpg");

    // Get overlay text element
    let overlayText = document.getElementById("overlayText");
    if (overlayText) {
        overlayText.style.display = "block";  // show it
        overlayText.style.opacity = "1";      // reset opacity in case of re-click
        overlayText.classList.remove("fade-out"); // reset any old animation

        // Trigger fade-out animation
        void overlayText.offsetWidth;  // force reflow to restart animation
        overlayText.classList.add("fade-out");

        // Fully hide after 20 seconds
        setTimeout(() => {
            overlayText.style.display = "none";
            overlayText.classList.remove("fade-out");
        }, 40000);
    }
}
