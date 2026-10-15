import * as THREE from 'three';
import gsap from 'gsap';
import common from './shaders/common.glsl?raw';
import transitionFrag from './shaders/transition.frag?raw';
import { createTextItem, createImageItem } from './items.js';
import { scroll, reduced } from '../core/scroll.js';
import { cssColor } from '../core/colors.js';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const CELL_CSS_PX = 3; // size of one dither cell, in CSS px

export const gl = {
    ok: false,
    revealEnabled: false,
    items: [],

    init(canvas) {
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
        } catch {
            return false;
        }
        this.renderer = renderer;
        this.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
        renderer.setPixelRatio(this.dpr);
        renderer.setClearColor(0x000000, 0);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0.1, 10);
        this.camera.position.z = 5;
        this.geo = new THREE.PlaneGeometry(1, 1);
        this.loader = new THREE.TextureLoader();

        // Uniforms shared by every material (same objects, so one write updates all).
        this.U = {
            uTime: { value: 0 },
            uFg: { value: new THREE.Vector3() },
            uCell: { value: CELL_CSS_PX * this.dpr },
            uMouse: { value: new THREE.Vector2(-9999, -9999) },
            uRes: { value: new THREE.Vector2(1, 1) },
        };
        this.frame = { vw: 1, vh: 1, vel: 0, reveal: false, mouse: { x: -9999, y: -9999 } };
        this.mouseTarget = new THREE.Vector2(-9999, -9999);
        this.syncColors();

        // Transition curtain (always on top).
        this.tMat = this.material(transitionFrag, {
            uProgress: { value: 0 },
            uDir: { value: 0 },
            uColor: { value: new THREE.Vector3(1, 1, 1) },
        });
        this.curtain = new THREE.Mesh(this.geo, this.tMat);
        this.curtain.renderOrder = 999;
        this.curtain.visible = false;
        this.scene.add(this.curtain);

        this.resize();
        addEventListener('resize', () => { this.resize(); this.queueRebuild(); });
        addEventListener('pointermove', (e) => {
            this.frame.mouse.x = e.clientX;
            this.frame.mouse.y = e.clientY;
            this.mouseTarget.set(e.clientX * this.dpr, (window.innerHeight - e.clientY) * this.dpr);
        }, { passive: true });
        gsap.ticker.add((t) => this.tick(t));

        this.ok = true;
        document.documentElement.classList.add('gl-on');
        return true;
    },

    /** ShaderMaterial with the shared uniforms + dither/noise helpers prepended. */
    material(frag, uniforms = {}) {
        return new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: `${common}\n${frag}`,
            uniforms: { ...this.U, ...uniforms },
            transparent: true,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
    },

    syncColors() {
        const [r, g, b] = cssColor('--fg');
        this.U.uFg.value.set(r, g, b);
    },

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.renderer.setSize(w, h, false);
        this.camera.right = w;
        this.camera.bottom = h;
        this.camera.updateProjectionMatrix();
        this.frame.vw = w;
        this.frame.vh = h;
        this.renderer.getDrawingBufferSize(this.U.uRes.value);
        this.curtain.position.set(w / 2, h / 2, 1);
        this.curtain.scale.set(w, h, 1);
    },

    /** Re-scan a DOM root for [data-gl-text] / [data-gl-img] and (re)create their meshes. */
    async build(root = document) {
        if (!this.ok) return;
        this.clear();
        try {
            // Make sure every face the GL text will be painted with is actually loaded.
            const faces = new Set();
            root.querySelectorAll('[data-gl-text]').forEach((el) => {
                const cs = getComputedStyle(el);
                faces.add(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
            });
            await Promise.all([...faces].map((f) => document.fonts.load(f)));
            await document.fonts.ready;
        } catch { /* ignore */ }
        this.root = root;
        let order = 0;
        root.querySelectorAll('[data-gl-text], [data-gl-img]').forEach((el) => {
            const item = el.hasAttribute('data-gl-text') ? createTextItem(el, this) : createImageItem(el, this);
            if (item) { item.delay = (order++ % 4) * 0.08; this.items.push(item); }
        });
    },

    clear() {
        this.items.forEach((i) => i.dispose());
        this.items = [];
    },

    queueRebuild() {
        clearTimeout(this._rb);
        this._rb = setTimeout(() => { if (this.root) this.build(this.root); }, 220);
    },

    enableReveal(on = true) {
        if (!this.ok) return;
        this.revealEnabled = on;
        this.frame.reveal = on;
        if (on && reduced) this.items.forEach((i) => { i.mat.uniforms.uReveal.value = 1; i.revealed = true; });
    },

    tick(time) {
        const U = this.U;
        U.uTime.value = reduced ? 0 : time;
        const m = U.uMouse.value;
        m.x += (this.mouseTarget.x - m.x) * 0.12;
        m.y += (this.mouseTarget.y - m.y) * 0.12;

        this.frame.vel = scroll.velocity;

        for (const item of this.items) item.update(item.el.getBoundingClientRect());
        this.wheel?.update(time);
        this.renderer.render(this.scene, this.camera);
    },

    /* ---------------- dither curtain ---------------- */
    _sweep(from, to, dir, duration) {
        const u = this.tMat.uniforms;
        u.uDir.value = dir;
        u.uProgress.value = from;
        this.curtain.visible = true;
        document.documentElement.classList.add('gl-top'); // la cortina también tapa la navbar
        return new Promise((resolve) => {
            gsap.to(u.uProgress, {
                value: to, duration, ease: 'power2.inOut',
                onComplete: () => {
                    if (to === 0) { this.curtain.visible = false; document.documentElement.classList.remove('gl-top'); }
                    resolve();
                },
            });
        });
    },

    /** Cover the screen. Color = fondo del tema actual (negro en oscuro, claro en claro), congelado al empezar so a theme flip underneath is invisible. */
    cover(colorVar = '--bg') {
        if (!this.ok || reduced) return Promise.resolve();
        this.tMat.uniforms.uColor.value.set(...cssColor(colorVar));
        return this._sweep(0, 1, 0, 0.55);
    },

    uncover() {
        if (!this.ok || reduced) return Promise.resolve();
        return this._sweep(1, 0, 1, 0.6);
    },
};
