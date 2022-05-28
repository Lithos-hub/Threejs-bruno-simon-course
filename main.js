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
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight)

const pointLight = new THREE.PointLight("white", 0.5);

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(pointLight);

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./img/textures/matcap.jpg');
const ceramicTexture = textureLoader.load('./img/textures/ceramic.jpg');
const rockTexture = textureLoader.load('./img/textures/rock.jpg');
const earthTexture = textureLoader.load('./img/textures/earth.jpg');
const paperTexture = textureLoader.load('./img/textures/paper.jpg');
const gradientTexture = textureLoader.load('./img/textures/gradient1.jpg');
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
const brickTexture = textureLoader.load('./img/textures/brick.jpg');
const brickTextureAO = textureLoader.load('./img/textures/brick-ao.jpg');
const brickNormalMap = textureLoader.load('./img/textures/brick-normalmap.png');
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  './img/environmentMaps/2/px.jpg', // Right (positive x)
  './img/environmentMaps/2/nx.jpg', // Left   (negative x) 
  './img/environmentMaps/2/py.jpg', // Top    (positive y)
  './img/environmentMaps/2/ny.jpg', // Bottom (negative y)
  './img/environmentMaps/2/pz.jpg', // Front  (positive z)
  './img/environmentMaps/2/nz.jpg', // Back   (negative z)
]);

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials
// const ceramicMaterial = new THREE.MeshBasicMaterial({
  // color: "#2173f7",
  // map: ceramicTexture,
  // alpha: true,
  // transparent: true,
  // opacity: 0.8,
  // alphaMap: ceramicTexture,
  // side: THREE.FrontSide,
// });

// const material = new THREE.MeshNormalMaterial({
//   wireframe: true
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// });

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: "red"
// });

// const material = new THREE.MeshToonMaterial({
//   map: gradientTexture
// });

// const material = new THREE.MeshStandardMaterial({
//   metalness: 0.4,
//   roughness: 0.6,
//   map: brickTexture,
//   aoMap: brickTextureAO,
//   aoMapIntesity: 10,
//   displacementMap: brickTexture,
//   wireframe: false,
//   displacementScale: 0.01,
//   metalnessMap: brickTexture,
//   roughnessMap: brickTexture,
//   normalMap: brickTexture,
// });
// material.normalScale.set(0.8, 0.8);

const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  envMap: environmentMapTexture,
});

// const rockMaterial = new THREE.MeshNormalMaterial({
//   map: rockTexture,
//   wireframe: true,
//   flatShading: true
// });

// const paperMaterial = new THREE.MeshBasicMaterial({
//   map: paperTexture,
//   side: THREE.DoubleSide,
// });

// ** Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material,
);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.1, 64, 128),
  material
);

sphere.geometry.setAttribute(
  "uv2", 
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  "uv2", 
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2", 
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

// ** Meshes
scene.add(sphere, plane, torus);

// ** Position
sphere.position.x -= 2;
torus.position.x = 2;

// ** Scale


// ** Rotation


// ** Camera controls
// camera.lookAt(geometryMoonMesh.position);

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
let dTheta = 2 * Math.PI / 500;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();
  

  // Update camera


  // Update objects
  sphere.rotation.y += dTheta;
  plane.rotation.y += dTheta;
  torus.rotation.y += dTheta;

  sphere.rotation.x += dTheta;
  plane.rotation.x += dTheta;
  torus.rotation.x += dTheta;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);
gui.add(material, 'aoMapIntensity', 0, 10, 0.001);
gui.add(material, 'displacementScale', 0, 10, 0.001);