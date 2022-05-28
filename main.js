import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { DirectionalLight } from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

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

camera.position.setZ(15);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

const ambientLight = new THREE.AmbientLight("white", 0.5); // => Color and intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.5);
directionalLight.position.set(3, 1, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight("green", "blue", 0.3);
hemisphereLight.position.set(0, 2, 0);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight("red", 1, 10, 2);
pointLight.position.set(0, -0.5, 2);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight("white", 20, 5, 5);
rectAreaLight.position.set(-2, 0, -8);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight("white", 1, 10, 10, 2); // => color, intensity, angle, penumbra, decay
spotLight.position.set(0, 0, 2);
spotLight.target.position.x = -1;
scene.add(spotLight.target, spotLight); 
// => Important. The spotlight is watching to a theorical object. 
// In order to modify the position of the spotlight, we must to 
// include to the scene that theorical object

// ! Lights performances:
// ** Low cost: Ambient, hemisphere
// ** moderate cost: directional and point
// ** high cost: spot and rect area

// ** Helpers
const hemisLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// ? |||||||| TEXTURES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials
const material = new THREE.MeshStandardMaterial({
  roughness: 0.1,
  metalness: 0.8,
  doubleSide: true,
});

// ** Objects
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  material
);
const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.5, 16, 100),
  material
);
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10, 10),
  material
);

scene.add(sphereMesh, cubeMesh, torusMesh, planeMesh);

// ** Position
sphereMesh.position.set(-5, 0, 0);
cubeMesh.position.set(0, 0, 0);
torusMesh.position.set(5, 0, 0);
planeMesh.position.set(0, -1, 0);
// ** Scale

// ** Rotation
// planeMesh.rotation.y = 90;
planeMesh.rotation.x = -1.55;

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
let dTheta = (2 * Math.PI) / 390;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();

  // Update objects
  sphereMesh.rotation.y += 0.01;
  sphereMesh.rotation.x += 0.01;
  cubeMesh.rotation.y += 0.01;
  cubeMesh.rotation.x += 0.01;
  torusMesh.rotation.y += 0.01;
  torusMesh.rotation.x += 0.01;
  rectAreaLight.rotation.y -= dTheta;
  rectAreaLight.position.x = -Math.sin(elapsedTime) * 10;
  rectAreaLight.position.z = -Math.cos(elapsedTime) * 10;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
  spotLightHelper.update();
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
gui.add(ambientLight, "intensity", 0, 1, 0.001);
