import * as THREE from 'three';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();

const isMobile = window.innerWidth < 768;
const count = isMobile ? 1000 : 3000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const color1 = new THREE.Color(0x00f3ff);
const color2 = new THREE.Color(0xbd00ff);

for(let i=0; i<count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3+1] = (Math.random() - 0.5) * 100;
    positions[i3+2] = (Math.random() - 0.5) * 100;

    const mixedColor = Math.random() > 0.5 ? color1 : color2;
    colors[i3] = mixedColor.r;
    colors[i3+1] = mixedColor.g;
    colors[i3+2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const getTexture = () => {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16,16,0,16,16,16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,32,32);
    return new THREE.Texture(canvas);
}
const sprite = getTexture(); sprite.needsUpdate = true;

const material = new THREE.PointsMaterial({
    size: 0.5, map: sprite, vertexColors: true,
    transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

let mouseX = 0, mouseY = 0;
let scrollY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth/2) * 0.001;
    mouseY = (e.clientY - window.innerHeight/2) * 0.001;
});

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const clock = new THREE.Clock();
let animationId;

function animate() {
    const time = clock.getElapsedTime();
    
    particles.rotation.y = time * 0.05 + mouseX;
    particles.rotation.x = mouseY;
    particles.position.z = scrollY * 0.05;

    const pos = geometry.attributes.position.array;
    for(let i=0; i<count; i++) {
        const i3 = i*3;
        const x = pos[i3];
        pos[i3+1] += Math.sin(time + x) * 0.005; 
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
}
animate();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});