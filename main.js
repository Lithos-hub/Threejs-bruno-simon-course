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
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);



const geometry = new THREE.BufferGeometry();

const count = 5000;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i <= count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

// ** Materials
const geoMaterial = new THREE.MeshBasicMaterial({
  color: "#d63b3b",
  wireframe: true,
});

// ** Meshes
const geometryMesh = new THREE.Mesh(geometry, geoMaterial);
scene.add(geometryMesh);

// ** Position
geometryMesh.position.set(0, 0, 0); // X, Y, Z

// ** Scale
geometryMesh.scale.set(1, 1, 1); // X, Y, Z

// ** Rotation
// geometryMesh.rotation.reorder('YXZ');
geometryMesh.rotation.set(0, 0, 0); // X, Y, Z

// ** Camera controls
// camera.lookAt(geometryMesh.position);

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock();

// gsap.to(geometryMesh.position, {
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
  // camera.lookAt(geometryMesh.position);

  // Update objects
  // geometryMesh.rotation.x = elapsedTime;
  // geometryMesh.rotation.y = elapsedTime;
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);
  // camera.lookAt(geometryMesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
