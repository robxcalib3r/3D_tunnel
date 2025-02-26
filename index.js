import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from "./spline.js";
import { earthGroup } from "./earth.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Create a curve from the spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(geometry, material);
// scene.add(line);

// create a tube geometry
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshBasicMaterial({
    color: 0x0099ff,
    side: THREE.DoubleSide,
    wireframe: true,
});
const tube = new THREE.Mesh(tubeGeo, tubeMat);
// scene.add(tube);

// create edges geometry form the spline
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
});
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

// const numBoxes = 55;
// const size = 0.075;
// const boxGeo = new THREE.BoxGeometry(size, size, size);
// for (let i = 0; i < numBoxes; i += 1) {
//     const boxMat = new THREE.MeshBasicMaterial({
//         color: 0xffffff,
//         wireframe: true,
//     });
//     const box = new THREE.Mesh(boxGeo, boxMat);
//     const p = (i / numBoxes + Math.random() * 0.1) % 1;
//     const pos = tubeGeo.parameters.path.getPointAt(p);
//     pos.x += Math.random() * 0.4;
//     pos.z += Math.random() * 0.4;
//     box.position.copy(pos);
//     const rote = new THREE.Vector3(
//         Math.random() * Math.PI,
//         Math.random() * Math.PI,
//         Math.random() * Math.PI,
//     );
//     box.rotation.set(rote.x, rote.y, rote.z);
//     const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
//     const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
//     const lineMat = new THREE.LineBasicMaterial({ color });
//     const boxLines = new THREE.LineSegments(edges, lineMat);
//     boxLines.position.copy(pos);
//     boxLines.rotation.set(rote.x, rote.y, rote.z);
//     scene.add(boxLines);
// }

// add earth in spline positions
const numEarths = 10;
for (let i = 0; i < numEarths; i += 1) {
    const earth = earthGroup.clone();
    const p = (i / numEarths + Math.random() * 0.1) % 1;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    earth.position.copy(pos);
    scene.add(earth);
}

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemiLight);

function updateCamera(t) {
    const time = t * 0.3;
    const looptime = 20 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.01) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

function animate(t = 0) {
    requestAnimationFrame(animate);
    updateCamera(t);
    renderer.render(scene, camera);
    controls.update();
}

animate();
