import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
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
const axesHelper = new THREE.AxesHelper(2); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./img/textures/matcap2.png');

// ? |||||||| FONTS ||||||||
const fontLoader = new FontLoader();

fontLoader.load("./fonts/helvetiker_regular.typeface.json", (loadedFont) => {
  const textGeometry = new TextGeometry("Learning Three.js", {
    font: loadedFont,
    size: 1,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 64,
  });
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.1) * 0.5, // => minus bebelSize
  //   -(textGeometry.boundingBox.max.y - 0.1) * 0.5, // => minus bebelSize
  //   -(textGeometry.boundingBox.max.z - 0.05) * 0.5 // => minus bebelThickness
  // )
  textGeometry.center() // => Do the same of above

  const textMesh = new THREE.Mesh(textGeometry, material);
  scene.add(textMesh);
});

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials
const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

// ** Objects
const starGeometry = new THREE.SphereGeometry(0.5, 32, 32);

for (let i = 0; i < 10000; i++) {
  const star = new THREE.Mesh(starGeometry, material);
  star.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  star.rotation.set(
    (Math.random() - 0.5) * Math.PI,
    (Math.random() - 0.5) * Math.PI,
    (Math.random() - 0.5) * Math.PI
  );
  const randomNum = Math.random() * 0.1;
  star.scale.set(randomNum, randomNum, randomNum);
  scene.add(star);
}

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

  // Update camera

  // Update objects

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
