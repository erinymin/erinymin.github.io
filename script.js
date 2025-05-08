function setup() {
  createCanvas(900, 650, WEBGL);

  // Create and style a status paragraph element
  statusP = createP("Initializing FaceMesh...");
  statusP.position(10, 10);
  statusP.style("color", "white");
  statusP.style("font-size", "16px");

  // Make the status text disappear after 15 seconds (15000 ms)
  setTimeout(() => {
    statusP.hide();
  }, 15000);

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
