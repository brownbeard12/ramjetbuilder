import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import GUI from "lil-gui";

const gui = new GUI();

const obj = {
  xDim: 1.0,
  yDim: 1.0,
  zDim: 1.0,
};

const coneGUI = {
  coneRAD: 2.0,
  coneHT: 4.0,
  diffAngle: "",
  diffPos: 0.0,
};

coneGUI.diffAngle =
  2 * (180 / Math.PI) * Math.atan(coneGUI.coneRAD / coneGUI.coneHT);

const scene = new THREE.Scene();

const loader = new RGBELoader();

loader
  .setPath("src/assets/")
  .load("kloppenheim_06_puresky_4k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    scene.backgroundIntensity = 0.6;
  });

const sky = new THREE.HemisphereLight(0xffffff, 0xffffff, 20);
scene.add(sky);

const light1 = new THREE.PointLight(0xffffff, 20, 1000);
light1.position.set(-10, -1, 0);
light1.add(
  new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
);
//scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 20, 1000);
light2.position.set(3, 0, 8);
light2.add(
  new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
);
//scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const margin = 50;
renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const coneGeo = new THREE.ConeGeometry(2, 4, 128, 16);
const coneMat = new THREE.MeshPhysicalMaterial({
  color: 0xbbbcc4,
  roughness: 0.2,
  metalness: 1.0,
});
let diffuser = new THREE.Mesh(coneGeo, coneMat);
diffuser.rotation.x = Math.PI / 2;
diffuser.position.z = coneGUI.diffPos;
scene.add(diffuser);

let bodyOuterDiam = 8.0;
let bodyThickness = 0.5;
const bodyCross = [
  new THREE.Vector2(bodyOuterDiam / 2, 0),
  new THREE.Vector2(bodyOuterDiam / 2, 0),
  new THREE.Vector2(bodyOuterDiam / 2 - 0.5 * bodyThickness, 12),
  new THREE.Vector2(bodyOuterDiam / 2 - 0.5 * bodyThickness, 12),
  new THREE.Vector2(bodyOuterDiam / 2 - bodyThickness, 12),
  new THREE.Vector2(bodyOuterDiam / 2 - bodyThickness, 12),
  new THREE.Vector2(bodyOuterDiam / 2 - bodyThickness, 0),
  new THREE.Vector2(bodyOuterDiam / 2 - bodyThickness, 0),
  new THREE.Vector2(bodyOuterDiam / 2, 0),
];
const jetBodyGeo = new THREE.LatheGeometry(bodyCross, 128);
const jetBody = new THREE.Mesh(jetBodyGeo, coneMat);
jetBody.rotation.x = -Math.PI / 2;
scene.add(jetBody);

camera.position.z = 50;

gui.add(coneGUI, "coneRAD", 1.0, 3.0, 0.1).onChange((val) => {
  coneGUI.coneRAD = val;
  regen(diffuser, coneGUI);
});
gui.add(coneGUI, "coneHT", 1.0, 5.0, 0.1).onChange((val) => {
  coneGUI.coneHT = val;
  regen(diffuser, coneGUI);
});
gui.add(coneGUI, "diffAngle").listen().decimals(2);
gui.add(coneGUI, "diffPos", -2, 5, 0.1).onChange((val) => {
  coneGUI.diffPos = val;
  regen(diffuser, coneGUI);
});

renderer.render(scene, camera);

let i = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
  renderer.render(scene, camera);
}

function regen(mesh, val) {
  scene.remove(mesh);
  diffuser = new THREE.Mesh(
    new THREE.ConeGeometry(val.coneRAD, val.coneHT, 128, 16),
    coneMat
  );
  diffuser.rotation.x = Math.PI / 2;
  diffuser.position.z = val.diffPos - val.coneHT / 2;
  scene.add(diffuser);
  coneGUI.diffAngle = 2 * (180 / Math.PI) * Math.atan(val.coneRAD / val.coneHT);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateGeometry(mesh, geo) {
  mesh.geometry.dispose();
  mesh.geometry = geo;
}

window.addEventListener("resize", onWindowResize);
animate();
