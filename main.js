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

camera.position.setZ(10);
camera.position.setY(5);
camera.position.setX(5);

scene.add(camera);

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Axes helper
const axesHelper = new THREE.AxesHelper(10); // Length as parameter
scene.add(axesHelper);

// ? |||||||| GROUPS ||||||||
const house = new THREE.Group();
const bushes = new THREE.Group();
const graves = new THREE.Group();
scene.add(house, bushes, graves);

// ? |||||||| TEXTURES ||||||||

// ** Door
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./img/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./img/textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "./img/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./img/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./img/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./img/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./img/textures/door/roughness.jpg"
);

// ** Bricks
const brickColorTexture = textureLoader.load("./img/textures/bricks/color.jpg");
const brickAoTexture = textureLoader.load("./img/textures/bricks/ambientOcclusion.jpg");
const brickNormalTexture = textureLoader.load("./img/textures/bricks/normal.jpg");
const brickRoughnessTexture = textureLoader.load(
  "./img/textures/bricks/roughness.jpg"
);

// ** grass
const grassColorTexture = textureLoader.load("./img/textures/grass/color.jpg");
const grassAoTexture = textureLoader.load("./img/textures/grass/ambientOcclusion.jpg");
const grassNormalTexture = textureLoader.load("./img/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "./img/textures/grass/roughness.jpg"
);

// ** Leaves
const leavesColorTexture = textureLoader.load("./img/textures/leaves/color.jpg");

// ** Graves
const graveColorTexture = textureLoader.load("./img/textures/graves/color.jpg");

const textures = [
  grassColorTexture,
  grassAoTexture,
  grassNormalTexture,
  grassRoughnessTexture
]

textures.forEach(texture => {
  texture.repeat.set(10, 10)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
})

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||
// ** Materials

// ** Objects
// ! ------------------- Sizes ------------------- ? //

const floorWidthHeight = 20;

const wallsHeight = 3;
const wallsWidthX = 5;
const wallsWidthZ = 4;

const roofHeight = 1;

const doorHeight = 1.5;

const bushHeight = 0.5;

const graveHeight = 0.8;

// ? ------------------- Walls ------------------- ? //
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallsWidthX, wallsHeight, wallsWidthZ),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAoTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
);

// ? ------------------- Floor ------------------- ? //
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorWidthHeight, floorWidthHeight),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAoTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

// ? ------------------- Roof ------------------- ? //
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(wallsWidthX * 0.75, roofHeight, 4),
  new THREE.MeshStandardMaterial({
    color: "brown",
  })
);
// ? ------------------- Door ------------------- ? //
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorHeight, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAoTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
// ? ------------------- Bushes and leaves ------------------- ? //
const bushGeometry = new THREE.SphereGeometry(bushHeight, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#36912f",
});

const staticBush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const staticBush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const staticBush3 = new THREE.Mesh(bushGeometry, bushMaterial);
const staticBush4 = new THREE.Mesh(bushGeometry, bushMaterial);
staticBush1.position.set(wallsWidthX * 0.25, bushHeight / 2, wallsWidthX * 0.45);
staticBush2.position.set(-wallsWidthX * 0.25, bushHeight / 2, wallsWidthX * 0.45);
staticBush3.position.set(wallsWidthX * 0.35, bushHeight / 2, wallsWidthX * 0.45);
staticBush4.position.set(-wallsWidthX * 0.4, bushHeight / 2, wallsWidthX * 0.45);
staticBush1.scale.set(0.9, 0.9, 0.9);
staticBush2.scale.set(0.75, 0.75, 0.75);
staticBush3.scale.set(0.7, 0.7, 0.7)
staticBush4.scale.set(1.1, 1.1, 1.1)

const leavesGeometry = new THREE.ConeGeometry(0.5, 0.5, 4);
const leavesMaterial = new THREE.MeshStandardMaterial({
  map: leavesColorTexture,
});

const count = 10;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < 40; i++) {
  const angle = Math.random() * Math.PI * 2;
  const bushSize = Math.random() * 0.5 + 0.5;
  const radius = wallsWidthX * 0.5 + Math.random() * (floorWidthHeight * 0.25);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  
  for (let j = 0; j < count * 3 * 3; j++) {
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    positionsArray[i] = (Math.random() - 0.5) * 1.5;
  
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    leavesGeometry.setAttribute("position", positionsAttribute);

    leaves.position.set(x, graveHeight * 0.25, z);
    leaves.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    
    leaves.scale.set(bushSize + 0.1, bushSize + 0.1, bushSize + 0.1);
    leaves.castShadow = true;
    bushes.add(leaves);
  }
  
  bush.position.set(x, graveHeight * 0.25, z);
  bush.scale.set(bushSize * 0.8, bushSize * 0.8, bushSize * 0.8);
  bushes.castShadow = true;
  bushes.add(bush);
}

// ? ------------------- Graves ------------------- ? //
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture
});

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = wallsWidthX * 0.75 + Math.random() * (floorWidthHeight * 0.25);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, graveHeight * 0.25, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.5;
  grave.rotation.x = (Math.random() - 0.5) * 0.5;
  grave.castShadow = true;
  graves.add(grave);
}

// ? ------------------- Adding to the group ------------------- ? //
house.add(floor, walls, roof, door, bushGeometry, staticBush1, staticBush2, staticBush3, staticBush4);

// ** Position, Scale, rotation
floor.rotation.x = -Math.PI * 0.5;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

walls.position.y = wallsHeight / 2;
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

roof.position.y = wallsHeight + roofHeight / 2;
roof.rotation.y = Math.PI * 0.25;

door.position.y = doorHeight - 0.5;
door.position.z = wallsWidthZ * 0.5 + 0.00001;
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

// ? |||||||| LIGHTS ||||||||
// ** Ambient
const ambientLight = new THREE.AmbientLight("#7dd5db", 0.1);

// ** Moon
const moonLight = new THREE.DirectionalLight("white", 0.1);
moonLight.position.set(4, 5, -2);

// ** Door
const doorLight = new THREE.PointLight("#e34f26", 1, 7);
doorLight.position.set(0, doorHeight + 1, wallsWidthX / 2);

// ** Ghosts
const ghost1 = new THREE.PointLight("#33d6c8", 4, 3);
const ghost2 = new THREE.PointLight("#c4488a", 4, 3);
const ghost3 = new THREE.PointLight("#63c43c", 4, 3);


scene.add(ambientLight, moonLight, ghost1, ghost2, ghost3);
house.add(doorLight);

// ? |||||||| FOG ||||||||
const fog = new THREE.Fog(
  "#2b2d38",
  floorWidthHeight * 0.1,
  floorWidthHeight * 0.7
);
scene.fog = fog;

// ** Camera controls

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#2b2d38");

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

  // Update ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * (floorWidthHeight * 0.3);
  ghost1.position.z = Math.sin(ghost1Angle) * (floorWidthHeight * 0.4);
  ghost1.position.y = Math.abs(Math.sin(elapsedTime) * 2);

  const ghost2Angle = -elapsedTime * 0.5
  ghost2.position.x = Math.cos(ghost2Angle) * (floorWidthHeight * 0.2);
  ghost2.position.z = Math.sin(ghost2Angle) * (floorWidthHeight * 0.5);
  ghost2.position.y = Math.abs(Math.sin(elapsedTime) * 2); + Math.sin(elapsedTime) * 2;

  const ghost3Angle = elapsedTime * 0.2
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.3));
  ghost3.position.z = Math.sin(ghost3Angle) * (floorWidthHeight * 0.45);
  ghost3.position.y = Math.abs(Math.sin(elapsedTime) * 1.5); + Math.sin(elapsedTime) * 1.7;

  // Render
  renderer.render(scene, camera);
  
  // Shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  moonLight.castShadow = true
  doorLight.castShadow = true
  ghost1.castShadow = true
  ghost2.castShadow = true
  ghost3.castShadow = true

  walls.castShadow = true;

  staticBush1.castShadow = true;
  staticBush2.castShadow = true;
  staticBush3.castShadow = true;
  staticBush4.castShadow = true;

  floor.receiveShadow = true;

  doorLight.shadow.mapSize.width = 256
  doorLight.shadow.mapSize.height = 256
  doorLight.shadow.camera.far = 7

  ghost1.shadow.mapSize.width = 256
  ghost1.shadow.mapSize.height = 256
  ghost1.shadow.camera.far = 7

  ghost2.shadow.mapSize.width = 256
  ghost2.shadow.mapSize.height = 256
  ghost2.shadow.camera.far = 7

  ghost3.shadow.mapSize.width = 256
  ghost3.shadow.mapSize.height = 256
  ghost3.shadow.camera.far = 7

  window.requestAnimationFrame(animate);
};

animate();

// ? |||||||| GUI ||||||||
const gui = new dat.GUI();
gui.add(ambientLight, "intensity", 0, 1, 0.0001);
gui.add(moonLight, "intensity", 0, 1, 0.0001);
gui.add(moonLight.position, "x", -5, 5, 0.0001);
gui.add(moonLight.position, "y", -5, 5, 0.0001);
gui.add(moonLight.position, "z", -5, 5, 0.0001);
