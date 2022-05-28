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

// window.addEventListener('dblclick', () => {
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen();
//   } else {
//     document.exitFullscreen();
//   }
// })

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

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

camera.position.setZ(80);
camera.position.setY(5);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| TEXTURES ||||||||
// const image = new Image()
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// }
// image.src = './img/textures/textureWood.jpg';
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => console.log('LOADING MANAGER - Start loading');
loadingManager.onLoad = () => console.log('LOADING MANAGER - Loaded');
loadingManager.onProgress = () => console.log('LOADING MANAGER - Progress');
loadingManager.onError = () => console.log('LOADING MANAGER - Error');

const textureLoader = new THREE.TextureLoader(loadingManager)
const textureMoon = textureLoader.load('./img/textures/moon.jpg',
  // () => console.log('Loading texture...'),
  // () => console.log('Progress texture...'),
  // () => console.log('Error when loading texture.'),
  )
const textureEarth = textureLoader.load('./img/textures/earth.jpg');
const textureWood = textureLoader.load('./img/textures/wood.jpg');

textureWood.repeat.x = 2;
textureWood.repeat.y = 3;
textureWood.wrapS = THREE.MirroredRepeatWrapping;
textureWood.wrapT = THREE.MirroredRepeatWrapping;

textureWood.offset.x = 0.5; // => Texture replacement to the right
textureWood.rotation = 1;

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group
const group = new THREE.Group();
scene.add(group);

// ** Objects
const geometryMoon = new THREE.SphereGeometry(1, 64, 64);
const geometryEarth = new THREE.SphereGeometry(1, 64, 64);
const geometryCube = new THREE.BoxGeometry(1, 1, 1);

// const geometryMoon = new THREE.BuffergeometryMoon();

// ** Materials
const materialMoon = new THREE.MeshBasicMaterial({
  wireframe: false,
  map: textureMoon,
});
const materialEarth = new THREE.MeshBasicMaterial({
  wireframe: false,
  map: textureEarth,
});
const materialCube = new THREE.MeshBasicMaterial({
  wireframe: false,
  map: textureWood,
});

// ** Meshes
const geometryMoonMesh = new THREE.Mesh(geometryMoon, materialMoon);
const geometryEarthMesh = new THREE.Mesh(geometryEarth, materialEarth);
const geometryCubeMesh = new THREE.Mesh(geometryCube, materialCube);
scene.add(geometryMoonMesh);
scene.add(geometryEarthMesh);
scene.add(geometryCubeMesh);

// ** Position
geometryMoonMesh.position.set(5, 0, -5); // X, Y, Z
geometryEarthMesh.position.set(0, 0, 0); // X, Y, Z

// ** Scale
geometryMoonMesh.scale.set(1, 1, 1); // X, Y, Z
geometryEarthMesh.scale.set(5, 5, 5); // X, Y, Z

// ** Rotation
// geometryMoonMesh.rotation.reorder('YXZ');
geometryMoonMesh.rotation.set(0, 0, 0); // X, Y, Z
geometryEarthMesh.rotation.set(0, 0, 0.1); // X, Y, Z

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

// gsap.to(geometryMoonMesh.position, {
//   duration: 1,
//   delay: 1,
//   x: 2
// });

// ? |||||||| ANIMATIONS ||||||||

let theta = 0;
let dTheta = 2 * Math.PI / 1000;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();
  

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(geometryMoonMesh.position);

  // Update objects
  // geometryMoonMesh.rotation.x = elapsedTime;
  geometryEarthMesh.rotation.y -= 0.01
  theta += dTheta * 2;
  geometryMoonMesh.rotation.x += 0.01;
  geometryMoonMesh.position.x = 35 * Math.cos(theta);
  geometryMoonMesh.position.y = 35 * Math.cos(theta) / 2;
  geometryMoonMesh.position.z = 35 * Math.sin(theta);
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.y = Math.cos(elapsedTime);
  // camera.lookAt(geometryEarthMesh.position);

  // ! Important: Use textures with a width and height power of 2 (512 x 512, 1024 x 1024, etc.)

  
  textureEarth.generateMipmaps = false; // => Will not divide the texture to mipmaps. We'll gain at performance
  textureEarth.minFilter = THREE.NearestFilter // => Used when the objects is very far. The texture will be sharper
  textureEarth.magFilter = THREE.NearestFilter // => Used when the objects is very close or the texture image is very small. The texture will be sharper

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| DEBUG ||||||||
const gui = new dat.GUI({ closed: true, width: 500 });
gui.hide();

const debugObject = {
  color: "#d63b3b",
  spin: () => gsap.to(geometryMoonMesh.rotation, { duration: 1, y: geometryMoonMesh.rotation.y + 10 }),
}
// => object and property to add, name of property, min, max and step
gui.add(geometryMoonMesh.position, 'y', -3, 3, 0.01).name('Cube Y');
gui.add(geometryMoonMesh.position, 'x', -3, 3, 0.01).name('Cube X');
gui.add(geometryMoonMesh.position, 'z', -3, 3, 0.01).name('Cube Z');
gui.add(geometryMoonMesh, 'visible').name('Cube visibility');
gui.add(materialMoon, 'wireframe').name('Cube wireframe');

gui.add(debugObject, 'spin').name('Cube spin');

gui
.addColor(debugObject, 'color')
.name('Cube color')
.onChange(() => materialMoon.color.set(debugObject.color));
// gui.add(geometryMoonMesh.position, 'y').min(-3).max(3).step(0.01);
// gui.add(geometryMoonMesh.position, 'x').min(-3).max(3).step(0.01);
// gui.add(geometryMoonMesh.position, 'z').min(-3).max(3).step(0.01);
