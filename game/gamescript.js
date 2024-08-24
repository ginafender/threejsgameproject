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


// movement
var moveSpeed = 10;
const clock = new THREE.Clock();
var delta;

document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(event){
    delta = clock.getDelta();
    var keyCode = event.which;
    if (keyCode==87) { // W
        sphere.position.z -= moveSpeed * delta;
        camera.position.z -= moveSpeed * delta;
    } else if (keyCode==83) { // S
        sphere.position.z += moveSpeed * delta;
        camera.position.z += moveSpeed * delta;
    } else if (keyCode==65) { // A
        sphere.position.x -= moveSpeed * delta;
        camera.position.x -= moveSpeed * delta;
    } else if (keyCode==68) { // D
        sphere.position.x += moveSpeed * delta;
        camera.position.x += moveSpeed * delta;
    } else if (keyCode==32) { // JUMP
        sphere.position.y += moveSpeed * delta;
        camera.position.y += moveSpeed * delta;
    }
    animate();
};

const cubegeo = new THREE.BoxGeometry(2, 2, 2);
const cubemat = new THREE.MeshStandardMaterial({color: 0x3498db });
const cube = new THREE.Mesh(cubegeo, cubemat);
scene.add(cube);


// Render loop
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();