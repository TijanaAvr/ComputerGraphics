import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(25, 25, 25);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);


const textureLoader = new THREE.TextureLoader();


const grassTexture = textureLoader.load("textures/grass.jpg");
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(4, 4);

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ map: grassTexture })
);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);


const roadTexture = textureLoader.load("textures/road.jpg");
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 4);

const roadMaterial = new THREE.MeshStandardMaterial({
  map: roadTexture,
  roughness: 0.9,
});

const verticalRoad = new THREE.Mesh(
  new THREE.BoxGeometry(6, 0.1, 40),
  roadMaterial
);
verticalRoad.position.y = 0.05;
scene.add(verticalRoad);

const horizontalRoad = new THREE.Mesh(
  new THREE.BoxGeometry(40, 0.1, 6),
  roadMaterial
);
horizontalRoad.position.y = 0.05;
scene.add(horizontalRoad);


const brickTexture = textureLoader.load("textures/brick.jpg");
brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(2, 2);

const brickMaterial = new THREE.MeshStandardMaterial({
  map: brickTexture,
});

const building1 = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  brickMaterial
);
building1.position.set(-7, 3, -7);
building1.userData.number = "816";
scene.add(building1);

const building2 = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  brickMaterial
);
building2.position.set(7, 3, -7);
building2.userData.number = "817";
scene.add(building2);

const building3 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 5, 4),
  brickMaterial
);
building3.position.set(-10, 2.5, 15);
building3.userData.number = "815";
scene.add(building3);

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.4,
  roughness: 0.1,
});

const building4 = new THREE.Mesh(
  new THREE.BoxGeometry(4, 5, 10),
  glassMaterial
);
building4.position.set(10, 2.5, 8);
building4.userData.number = "814";
scene.add(building4);


const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "TreeModel/scene.gltf", 
  (gltf) => {
    const tree = gltf.scene;
    tree.scale.set(0.03, 0.03, 0.03);
    tree.position.set(12, 0, -14);
    tree.rotation.y = Math.PI / 3;
    scene.add(tree);
  },
  undefined,
  (error) => console.error("Error loading GLTF model:", error)
);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([
    building1,
    building2,
    building3,
    building4,
  ]);

  if (intersects.length > 0) {
    alert("Building number: " + intersects[0].object.userData.number);
  }
});


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
  requestAnimationFrame(animate);

  building1.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();
