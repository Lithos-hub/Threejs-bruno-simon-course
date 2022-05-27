import "./style.css";
import * as THREE from "three";
// ** import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

// ? |||||||| SIZES ||||||||
// ** Sizes and resize event
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

// ** Scene
const scene = new THREE.Scene();

// ** Camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.setZ(2);

scene.add(camera);

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group
const group = new THREE.Group();
scene.add(group);

// ** Objects
const cube = new THREE.BoxGeometry(1, 1, 1);

// ** Materials
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "#d63b3b",
});

// ** Meshes
const cubeMesh = new THREE.Mesh(cube, cubeMaterial);
scene.add(cubeMesh);

// ** Position
cubeMesh.position.set(0, 0, 0); // X, Y, Z

// ** Scale
cubeMesh.scale.set(1, 1, 1); // X, Y, Z

// ** Rotation
// cubeMesh.rotation.reorder('YXZ');
cubeMesh.rotation.set(0, 0, 0); // X, Y, Z

// ** Camera controls
// camera.lookAt(cubeMesh.position);

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock();

gsap.to(cubeMesh.position, {
  duration: 1,
  delay: 1,
  x: 2
});

// ? |||||||| ANIMATIONS ||||||||

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  cubeMesh.rotation.x = elapsedTime;
  cubeMesh.rotation.z = elapsedTime;
  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime);
  // camera.lookAt(cubeMesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
