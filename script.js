let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 5, refineLandmarks: false, flipped: false };

let uvMapImage;
let triangulation;
let uvCoords;

let statusP;
let saveButton;
let imagesGallery = [];

function preload() {
    faceMesh = ml5.faceMesh(options);
    uvMapImage = loadImage("tomato.jpeg");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    statusP = createP("Initializing FaceMesh...");
    statusP.position(10, 10);
    statusP.style("color", "white");
    statusP.style("font-size", "16px");

    video = createCapture(VIDEO, function () {
        video.size(windowWidth, windowHeight);
        video.hide();
    });

    saveButton = createButton("take a photo!");
    saveButton.position(width / 2 - 60, height - 40);
    saveButton.mousePressed(saveImage);

    faceMesh.detectStart(video, gotFaces);
    triangulation = faceMesh.getTriangles();
    uvCoords = faceMesh.getUVCoords();
}

function draw() {
    background(30);
    translate(-width / 2, -height / 2);

    push();
    translate(width, 0);
    scale(-1, 1);

    if (video) {
        image(video, 0, 0, width, height);
    }

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

    if (faces.length > 0) {
        statusP.html(faces.length + " face(s) detected! Rendering...");
    } else {
        statusP.html("No face detected. Please align your face with the camera.");
    }
}

function gotFaces(results) {
    faces = results;
}

function saveImage() {
    let img = get();
    imagesGallery.push(img);
    img.save("captured-image", "jpg");
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (video) {
        video.size(windowWidth, windowHeight);
    }
    saveButton.position(width / 2 - 60, height - 40);
}
