import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const light1 = new THREE.PointLight(0xff0000, 50, 100);
light1.position.set(1, 1, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xff0000, 20, 100);
light2.position.set(3, 3, 8);
scene.add(light2);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const margin = 50;
renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.render(scene, camera);
}

animate();