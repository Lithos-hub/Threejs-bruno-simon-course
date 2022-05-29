import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

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

// ? |||||||| SCENE & CAMERA ||||||||

// ** Scene
const scene = new THREE.Scene();

// ** Cameras

const camera = new THREE.PerspectiveCamera(
  75, // => FOV
  sizes.width / sizes.height, // => Aspect ratio
  0.1, // => Near
  1000 // => Far
);

camera.position.setZ(5);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('./img/textures/particle.jpg');

// ? |||||||| PARTICLES ||||||||
const particlesGeometry = new THREE.BufferGeometry();

const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
)


const particlesMaterial = new THREE.PointsMaterial({
  color: "white",
  size: 0.05,
  sizeAttenuation: true,
  map: particleTexture,
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.5,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);
// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

// ** Objects

// ** Meshes

// ** Position

// ** Scale

// ** Rotation

// ** Camera controls

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock();

// ? |||||||| ANIMATIONS ||||||||

let theta = 0;
let dTheta = (2 * Math.PI) / 500;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();

  // Update particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particlesGeometry.attributes.position.array[i3 + 0];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); // Y axis

  }
  particlesGeometry.attributes.position.needsUpdate = true;
  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
