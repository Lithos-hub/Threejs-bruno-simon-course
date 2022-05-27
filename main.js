import "./style.css";
import * as THREE from "three";
// ** import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

// ? |||||||| SIZES ||||||||
// ** Sizes and resize event
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ? |||||||| SCENE & CAMERA ||||||||

// ** Scene
const scene = new THREE.Scene();

// ** Camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0.5;
camera.position.y = 0.5;
camera.position.z = 1;

scene.add(camera);

// ** Axes helper
const axesHelper = new THREE.AxesHelper(1.5); // Length as parameter
scene.add(axesHelper);

// ? |||||||| OBJECTS & MATERIALS & MESHES, ETC ||||||||

// ** Group
const group = new THREE.Group();
scene.add(group);

// ** Objects
const cube = new THREE.BoxGeometry(1, 1, 1);

const groupCube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x2b384b }),
);
const groupCube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xcec058 }),
);

groupCube1.position.set(1.5, -1, -1)
groupCube2.position.set(-0.5, -1, -1)

group.position.set(0, 1, 0)
group.rotation.set(2, 1.5, 0)
group.add(groupCube1);
group.add(groupCube2);

// ** Materials
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "#1d2828",
});

// ** Meshes
const cubeMesh = new THREE.Mesh(cube, cubeMaterial);
scene.add(cubeMesh);

// ** Position
cubeMesh.position.set(1, -0.7, -0.5); // X, Y, Z

// ** Scale
cubeMesh.scale.set(2, 0.5, 0.5); // X, Y, Z

// ** Rotation
cubeMesh.rotation.reorder('YXZ');
cubeMesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0); // X, Y, Z

// ** Camera controls
// camera.lookAt(cubeMesh.position);

// ? |||||||| RENDER ||||||||

// ** Canvas and renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

camera.position.setZ(2);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
