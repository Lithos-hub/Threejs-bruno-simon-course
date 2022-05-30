import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // => If the device has a pixel ratio over 2, we'll take 2
});

// ? |||||||| SCENE & CAMERA ||||||||

// ** Scene
const scene = new THREE.Scene();

// ** Cameras

const cameraGroup = new THREE.Group();
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(
  35, // => FOV
  sizes.width / sizes.height, // => Aspect ratio
  0.1, // => Near
  1000 // => Far
);

camera.position.setZ(5);

cameraGroup.add(camera);

// ** Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
// scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3, 5, 0);
scene.add(directionalLight);

// ? |||||||| TEXTURES ||||||||
const textureLoader = new THREE.TextureLoader();
const gradient1 = textureLoader.load("./img/textures/gradient1.jpg");
gradient1.magFilter = THREE.NearestFilter;
const gradient2 = textureLoader.load("./img/textures/gradient2.jpg");
gradient2.magFilter = THREE.NearestFilter;

// ? |||||||| PARTICLES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

const parameters = {
  materialColor: "#ffffff",
};

const toonMaterial = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  map: gradient2,
});

// ** Objects

const objectsDistance = 5;

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.2, 16, 100),
  toonMaterial
);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 32), toonMaterial);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.9, 0.2, 100, 32),
  toonMaterial
);

mesh1.position.y = -objectsDistance * 0;
mesh1.position.x = 1;
mesh2.position.y = -objectsDistance * 1;
mesh2.position.x = -1;
mesh3.position.y = -objectsDistance * 2;
mesh3.position.x = 1;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

// ** Particles
const numParticles = 1000
const positions = new Float32Array(numParticles * 3);



for (let i = 0; i < numParticles; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 10
  positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i3 + 2] = (Math.random() - 0.5) * 10
}

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const geometryMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.01,
  });

  const particles = new THREE.Points(geometry, geometryMaterial);


  scene.add(particles)


// ** Meshes

// ** Position

// ** Scale

// ** Rotation

// ** Camera controls

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock();

let previusTime = 0

// ? |||||||| ANIMATIONS ||||||||

let scrollY = null;
let currentSection = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (currentSection !== newSection) {
    currentSection = newSection;
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power1.inOut",
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    })
  }

})

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previusTime
  previusTime = elapsedTime

  // Update objects
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.5;
    mesh.rotation.y += deltaTime * 0.5;
  }

  // Update camera
  camera.position.y = -scrollY / sizes.height * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
gui
  .addColor(parameters, "materialColor")
  .onChange(() => { 
    toonMaterial.color.set(parameters.materialColor)
    geometryMaterial.color.set(parameters.materialColor)
  });
