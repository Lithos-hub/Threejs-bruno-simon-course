import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

const canvas = document.querySelector(".webgl");

const useHelpers = false;

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

const ambientLight = new THREE.AmbientLight("white", 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.2);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

scene.add(directionalLight);

const spotLight = new THREE.SpotLight("white", 0.2, 10, Math.PI * 0.3);
spotLight.position.set(-2, 2, 0);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 20;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
scene.add(spotLight, spotLight.target);

const pointLight = new THREE.PointLight("white", 0.5);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

// ** Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

if (useHelpers)
  scene.add(directionalLightHelper, spotLightHelper, pointLightCameraHelper);

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("./img/shadows/bakedShadow.jpg");
const simpleShadow = textureLoader.load("./img/shadows/simpleShadow.jpg");

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials
const material = new THREE.MeshStandardMaterial({
  roughness: 0.7,
});

// ** Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.castShadow = true; // ! Only 3 lights supports shadows: point, directional and spot

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 32, 32),
  // new THREE.MeshBasicMaterial({
  //   map: bakedShadow,
  // })
  material
);
plane.receiveShadow = true;

plane.rotation.x = -Math.PI * 0.5;
plane.position.set(0, -0.5, 0);

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: "black",
    transparent: true, // => Mandatory when using alphaMap
    alphaMap: simpleShadow,
  })
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow);

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
renderer.shadowMap.enabled = false; // => Use shadows

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
  sphere.position.x = Math.cos(elapsedTime) * 1.5; // => Orbital movement
  sphere.position.z = Math.sin(elapsedTime) * 1.5; // => Orbital movement
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) // => Bounces on the floor

  // Update shadow texture
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;


  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
gui.add(directionalLight, "intensity", 0, 1, 0.00001);
gui.add(directionalLight.position, "x", -5, 5, 0.0001);
gui.add(directionalLight.position, "y", -5, 5, 0.0001);
