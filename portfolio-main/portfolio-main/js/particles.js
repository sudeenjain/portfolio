import * as THREE from 'three';

const container = document.getElementById('canvas-container');
if (container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070913, 0.002);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 500 : 1200;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0x00f0ff);
    const color2 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 110;
        positions[i3 + 1] = (Math.random() - 0.5) * 110;
        positions[i3 + 2] = (Math.random() - 0.5) * 110;

        const mixedColor = Math.random() > 0.45 ? color1 : color2;
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High performance procedurally cached particle sprite
    const getTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.35, 'rgba(0,240,255,0.75)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
        size: isMobile ? 0.7 : 0.85,
        map: getTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Silky smooth mouse parallax & scroll tracking with damping
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.35;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.35;
    }, { passive: true });

    let targetScrollY = 0;
    let currentScrollY = 0;
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });

    const clock = new THREE.Clock();
    let animationId;

    function animate() {
        animationId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;
        currentScrollY += (targetScrollY - currentScrollY) * 0.05;

        // Zero per-frame buffer mutation - pure GPU matrix transform!
        particles.rotation.y = elapsed * 0.03 + currentMouseX;
        particles.rotation.x = currentMouseY * 0.5;
        camera.position.y = -currentScrollY * 0.015;

        renderer.render(scene, camera);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            clock.start();
            animate();
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }, { passive: true });
}