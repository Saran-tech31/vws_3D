
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';

// CREATE 3D SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101827);

// CAMERA

const container = document.getElementById("scene-container");

const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(5, 4, 7);

// RENDERER

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

container.appendChild(renderer.domElement);

// CAMERA CONTROLS

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.target.set(0, 0, 0);

// LIGHTING

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

mainLight.position.set(5, 8, 5);
scene.add(mainLight);

// WORKSHOP FLOOR

const floorGeometry = new THREE.PlaneGeometry(15, 15);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x263445,
    roughness: 0.8
});

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;

scene.add(floor);

// METAL PLATE MATERIAL

const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x8295a8,
    metalness: 0.8,
    roughness: 0.35
});

// FIRST METAL PLATE

const plateGeometry = new THREE.BoxGeometry(
    4, 0.3, 1.5
);

const plate1 = new THREE.Mesh(
    plateGeometry,
    metalMaterial
);

plate1.position.set(0, 0, -0.8);
plate1.castShadow = true;
plate1.receiveShadow = true;

scene.add(plate1);

// SECOND METAL PLATE

const plate2 = new THREE.Mesh(
    plateGeometry,
    metalMaterial
);

plate2.position.set(0, 0, 0.8);
plate2.castShadow = true;
plate2.receiveShadow = true;

scene.add(plate2);

// YELLOW SEAM

const seamGeometry = new THREE.BoxGeometry(
    4, 0.025, 0.06
);

const seamMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    emissive: 0x664400
});

const seam = new THREE.Mesh(
    seamGeometry,
    seamMaterial
);

seam.position.set(0, 0.17, 0);

scene.add(seam);

// WORKSHOP GRID

const grid = new THREE.GridHelper(
    15, 30, 0x38bdf8, 0x334155
);

grid.position.y = -0.48;

scene.add(grid);

// 3D VIRTUAL WELDING TORCH

const torch = new THREE.Group();

// TORCH BODY

const torchBodyGeometry = new THREE.CylinderGeometry(
    0.12, 0.18, 1.2, 24
);

const torchBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.3
});

const torchBody = new THREE.Mesh(
    torchBodyGeometry,
    torchBodyMaterial
);

torch.add(torchBody);

// TORCH NOZZLE

const nozzleGeometry = new THREE.CylinderGeometry(
    0.035, 0.09, 0.35, 20
);

const nozzleMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.9,
    roughness: 0.2
});

const nozzle = new THREE.Mesh(
    nozzleGeometry,
    nozzleMaterial
);

nozzle.position.y = -0.65;

torch.add(nozzle);

// TORCH GRIP

const gripGeometry = new THREE.CylinderGeometry(
    0.19, 0.19, 0.35, 20
);

const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7
});

const grip = new THREE.Mesh(
    gripGeometry,
    gripMaterial
);

grip.position.y = 0.35;

torch.add(grip);

// TORCH POSITION

torch.position.set(-1.5, 1.3, 0);
torch.rotation.z = -0.25;

scene.add(torch);

// TORCH MOVEMENT

let torchDragging = false;

renderer.domElement.addEventListener(
    "pointerdown",
    () => {
        torchDragging = true;
        controls.enabled = false;
    }
);

renderer.domElement.addEventListener(
    "pointermove",
    (event) => {

        if (!torchDragging) return;

        const rect = renderer.domElement.getBoundingClientRect();

        const mouseX =
            (event.clientX - rect.left) / rect.width;

        torch.position.x = (mouseX - 0.5) * 4;
    }
);

function stopTorchMovement() {
    torchDragging = false;
    controls.enabled = true;
}

renderer.domElement.addEventListener(
    "pointerup",
    stopTorchMovement
);

renderer.domElement.addEventListener(
    "pointercancel",
    stopTorchMovement
);

window.addEventListener("pointerup", stopTorchMovement);

// BLUE WELDING GLOW

const glowGeometry = new THREE.SphereGeometry(
    0.12, 24, 24
);

const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
});

const weldingGlow = new THREE.Mesh(
    glowGeometry,
    glowMaterial
);

weldingGlow.position.set(0, -0.9, 0);

torch.add(weldingGlow);

// LIGHT AROUND WELDING POINT

const weldingLight = new THREE.PointLight(
    0x38bdf8,
    2,
    2
);

weldingLight.position.set(0, -0.9, 0);

torch.add(weldingLight);

// PRACTICE SCORING SYSTEM

let practiceStarted = false;

let completedSections = new Set();

const startButton = document.getElementById("startPractice");
const resetButton = document.getElementById("resetPractice");

const scoreDisplay = document.getElementById("score");
const accuracyDisplay = document.getElementById("accuracy");
const practiceStatus = document.getElementById("practiceStatus");

// START PRACTICE

startButton.addEventListener("click", () => {

    practiceStarted = true;

    completedSections.clear();

    scoreDisplay.textContent = "0%";
    accuracyDisplay.textContent = "0%";

    practiceStatus.textContent =
        "Practice started! Move the torch along the yellow seam.";

});

// RESET PRACTICE

resetButton.addEventListener("click", () => {

    practiceStarted = false;

    completedSections.clear();

    scoreDisplay.textContent = "0%";
    accuracyDisplay.textContent = "0%";

    practiceStatus.textContent =
        "Practice reset. Ready to begin!";

});

// TRACK TORCH MOVEMENT AND SCORE

renderer.domElement.addEventListener(
    "pointermove",
    () => {

        if (!practiceStarted || !torchDragging) return;

        torch.updateMatrixWorld(true);

        const tip = new THREE.Vector3();

        weldingGlow.getWorldPosition(tip);

        const nearSeam =
            Math.abs(tip.z) < 0.4 &&
            Math.abs(tip.y - 0.17) < 0.4 &&
            tip.x >= -2 &&
            tip.x <= 2;

        if (nearSeam) {

            const section = Math.min(
                39,
                Math.floor((tip.x + 2) / 4 * 40)
            );

            completedSections.add(section);

            const score = Math.round(
                completedSections.size / 40 * 100
            );

            scoreDisplay.textContent = score + "%";
            accuracyDisplay.textContent = score + "%";

            if (score >= 100) {

                practiceStatus.textContent =
                    "Exercise completed! Excellent work!";

            } else {

                practiceStatus.textContent =
                    "Good progress! Continue along the seam.";

            }
        }
    }
);

// ANIMATION

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    const torchTip = new THREE.Vector3();

    weldingGlow.getWorldPosition(torchTip);

    const nearSeam =
        Math.abs(torchTip.z) < 0.4 &&
        Math.abs(torchTip.y - 0.17) < 0.4 &&
        torchTip.x >= -2 &&
        torchTip.x <= 2;

    // BLUE GLOW ACTIVATION

    weldingGlow.visible = nearSeam;

    weldingLight.intensity = nearSeam ? 4 : 0;

    renderer.render(scene, camera);
}

// RESIZE HANDLING

window.addEventListener("resize", () => {

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

});

// START ANIMATION

animate();

document.getElementById("status").textContent =
    "3D Workshop Loaded Successfully!";
