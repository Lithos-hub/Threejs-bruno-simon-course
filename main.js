import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { DoubleSide } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const canvas = document.querySelector(".webgl");

// ? |||||||| DRACO Loader ||||||||
const DRACO = new DRACOLoader();
DRACO.setDecoderPath("/static/draco/");
// ? |||||||| GLTF Loader ||||||||
const gltf = new GLTFLoader();
gltf.setDRACOLoader(DRACO);

let mixer = null

gltf.load("./static/models/kitchen/kitchen.glb", (model) => {
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
  
  // mixer = new THREE.AnimationMixer(model.scene);
  // const action = mixer.clipAction(model.animations[2]);
  // action.play()
  
  // model.scene.scale.set(1, 1, 1);
  scene.add(model.scene);

  model.scene.rotation.y = Math.PI * 1.5;

  updateAllMaterials()
});

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
  35, // => FOV
  sizes.width / sizes.height, // => Aspect ratio
  0.1, // => Near
  1000 // => Far
);

camera.position.set(6, 8, 8);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| TEXTURE ||||||||

const environmentMap = new THREE.CubeTextureLoader().load([
  "./static/cubemap/px.png",
  "./static/cubemap/nx.png",
  "./static/cubemap/py.png",
  "./static/cubemap/ny.png",
  "./static/cubemap/pz.png",
  "./static/cubemap/nz.png",
]);


// ? |||||||| LIGHTS ||||||||

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-3, 2, 0);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 3, 0);

scene.add(directionalLight, pointLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
scene.add(directionalLightHelper);

// ? |||||||| TEXTURES ||||||||

// ? |||||||| PARTICLES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

// ** Meshes

const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    side: DoubleSide,
  })
);

floorMesh.rotation.x = Math.PI * 0.5;

scene.add(floorMesh);
// ** Position

// ** Scale

// ** Rotation

// ** Camera controls


// ? |||||||| UPDATE MATERIALS ||||||||
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMap = environmentMap
      child.material.envMapIntensity = 1.25
    }
  })
}

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
let previousTime = 0

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Update mixer
  if (mixer !== null) mixer.update(deltaTime)

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
const debugObject = {}

gui.add(directionalLight.position, "x", -10, 10, 0.001).name("Dir. Light Position X")
gui.add(directionalLight, 'intensity', 0, 10, 0.001).name("Dir. Light Intensity")
