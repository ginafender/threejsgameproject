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
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 32, 32); // (radius, width, height)
const material = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


// Set initial camera position behind and above the player
camera.position.set(10, 15, 10);
controls.enableKeys = false;
// controls.target.set(sphere.position.x, sphere.position.y, sphere.position.z);
renderer.render(scene, camera);
renderer.setClearColor(0x2ecc71);
controls.update();

controls.mouseButtons.RIGHT = THREE.MOUSE.RIGHT;
controls.mouseButtons.LEFT = THREE.MOUSE.LEFT;
controls.mouseButtons.MIDDLE = THREE.MOUSE.MIDDLE;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 8, 7.5); // Position it in a way that mimics sunlight
scene.add(directionalLight);

// 1. Create the floor geometry (width, height, widthSegments, heightSegments)
const floorGeometry = new THREE.PlaneGeometry(500, 500);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);


// Add cubes to the scene
const cubegeo = new THREE.BoxGeometry(2, 2, 2);
const cubemat = new THREE.MeshStandardMaterial({ color: 0x3498db });
const cubes = [];
const cubePositions = [
    [0, 0, 0], [10, 0, 10], [-10, 0, -10], [-10, 0, 10], [10, 0, -10]
];

cubePositions.forEach((pos) => {
    const cube = new THREE.Mesh(cubegeo, cubemat);
    cube.position.set(...pos);
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

// Initial setup to save the player's initial position
lastPosition.copy(sphere.position);

function updateCameraPosition() {
    camera.position.x = sphere.position.x + 10; 
    camera.position.z = sphere.position.z + 10;
    camera.position.y = sphere.position.y + 15;
    camera.lookAt(sphere.position);

    // Only update controls.target if the player has moved
    if (!sphere.position.equals(lastPosition)) {
        controls.target.set(
            sphere.position.x,
            sphere.position.y,
            sphere.position.z
        );
        lastPosition.copy(sphere.position);  // Update the last position
    }
    
    controls.update();
}
// Render loop
function animate() {
    window.requestAnimationFrame(animate);
    delta = clock.getDelta();

    // Apply movement
    if (movement.forward && sphere.position.z - moveSpeed * delta > mapBounds.zMin) {
        // console.log("w");
        sphere.position.z -= moveSpeed * delta;
    }
    if (movement.backward && sphere.position.z + moveSpeed * delta < mapBounds.zMax) {
        // console.log("s");
        sphere.position.z += moveSpeed * delta;
    }
    if (movement.left && sphere.position.x - moveSpeed * delta > mapBounds.xMin) {
        // console.log("a");
        sphere.position.x -= moveSpeed * delta;
    }
    if (movement.right && sphere.position.x + moveSpeed * delta < mapBounds.xMax) {
        // console.log("d");
        sphere.position.x += moveSpeed * delta;
    }

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    updateCameraPosition();
    renderer.render(scene, camera);
}
animate();