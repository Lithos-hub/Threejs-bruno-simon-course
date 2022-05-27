import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

// ? |||||||| SIZES ||||||||
// Sizes and resize event
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ? |||||||| SCENE & CAMERA ||||||||

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

scene.add(camera);

// ? |||||||| OBJECTS & MATERIALES & MESHES ||||||||

// Objects
const sphere = new THREE.SphereBufferGeometry(5, 64, 64);

// Materials
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: "#1d2828"
});

// Meshes
const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
scene.add(sphereMesh);

// ? |||||||| RENDER ||||||||

// Canvas and renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

camera.position.setZ(10);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
