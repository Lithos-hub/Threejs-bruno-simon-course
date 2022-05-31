import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import CANNON from "cannon";

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

camera.position.setX(5);
camera.position.setY(5);
camera.position.setZ(7);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| LIGHTS ||||||||

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(-4, 5, 0);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

scene.add(ambientLight, directionalLight);

// ? |||||||| PHYSICS ||||||||

//* World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // ! => For performance reasons
world.allowSleep = true // ! => When the object is not moving, there won't be any CPU intersect calculation
world.gravity.set(0, -9.82, 0); // => -9.82 is the gravity in the Earth

// * Materials
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");
const defaultMaterial = new CANNON.Material("default");

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

world.defaultContactMaterial = defaultContactMaterial;

// world.addContactMaterial(concretePlasticContactMaterial);
world.addContactMaterial(defaultContactMaterial);

//* Sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   // material: defaultMaterial,
// });
// world.addBody(sphereBody);

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  // material: defaultMaterial,
});

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
world.addBody(floorBody);

// ? |||||||| SOUNDS ||||||||
const hitSound = new Audio('/sounds/hit.mp3');

const playSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  console.log(Math.round(impactStrength))
  if (impactStrength > 1.5) {
    hitSound.volume = 1 - (Math.round(impactStrength) / 100)
    hitSound.currentTime = 0
    setTimeout(() => {
      hitSound.play()
    }, 10)
    console.log('Volume: ', hitSound.volume)
  }
};


// ? |||||||| PARTICLES ||||||||

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group

// ** Materials

// ** Objects
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     color: "#491631",
//     roughness: 0.1,
//   })
// );

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10, 10),
  new THREE.MeshStandardMaterial({
    color: "#d3dae5",
    roughness: 0.2,
    metalness: 0.2,
    side: THREE.DoubleSide,
  })
);

// sphere.castShadow = true;
plane.receiveShadow = true;

// sphere.position.y = 0.5;
plane.rotation.x = -Math.PI * 0.5;

scene.add(plane);

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

renderer.shadowMap.enabled = true;

// Clock
const clock = new THREE.Clock();

let previusTime = 0;

// ? |||||||| UTILS ||||||||
const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#491631",
  metalness: 0.1,
  roughness: 0.1,
});

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: "#491631",
  metalness: 0.1,
  roughness: 0.1,
});

const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);

  body.addEventListener('collide', playSound)
  world.addBody(body);

  // Save in obectsToUpdate
  objectsToUpdate.push({
    mesh,
    body,
  });
};

createSphere(0.5, { x: 0, y: 5, z: 0 });

const createBox = (size, position) => {
  let { width, height, depth } = size
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)); // => In CANNON, the size of the box is measured from the center of the box to the sides
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });

  body.addEventListener('collide', playSound)
  body.position.copy(position);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  });
};

createBox({ width: 3, height: 2, depth: 4}, { x: 0, y: 5, z: 0 });

// ? |||||||| ANIMATIONS ||||||||

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previusTime;
  previusTime = elapsedTime;

  // Orbit controls
  controls.update();

  //* Update physics world
  world.step(1 / 60, deltaTime, 3);

  // sphere.position.copy(sphereBody.position); // => Same of below
  // sphere.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z);

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 5,
    z: 0,
  });
};
debugObject.createBox = () => {
  createBox({ width: Math.random() * 0.5, height: Math.random() * 0.5, depth: Math.random() * 0.5 }, {
    x: (Math.random() - 0.5) * 3,
    y: 5,
    z: 0,
  });
};
debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    object.body.removeEventListener('collide', playSound)
    world.removeBody(object.body);
    scene.remove(object.mesh)
  }
  objectsToUpdate.splice(0, objectsToUpdate.length);
}
gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");
gui.add(debugObject, "reset");
