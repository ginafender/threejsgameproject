import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x5dade2);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 32, 32); // (radius, width, height)
const material = new THREE.MeshStandardMaterial({ color: 0xeb984e  });
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.set(0, 1, 0);
scene.add(sphere);

// sphere collision
let sphereColl = new THREE.Sphere(sphere.position, 1);

// Set initial camera position behind and above the player
camera.position.set(0, 10, 25);
controls.enableKeys = false;
controls.minPolarAngle = 0; // Looking straight up
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 5;
controls.maxDistance = 30;
renderer.render(scene, camera);
controls.update();

controls.mouseButtons.RIGHT = THREE.MOUSE.RIGHT;
controls.mouseButtons.LEFT = THREE.MOUSE.LEFT;
controls.mouseButtons.MIDDLE = THREE.MOUSE.MIDDLE;
controls.mouseButtons = {
	LEFT: THREE.MOUSE.NONE,
	MIDDLE: THREE.MOUSE.NONE,
	RIGHT: THREE.MOUSE.ROTATE
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 200, -250); 
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 1; 
directionalLight.shadow.camera.far = 500; 
directionalLight.shadow.camera.left = -250;
directionalLight.shadow.camera.right = 250;
directionalLight.shadow.camera.top = 250;
directionalLight.shadow.camera.bottom = -250;
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

// floor geometry (width, height, width, height)
const floorGeometry = new THREE.PlaneGeometry(500, 500);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Add cubes to the scene
const cubegeo = new THREE.BoxGeometry(2, 2, 2);
const cubemat = new THREE.MeshStandardMaterial({ color: 0x3498db });
const cubes = [];
const cubePositions = [
    [10, 1, 10], [-10, 1, -10], [-10, 1, 10], [10, 1, -10]
];

cubePositions.forEach((pos) => {
    const cube = new THREE.Mesh(cubegeo, cubemat);
    cube.position.set(...pos);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cubes.push(cube);
    scene.add(cube);
});

// Map borders
const linemat = new THREE.LineBasicMaterial({ color: 0x0000ff });
const borderPoints = [
    [[-200, 0, 200], [-200, 0, -200]],
    [[-200, 0, -200], [200, 0, -200]],
    [[200, 0, -200], [200, 0, 200]],
    [[200, 0, 200], [-200, 0, 200]]
];

borderPoints.forEach((points) => {
    const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
    const line = new THREE.Line(geo, linemat);
    scene.add(line);
});

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

controls.saveState();
function onDocumentKeyDown(event) {
    controls.reset();
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

let lastPosition = new THREE.Vector3();

// Initially save the player's initial position
lastPosition.copy(sphere.position);
let isMoving = false;

function updateCameraPosition() {
    const direction = new THREE.Vector3();
    sphere.getWorldDirection(direction);
    const offset = -25;  // Distance behind the player
    const height = 10;   // Height above the player
    // Check if the sphere has moved
    if (!sphere.position.equals(lastPosition)) {
        camera.position.set(
            sphere.position.x - direction.x * offset,
            sphere.position.y + height,
            sphere.position.z - direction.z * offset
        );
        camera.lookAt(sphere.position);
        isMoving = true;
        lastPosition.copy(sphere.position);
        controls.enabled = false;
    } else {
        if (isMoving) {
            // Enable orbit controls when the sphere stops moving
            controls.target.copy(sphere.position);
            controls.enabled = true;
            controls.update();
            isMoving = false;
        } else {
            controls.update();
        }
    }
}
function checkCollisions(){

}

// Render loop
function animate() {
    window.requestAnimationFrame(animate);
    delta = clock.getDelta();
    if (movement.forward && sphere.position.z - moveSpeed * delta > mapBounds.zMin) {
        // console.log("w");
        sphere.position.z -= moveSpeed * delta;}
    if (movement.backward && sphere.position.z + moveSpeed * delta < mapBounds.zMax) {
        // console.log("s");
        sphere.position.z += moveSpeed * delta;}
    if (movement.left && sphere.position.x - moveSpeed * delta > mapBounds.xMin) {
        // console.log("a");
        sphere.position.x -= moveSpeed * delta;}
    if (movement.right && sphere.position.x + moveSpeed * delta < mapBounds.xMax) {
        // console.log("d");
        sphere.position.x += moveSpeed * delta;}

    // collisions
    sphereColl.copy(sphere.geometry.boundingSphere).applyMatrix4(sphere.matrixWorld);
    checkCollisions();

    updateCameraPosition();
    renderer.render(scene, camera);
}
animate();