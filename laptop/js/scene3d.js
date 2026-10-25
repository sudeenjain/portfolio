/**
 * SCROLL-DRIVEN THREE.JS SCENE  (laptop edition only)
 * ----------------------------------------------------------------
 * One fixed canvas behind the page. Scrolling flies the camera forward through the site;
 * scrolling back up flies it back out. Everything reacts to scroll DIRECTION and SPEED:
 *
 *   1. neural network      – glowing nodes + links, with data packets that speed up as you scroll
 *   2. ring tunnel         – one ring per section; the camera passes through each as you reach it
 *   3. credential badges   – your Credly badge images float as 3D cards; they spread apart
 *                            scrolling down and gather back scrolling up
 *   4. wireframe core      – icosahedron behind the hero; spins with the scroll direction and
 *                            pulses with scroll speed
 *
 * Safety rails: skipped for reduced-motion / low-end devices / no WebGL, pauses on hidden tabs,
 * auto-lowers resolution (then switches itself off) if frames get slow, and the HUD button
 * in the bottom-left lets visitors turn it off (remembered in localStorage).
 * Colours follow the accent switcher (--lp-a / --lp-b).
 * ---------------------------------------------------------------- */
import * as THREE from './vendor/three.module.min.js';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowEnd = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 2;

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked */ } }

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

if (reduceMotion || lowEnd) {
    root.dataset.lp3d = 'unavailable';
} else {
    waitForPage(init);
}

function waitForPage(cb) {
    const ready = () => document.querySelector('#projects .project-card') && document.getElementById('home');
    if (ready()) { cb(); return; }
    const mo = new MutationObserver(() => { if (ready()) { mo.disconnect(); cb(); } });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 20000);
}

function accentColors() {
    const cs = getComputedStyle(root);
    const parse = (name, fb) => {
        const p = (cs.getPropertyValue(name) || fb).split(',').map((n) => parseFloat(n));
        return new THREE.Color(p[0] / 255, p[1] / 255, p[2] / 255);
    };
    return { a: parse('--lp-a', '0,240,255'), b: parse('--lp-b', '139,92,246') };
}

function dotTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.65)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

function init() {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
        root.dataset.lp3d = 'unavailable';
        return;
    }

    const host = document.getElementById('canvas-container');
    if (!host) return;
    const canvas = renderer.domElement;
    canvas.className = 'lp-3d';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.querySelector('.lp-orbs'));

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070913, 0.026);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 260);

    const SPACING = 16;           // z distance between sections
    const START_Z = 6;
    let colors = accentColors();

    /* ---------- section anchors: scrollY at which each section is centred ---------- */
    const IDS = ['home', 'about', 'skills', 'certifications', 'badges', 'internships', 'projects', 'resume', 'contact', 'get-in-touch'];
    const secs = IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const N = secs.length;
    let anchors = [];
    let maxScroll = 1;
    function measure() {
        maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        anchors = secs.map((el) => {
            const r = el.getBoundingClientRect();
            return clamp(r.top + scrollY + r.height / 2 - innerHeight / 2, 0, maxScroll);
        });
        anchors[0] = 0;
        // keep strictly increasing so interpolation is safe
        for (let i = 1; i < N; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
        anchors.push(Math.max(maxScroll, anchors[N - 1] + 1));
    }
    function scrollToU(y) {
        for (let i = 0; i < N; i++) {
            if (y < anchors[i + 1] || i === N - 1) {
                return i + clamp((y - anchors[i]) / (anchors[i + 1] - anchors[i]), 0, 1);
            }
        }
        return N;
    }

    const LENGTH = (N + 1) * SPACING;
    const zAt = (u) => START_Z - u * SPACING;

    /* ---------- 1. neural network ---------- */
    const dotTex = dotTexture();
    const NODE_COUNT = 300;
    const nodePos = new Float32Array(NODE_COUNT * 3);
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < NODE_COUNT; i++) {
        const ang = rnd() * Math.PI * 2;
        const rad = 4.5 + Math.pow(rnd(), 0.8) * 15;
        nodePos[i * 3] = Math.cos(ang) * rad * 1.35;
        nodePos[i * 3 + 1] = Math.sin(ang) * rad * 0.85;
        nodePos[i * 3 + 2] = START_Z + 4 - rnd() * (LENGTH + 20);
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = new THREE.PointsMaterial({
        size: 0.55, map: dotTex, color: colors.a, transparent: true, opacity: 0.95,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    const edges = [];
    const linePos = [];
    for (let i = 0; i < NODE_COUNT && edges.length < 650; i++) {
        for (let j = i + 1; j < NODE_COUNT && edges.length < 650; j++) {
            const dx = nodePos[i * 3] - nodePos[j * 3];
            const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
            const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
            if (dx * dx + dy * dy + dz * dz < 62) {
                edges.push([i, j]);
                linePos.push(nodePos[i * 3], nodePos[i * 3 + 1], nodePos[i * 3 + 2], nodePos[j * 3], nodePos[j * 3 + 1], nodePos[j * 3 + 2]);
            }
        }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
        color: colors.b, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    // data packets travelling along random links; faster when you scroll faster
    const PACKETS = Math.min(46, edges.length);
    const packetPos = new Float32Array(PACKETS * 3);
    const packetEdge = [];
    const packetT = [];
    const packetSpeed = [];
    for (let i = 0; i < PACKETS; i++) {
        packetEdge.push(edges[Math.floor(rnd() * edges.length)]);
        packetT.push(rnd());
        packetSpeed.push(0.25 + rnd() * 0.5);
    }
    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
    const packetMat = new THREE.PointsMaterial({
        size: 0.9, map: dotTex, color: 0xffffff, transparent: true, opacity: 1,
        depthWrite: false, blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(packetGeo, packetMat));

    /* ---------- 2. ring tunnel ---------- */
    const rings = [];
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    function circlePoints(radius, segs) {
        const pts = [];
        for (let i = 0; i <= segs; i++) {
            const t = (i / segs) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius * 0.78, 0));
        }
        return pts;
    }
    for (let i = 0; i < N; i++) {
        const outer = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(circlePoints(12 + (i % 2) * 1.8, 120)),
            new THREE.LineBasicMaterial({ color: i % 2 ? colors.b : colors.a, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
        );
        const inner = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(circlePoints(8.2, 90)),
            new THREE.LineDashedMaterial({ color: i % 2 ? colors.a : colors.b, transparent: true, opacity: 0.35, dashSize: 0.6, gapSize: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })
        );
        inner.computeLineDistances();
        outer.position.z = inner.position.z = zAt(i) - 2;
        ringGroup.add(outer, inner);
        rings.push({ outer, inner });
    }

    /* ---------- 3. floating credential badges ---------- */
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);
    const badges = [];
    const seen = new Set();
    const badgeIdx = Math.max(0, IDS.indexOf('badges'));
    const loader = new THREE.TextureLoader();
    document.querySelectorAll('.bento-badge-card .badge-image-wrapper img').forEach((img) => {
        const src = img.currentSrc || img.src;
        if (!src || seen.has(src) || badges.length >= 8) return;
        seen.add(src);
        const idx = badges.length;
        const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, fog: true });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), mat);
        loader.load(src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const ratio = tex.image && tex.image.width ? tex.image.width / tex.image.height : 1;
            mesh.scale.set(ratio > 1 ? 1 : ratio, ratio > 1 ? 1 / ratio : 1, 1);
            mat.map = tex;
            mat.needsUpdate = true;
            mat.userData.loaded = true;
        });
        badgeGroup.add(mesh);
        badges.push({ mesh, mat, i: idx });
    });
    const badgeCount = badges.length;
    let spread = 0;

    /* ---------- 4. wireframe core ---------- */
    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.4, 1),
        new THREE.MeshBasicMaterial({ color: colors.a, wireframe: true, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    core.position.set(3.5, 0.5, START_Z - 22);
    scene.add(core);
    const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(5.4, 0),
        new THREE.MeshBasicMaterial({ color: colors.b, wireframe: true, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    shell.position.copy(core.position);
    scene.add(shell);

    /* ---------- sizing ---------- */
    function resize() {
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        measure();
    }
    resize();
    addEventListener('resize', resize);
    addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    setTimeout(measure, 2500);

    /* ---------- pointer parallax ---------- */
    let mx = 0, my = 0, cmx = 0, cmy = 0;
    addEventListener('pointermove', (e) => {
        mx = (e.clientX / innerWidth - 0.5) * 2;
        my = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });

    /* ---------- accent + on/off ---------- */
    function recolor() {
        colors = accentColors();
        nodeMat.color.copy(colors.a);
        lineMat.color.copy(colors.b);
        core.material.color.copy(colors.a);
        shell.material.color.copy(colors.b);
        rings.forEach((r, i) => {
            r.outer.material.color.copy(i % 2 ? colors.b : colors.a);
            r.inner.material.color.copy(i % 2 ? colors.a : colors.b);
        });
    }
    document.addEventListener('lp-accent', recolor);

    let enabled = lsGet('lp-3d') !== 'off';
    let running = false;
    function setEnabled(on, persist) {
        enabled = on;
        canvas.style.display = on ? '' : 'none';
        root.dataset.lp3d = on ? 'on' : 'off';
        if (persist) lsSet('lp-3d', on ? 'on' : 'off');
        if (on && !running) start();
    }
    document.addEventListener('lp-3d-toggle', () => setEnabled(!enabled, true));

    /* ---------- main loop ---------- */
    let lastY = scrollY, lastT = performance.now();
    let vel = 0, dir = 1, smoothU = scrollToU(scrollY), spin = 0, clock = 0;
    let slowFrames = 0, frames = 0, accum = 0;
    const tmp = new THREE.Vector3();

    function frame(now) {
        if (!enabled) { running = false; return; }
        requestAnimationFrame(frame);
        if (document.hidden) { lastT = now; return; }

        const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016;
        lastT = now;
        clock += dt;

        // scroll speed + direction
        const y = scrollY;
        const dy = y - lastY;
        lastY = y;
        const rawVel = clamp(Math.abs(dy) / dt / 2600, 0, 1);
        vel = lerp(vel, rawVel, 1 - Math.exp(-dt * (rawVel > vel ? 18 : 4)));   // time-based easing
        if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
        spread = lerp(spread, dir > 0 && (vel > 0.04 || spread > 0.2) ? 1 : 0, dir > 0 ? 0.035 : 0.05);
        if (vel < 0.02 && dir > 0) spread = lerp(spread, 0.55, 0.01); // settle half-open when idle

        // camera flies along the path
        smoothU = lerp(smoothU, scrollToU(y), 0.09);
        const z = zAt(smoothU);
        cmx = lerp(cmx, mx, 0.05);
        cmy = lerp(cmy, my, 0.05);
        camera.position.set(cmx * 1.6, -cmy * 1.0, z);
        camera.lookAt(cmx * 0.8, -cmy * 0.5, z - 12);
        camera.rotation.z += Math.sin(clock * 0.3) * 0.0004 + dir * vel * 0.004;
        const fov = 60 + vel * 14;
        if (Math.abs(camera.fov - fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }

        // 4. core: spin follows scroll direction, pulse follows speed
        spin += dt * (0.18 + vel * 2.2) * dir;
        core.rotation.set(spin * 0.7, spin, spin * 0.3);
        shell.rotation.set(-spin * 0.4, -spin * 0.6, 0);
        const pulse = 1 + vel * 0.5 + Math.sin(clock * 1.6) * 0.04;
        core.scale.setScalar(pulse);
        shell.scale.setScalar(1 + vel * 0.3);
        core.material.opacity = 0.26 + vel * 0.5;

        // 2. rings turn against each other, direction-aware
        for (let i = 0; i < rings.length; i++) {
            const r = rings[i];
            const s = (i % 2 ? -1 : 1) * (0.05 + vel * 0.9) * dir * dt;
            r.outer.rotation.z += s;
            r.inner.rotation.z -= s * 1.6;
            const near = clamp(1 - Math.abs(r.outer.position.z - z) / (SPACING * 1.4), 0, 1);
            r.outer.material.opacity = 0.2 + near * 0.55;
            r.inner.material.opacity = 0.12 + near * 0.4;
        }

        // 1. packets race along the links
        const arr = packetGeo.attributes.position.array;
        for (let i = 0; i < PACKETS; i++) {
            packetT[i] += dt * packetSpeed[i] * (0.6 + vel * 7);
            if (packetT[i] > 1) { packetT[i] = 0; packetEdge[i] = edges[Math.floor(Math.random() * edges.length)]; }
            const e = packetEdge[i];
            const t = packetT[i];
            for (let k = 0; k < 3; k++) arr[i * 3 + k] = lerp(nodePos[e[0] * 3 + k], nodePos[e[1] * 3 + k], t);
        }
        packetGeo.attributes.position.needsUpdate = true;
        nodeMat.size = 0.5 + vel * 0.35;

        // 3. badges: gather on scroll up, spread on scroll down, always facing the camera
        const bz = zAt(badgeIdx) - 1;
        for (let i = 0; i < badgeCount; i++) {
            const b = badges[i];
            const a = (i / badgeCount) * Math.PI * 2 + clock * 0.12 + (dir > 0 ? vel * 0.4 : -vel * 0.4);
            const rad = 5.2 + spread * 5.6;
            b.mesh.position.set(Math.cos(a) * rad * 1.25, Math.sin(a) * rad * 0.7 + Math.sin(clock * 0.8 + i) * 0.35, bz + Math.sin(clock * 0.5 + i * 1.7) * 0.8);
            b.mesh.lookAt(camera.position);
            const near = clamp(1 - Math.abs(bz - z) / (SPACING * 2.2), 0, 1);
            if (b.mat.userData.loaded) b.mat.opacity = lerp(b.mat.opacity, near * 0.9, 0.1);
        }

        renderer.render(scene, camera);

        // adaptive quality: drop resolution, then switch off, if the GPU can't keep up
        accum += dt; frames++;
        if (frames === 90) {
            const avg = accum / frames;
            if (avg > 0.034) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
            frames = 0; accum = 0;
            if (slowFrames === 2 && dpr > 1) { dpr = 1; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight, false); slowFrames = 0; }
            else if (slowFrames >= 3) { setEnabled(false, false); root.dataset.lp3d = 'auto-off'; }
        }
    }

    function start() {
        if (running) return;
        running = true;
        lastT = performance.now();
        requestAnimationFrame(frame);
    }

    setEnabled(enabled, false);
    // expose a tiny read-only handle for the HUD / tests
    window.__lp3d = { get vel() { return vel; }, get dir() { return dir; }, get enabled() { return enabled; }, get frames() { return frames; } };
}
