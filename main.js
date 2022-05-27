import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector(".webgl");

// ? |||||||| SIZES ||||||||
// ** Sizes and resize event
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ? |||||||| CURSOR ||||||||

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // => If the device has a pixel ration over 2, we'll take 2
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
})

// ? |||||||| SCENE & CAMERA ||||||||

// ** Scene
const scene = new THREE.Scene();

// ** Cameras

const camera = new THREE.PerspectiveCamera(
  75, // => FOV
  sizes.width / sizes.height, // => Aspect ratio
  0.1, // => Near
  100 // => Far
);

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

camera.position.setZ(3);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

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
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock();

// gsap.to(cubeMesh.position, {
//   duration: 1,
//   delay: 1,
//   x: 2
// });

// ? |||||||| ANIMATIONS ||||||||

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();
  

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(cubeMesh.position);

  // Update objects
  // cubeMesh.rotation.x = elapsedTime;
  // cubeMesh.rotation.y = elapsedTime;
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);
  // camera.lookAt(cubeMesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
