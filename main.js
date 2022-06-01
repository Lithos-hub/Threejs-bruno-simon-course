import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { DoubleSide } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const canvas = document.querySelector(".webgl");

// ? |||||||| DRACO Loader ||||||||
const DRACO = new DRACOLoader();
DRACO.setDecoderPath('/static/draco/')
// ? |||||||| GLTF Loader ||||||||
const gltf = new GLTFLoader();
gltf.setDRACOLoader(DRACO);

gltf.load(
  './static/models/Duck/glTF-Draco/Duck.gltf',
  (model) => {
    // ! Method 1 (Wrong)
    // model.scene.children.forEach(model => scene.add(model)) // => Doesn't add the full mesh
    
    // ! Method 2 (Correct - We take the length of the array)
    // while(model.scene.children.length) {
    //   scene.add(model.scene.children[0]);
    // }

    // ! Method 3 (Correct - We duplicate the array)
    // const children = [...model.scene.children];
    // children.forEach(child => scene.add(child));

    // ! Method 4 (Correct - We add the whole scene)
    scene.add(model.scene);
  }
)


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

camera.position.set(5, 5, 7);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-4, 4, 0);

scene.add(ambientLight, directionalLight);

// ? |||||||| TEXTURES ||||||||

// ? |||||||| PARTICLES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

// ** Meshes

const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, side: DoubleSide })
);

floorMesh.rotation.x = Math.PI * 0.5;

scene.add(floorMesh)
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

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
