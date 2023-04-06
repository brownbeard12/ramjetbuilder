import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { HemisphereLight } from 'three';

const gui = new GUI();

const obj = {
    xDim: 1.0,
    yDim: 1.0,
    zDim: 1.0,
};

const scene = new THREE.Scene();

const sky = new THREE.HemisphereLight(0xffffff, 0xffffff, 5);
scene.add(sky);

const light1 = new THREE.PointLight(0xffffff, 20, 100);
light1.position.set(-10, -1, 0);
light1.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffffff })))
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 20, 100);
light2.position.set(3, 0, 8);
light2.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffffff })))
scene.add(light2);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const margin = 50;
renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
document.body.appendChild(renderer.domElement);

const ambLight = new THREE.HemisphereLight(0x000000, 0xffffff, 1);
scene.add(ambLight);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

gui.add(obj, 'xDim', 0.5, 3.0).onChange(val => { obj.xDim = val; regen(cube, obj) });
gui.add(obj, 'yDim', 0.5, 3.0).onChange(val => { obj.yDim = val; regen(cube, obj) });
gui.add(obj, 'zDim', 0.5, 3.0).onChange(val => { obj.zDim = val; regen(cube, obj) });

let i = 0;

function animate() {
    requestAnimationFrame(animate);
    renderer.setSize(window.innerWidth - margin, window.innerHeight - margin);
    renderer.render(scene, camera);

    light1.position.x = 3 * Math.sin(i * Math.PI);
    light1.position.y = 3 * Math.cos(i * Math.PI);

    light2.position.x = 4 * Math.sin(i * Math.PI);
    light2.position.z = 4 * Math.cos(i * Math.PI);

    i += 0.001;
}

function regen(mesh, val) {
    scene.remove(mesh);
    cube = new THREE.Mesh(new THREE.BoxGeometry(obj.xDim, obj.yDim, obj.zDim), material);
    scene.add(cube);
}

animate();