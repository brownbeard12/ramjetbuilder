import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();

const obj = {
    xDim: 1.0,
    yDim: 1.0,
    zDim: 1.0,
};

const scene = new THREE.Scene();

const light1 = new THREE.PointLight(0xffffff, 20, 100);
light1.position.set(-3, -1, 5);
light1.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffffff })))
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 20, 100);
light2.position.set(3, 3, 8);
light2.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffffff })))
scene.add(light2);

const ambLight = new THREE.AmbientLight(0x404040);
scene.add(ambLight);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const margin = 50;
renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

gui.add(obj, 'xDim', 0.5, 3.0).onChange( val => { obj.xDim = val; regen(cube, obj) });
gui.add(obj, 'yDim', 0.5, 3.0).onChange( val => { obj.yDim = val; regen(cube, obj) });
gui.add(obj, 'zDim', 0.5, 3.0).onChange( val => { obj.zDim = val; regen(cube, obj) });

function animate() {
    requestAnimationFrame(animate);
    renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
    renderer.render(scene, camera);

}

function regen(mesh, val) {
    scene.remove(mesh);
    cube = new THREE.Mesh(new THREE.BoxGeometry(obj.xDim, obj.yDim, obj.zDim), material);
    scene.add(cube);
}

animate();