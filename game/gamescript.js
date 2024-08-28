import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(10, 15, 10); // Position the camera above and to the side
camera.lookAt(0, 0, 0);

renderer.render(scene, camera);
renderer.setClearColor(0x2ecc71)


const geometry = new THREE.SphereGeometry(1, 32, 32); // (radius, widthSegments, heightSegments)
const material = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 8, 7.5); // Position it in a way that mimics sunlight
scene.add(directionalLight);

const cubegeo = new THREE.BoxGeometry(2, 2, 2);
const cubemat = new THREE.MeshStandardMaterial({color: 0x3498db });
const cube = new THREE.Mesh(cubegeo, cubemat);
cube.position.set(0, 0, 0);
scene.add(cube);

// map border
const linemat = new THREE.LineBasicMaterial({ color : 0x0000ff });
const line1points = [];
line1points.push(new THREE.Vector3(-200, 0, 200));
line1points.push(new THREE.Vector3(-200, 0, -200));
const line1geo = new THREE.BufferGeometry().setFromPoints(line1points);
const line1 = new THREE.Line(line1geo, linemat);
scene.add(line1);
const line2points = [];
line2points.push(new THREE.Vector3(200, 0, -200));
line2points.push(new THREE.Vector3(-200, 0, -200));
const line2geo = new THREE.BufferGeometry().setFromPoints(line2points);
const line2 = new THREE.Line(line2geo, linemat);
scene.add(line2);
const line3points = [];
line3points.push(new THREE.Vector3(200, 0, -200));
line3points.push(new THREE.Vector3(200, 0, 200));
const line3geo = new THREE.BufferGeometry().setFromPoints(line3points);
const line3 = new THREE.Line(line3geo, linemat);
scene.add(line3);
const line4points = [];
line4points.push(new THREE.Vector3(200, 0, 200));
line4points.push(new THREE.Vector3(-200, 0, 200));
const line4geo = new THREE.BufferGeometry().setFromPoints(line4points);
const line4 = new THREE.Line(line4geo, linemat);
scene.add(line4);

// movement
var moveSpeed = 10;
const clock = new THREE.Clock();
var delta;

// Movement direction tracking
const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false
};
// bounds of map area
const mapBounds = {
    xMin: -250,
    xMax: 250,
    zMin: -250,
    zMax: 250,
    yMin: 0,  
    yMax: 50  
};

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { // W
        movement.forward = true;
    } else if (keyCode == 83) { // S
        movement.backward = true;
    } else if (keyCode == 65) { // A
        movement.left = true;
    } else if (keyCode == 68) { // D
        movement.right = true;
    } 
}

function onDocumentKeyUp(event) {
    var keyCode = event.which;
    if (keyCode == 87) { // W
        movement.forward = false;
    } else if (keyCode == 83) { // S
        movement.backward = false;
    } else if (keyCode == 65) { // A
        movement.left = false;
    } else if (keyCode == 68) { // D
        movement.right = false;
    } 
}

// make sure camera follows player
function updateCameraPosition() {
    camera.position.x = sphere.position.x + 10;  // Adjust these values based on desired camera angle
    camera.position.z = sphere.position.z + 10;
    camera.lookAt(sphere.position);
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();

    // Apply movement
    if (movement.forward && sphere.position.z - moveSpeed * delta > mapBounds.zMin) {
        console.log("w");
        sphere.position.z -= moveSpeed * delta;
    }
    if (movement.backward && sphere.position.z + moveSpeed * delta < mapBounds.zMax) {
        console.log("s");
        sphere.position.z += moveSpeed * delta;
    }
    if (movement.left && sphere.position.x - moveSpeed * delta > mapBounds.xMin) {
        console.log("a");
        sphere.position.x -= moveSpeed * delta;
    }
    if (movement.right && sphere.position.x + moveSpeed * delta < mapBounds.xMax) {
        console.log("d");
        sphere.position.x += moveSpeed * delta;
    }

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
    updateCameraPosition();
}
animate();