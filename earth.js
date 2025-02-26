import * as THREE from 'three';

const earthGroup = new THREE.Group();

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(0.2, 10);
const material = new THREE.MeshPhongMaterial({
    map: loader.load("./assets/texture_earth/earthmap1k.jpg"),
    specularMap: loader.load("./assets/texture_earth/earthspec1k.jpg"),
    color: 0xf7f7f7,
    specular: 0xffffff,
    shininess: 3,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./assets/texture_earth/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    blending: THREE.AdditiveBlending,
    map: loader.load("./assets/texture_earth/earthcloudmap.jpg"),

});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.015);
earthGroup.add(cloudsMesh);

export { earthGroup };
