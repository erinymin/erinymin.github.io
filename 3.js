import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const div = document.querySelector('.threewrapper');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(75, div.clientWidth / div.clientHeight, 0.1, 1000);
const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const controls = new OrbitControls(camera, renderer.domElement);
let loadedModel;

function setScene() {
  renderer.shadowMap.enabled = true;
  renderer.setSize(div.clientWidth, div.clientHeight);
  div.appendChild(renderer.domElement);

  scene.add(light);
  scene.add(directionalLight);
  scene.background = new THREE.Color('white');

  camera.position.set(3, 3, 3);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = div.clientWidth / div.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(div.clientWidth, div.clientHeight);
}

function addModel() {
  loader.load('goodjob.glb', function (gltf) {
    loadedModel = gltf.scene;
    loadedModel.position.set(0, 0, 0);
    scene.add(loadedModel);
  }, undefined, function (error) {
    console.error(error);
  });
}

setScene();
addModel();

function animate() {
  requestAnimationFrame(animate);
  if (loadedModel) {
    loadedModel.rotation.y += 0.005;
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();