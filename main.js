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
  10000 // => Far
);

camera.position.setY(7);
camera.position.setZ(8);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| GROUPS ||||||||
const galaxies = new THREE.Group();
scene.add(galaxies);

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('./img/star.png');

// ? |||||||| PARTICLES ||||||||
// ** Galaxy
const parameters = {};
parameters.size = 0.01;
parameters.radius = 10;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.65;
(parameters.randomnessPow = 5), 4;
parameters.insideColor = "#dd4646";
parameters.outsideColor = "#2ec8d1";
parameters.numOfStars = 50000;
parameters.galaxyWeight = 10000;
parameters.numOfGalaxies = 200;

let galaxyGeometry = null;
let starGeometry = null;
let material = null;
let stars = null;

const generateStars = () => {
    // Destroy previous galaxy
    if (starGeometry) {
      starGeometry.dispose(); // => Destroy the element
      material.dispose(); // => Destroy the element
      scene.remove(galaxies); // => Remove the element from the scene
    }
    // Destroy previous galaxy
    starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.galaxyWeight * 3);
    
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      map: starTexture,
      size: 2,
      color: "#45b9c1",
      transparent: true,
      alphaMap: starTexture,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    for (let i = 0; i < parameters.numOfStars; i++) {
      const i3 = i * 3;

      positions[i3 + 0] = (Math.random() - 0.5) * 1000;
      positions[i3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;

    }
    const points = new THREE.Points(starGeometry, material);
    scene.add(points);
}

const generateGalaxy = () => {
  // Destroy previous galaxy
  if (stars) {
    galaxyGeometry.dispose(); // => Destroy the element
    material.dispose(); // => Destroy the element
    scene.remove(stars); // => Remove the element from the scene
  }
  galaxyGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.galaxyWeight * 3);

  const colors = new Float32Array(parameters.galaxyWeight * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.galaxyWeight; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // => X
    positions[i3 + 1] = randomY; // => Y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // => Z

    const mixedColor = colorInside
      .clone()
      .lerp(colorOutside, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r; // => R
    colors[i3 + 1] = mixedColor.g; // => G
    colors[i3 + 2] = mixedColor.b; // => B
  }

  for (let i = 0; i < parameters.numOfGalaxies; i++) {

  galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    map: starTexture,
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  
    stars = new THREE.Points(galaxyGeometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = 100 * 0.75 + Math.random() * (100 * 0.25);
    const x = Math.sin(Math.random(angle) * i) * radius * 5;
    const z = Math.sin(angle * i) * radius * 5;
    const y = Math.cos(Math.random(angle) * i) * radius * 5;

    
    stars.position.set(x, y, z)
    
    stars.rotation.x = (Math.random() - 0.5) * 50;
    stars.rotation.y = (Math.random() - 0.5) * 50;
    stars.rotation.z = (Math.random() - 0.5) * 50;
    
    galaxies.add(stars);
  }
};

generateGalaxy();
generateStars();


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
  galaxies.rotation.y += 0.0001;
  galaxies.rotation.z += 0.0001;
  // Render
  renderer.render(scene, camera);
  renderer.needsUpdate = true;

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI({ width: 500 });
gui.add(parameters, "size", 0, 0.5).step(0.0001).onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius", 0.01, 20)
  .step(0.0001)
  .onFinishChange(generateGalaxy);
gui.add(parameters, "branches", 2, 20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "spin", -5, 5).step(0.001).onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness", 0, 2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPow", 1, 10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
gui.add(parameters, "numOfStars", 0, 10000).step(50).onFinishChange(generateGalaxy); // => When the value is setted (onChange when is being setting)
gui.add(parameters, "numOfGalaxies", 1, 50, 1).onFinishChange(generateGalaxy);
