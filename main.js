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

// ? |||||||| SCREEN EVENTS ||||||||

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

// ** Mouse controls
let currentIntersect = null

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
})

window.addEventListener("click", () => {
  if (currentIntersect && currentIntersect.object === sphere1) {
    console.log('Click on sphere 1')
  }
})

// ** Cameras

const camera = new THREE.PerspectiveCamera(
  75, // => FOV
  sizes.width / sizes.height, // => Aspect ratio
  0.1, // => Near
  100 // => Far
);

camera.position.setZ(8);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(8); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

// ? |||||||| TEXTURES ||||||||

// ? |||||||| PARTICLES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

// ** Objects
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "gold" })
)
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "gold" })
)
const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "gold" })
)

sphere1.position.x = -3
sphere2.position.x = 0
sphere3.position.x = 3

scene.add(sphere1, sphere2, sphere3);

const rayCaster = new THREE.Raycaster();

/*

// ! We need an origin and a direction
const rayCasterOrigin = new THREE.Vector3(-5, 0, 0);
const rayCasterDirection = new THREE.Vector3(10, 0, 0);
rayCasterDirection.normalize() // => Convert the vector to a vector with the same direction but with a length of 1

rayCaster.set(rayCasterOrigin, rayCasterDirection);

const intersect = rayCaster.intersectObject(sphere2);
console.log(intersect)

const intersects = rayCaster.intersectObjects([sphere1, sphere2, sphere3]);
console.log(intersects)

*/

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


// ? |||||||| ANIMATIONS ||||||||
// Clock
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit controls
  controls.update();

  // Update objects
  // sphere1.position.y = Math.cos(elapsedTime) * 6;
  // sphere1.position.y = Math.sin(Math.PI * 2) * 6;
  
  // sphere3.position.y = Math.cos(elapsedTime) * 3;
  // sphere3.position.y = Math.sin(elapsedTime) * 3;

  sphere1.position.y = Math.sin(elapsedTime) * 6;
  sphere2.position.y = Math.sin(elapsedTime) * 7;
  sphere3.position.y = Math.sin(elapsedTime) * 3;

  // Cast a ray
  /*
  const rayOrigin = new THREE.Vector3(-6, 0, 0)
  const rayDirection = new THREE.Vector3(1, 0, 0)
  rayDirection.normalize()

  rayCaster.set(rayOrigin, rayDirection);

  const objectsToTest = [sphere1, sphere2, sphere3];

  const intersects = rayCaster.intersectObjects(objectsToTest);

  objectsToTest.forEach(object => {
    object.material.color.set("gold")
  })

  intersects.forEach(intersect => {
    intersect.object.material.color.set("red")
  })

  console.log(intersects.length)
  */

  // Cast a ray

  rayCaster.setFromCamera(mouse, camera);

  const objectsToTest = [sphere1, sphere2, sphere3];
  const intersects = rayCaster.intersectObjects(objectsToTest);

  objectsToTest.forEach(object => {
    object.material.color.set("gold")
  })

  intersects.forEach(intersect => {
    intersect.object.material.color.set("red")
  })

  if (intersects.length) {
    if (!currentIntersect) { // => Mouse enter

    }
    currentIntersect = intersects[0]
  } else {
    if (currentIntersect) { // => Mouse leave

    }
  }

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
