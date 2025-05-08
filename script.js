function setup() {
  createCanvas(900, 650, WEBGL);

  statusP = createP("Initializing FaceMesh...");
  statusP.position(10, 10);
  statusP.style("color", "white");
  statusP.style("font-size", "16px");

  setTimeout(() => {
    statusP.hide();
  }, 15000);

  video = createCapture(VIDEO, function () {
    video.size(900, 650);
    video.hide();
  });

  saveButton = createButton("take a photo!");
  saveButton.position(width / 2 - 60, height - 30);
  saveButton.mousePressed(saveImage);

  faceMesh.detectStart(video, gotFaces);

  triangulation = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

let overlayText = document.getElementById("overlayText");
if (overlayText) {
  overlayText.classList.add("fade-out");
}
