import * as THREE from 'three';
import gsap from 'gsap';
import textFrag from './shaders/text.frag?raw';
import imageFrag from './shaders/image.frag?raw';

/** Shared state handed to every item: scene, shared uniforms, per-frame context. */
// G = { scene, geo, loader, material(frag, uniforms), dpr, frame: { vw, vh, vel, mouse:{x,y}, reveal } }

function place(mesh, rect) {
    mesh.position.set(rect.left + rect.width / 2, rect.top + rect.height / 2, 0);
    mesh.scale.set(rect.width, rect.height, 1);
}

function revealOnce(item, G, rect) {
    if (item.revealed || !G.frame.reveal) return;
    if (rect.top > G.frame.vh * 0.94) return;
    item.revealed = true;
    G.seen.add(item.el); // sobrevive a un rebuild (resize) mientras el elemento siga en la página
    gsap.to(item.mat.uniforms.uReveal, { value: 1, duration: 1.2, ease: 'power2.out', delay: item.delay || 0 });
}

/* ------------------------------------------------------------------ */
/* Text: DOM text is measured, painted into a 2D canvas, dither-filled */
/* ------------------------------------------------------------------ */
function layoutLines(ctx2d, text, maxWidth) {
    const lines = [];
    for (const para of text.split('\n')) {
        const words = para.split(/\s+/).filter(Boolean);
        let line = '';
        for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            if (line && ctx2d.measureText(test).width > maxWidth) { lines.push(line); line = w; } else line = test;
        }
        lines.push(line);
    }
    return lines;
}

export function createTextItem(el, G) {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const cs = getComputedStyle(el);

    const scale = Math.min(G.dpr, 2, 4096 / rect.width);
    // Accents and descenders can poke out of a tight line box; give the texture headroom.
    const padY = parseFloat(cs.fontSize) * 0.22;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(rect.width * scale);
    canvas.height = Math.ceil((rect.height + 2 * padY) * scale);
    const c = canvas.getContext('2d');

    const fontSize = parseFloat(cs.fontSize) * scale;
    c.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const ls = parseFloat(cs.letterSpacing);
    if (!Number.isNaN(ls) && 'letterSpacing' in c) c.letterSpacing = `${ls * scale}px`;
    c.fillStyle = '#fff';
    c.textBaseline = 'middle';
    const align = cs.textAlign === 'center' ? 'center' : cs.textAlign === 'right' || cs.textAlign === 'end' ? 'right' : 'left';
    c.textAlign = align;

    let text = el.innerText.trim();
    if (cs.textTransform === 'uppercase') text = text.toUpperCase();
    const lh = (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2) * scale;
    const x = align === 'center' ? canvas.width / 2 : align === 'right' ? canvas.width : 0;
    layoutLines(c, text, canvas.width).forEach((line, i) => c.fillText(line, x, padY * scale + (i + 0.5) * lh));

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;

    const mat = G.material(textFrag, { uTex: { value: tex }, uReveal: { value: G.seen.has(el) ? 1 : 0 } });
    const mesh = new THREE.Mesh(G.geo, mat);
    mesh.visible = false;
    G.scene.add(mesh);
    el.classList.add('gl-hidden');

    const item = {
        el, mesh, mat, revealed: G.seen.has(el),
        update(r) {
            const vis = r.bottom > 0 && r.top < G.frame.vh;
            mesh.visible = vis;
            if (!vis) return;
            place(mesh, { left: r.left, width: r.width, top: r.top - padY, height: r.height + 2 * padY });
            revealOnce(item, G, r);
        },
        dispose() {
            el.classList.remove('gl-hidden');
            G.scene.remove(mesh);
            tex.dispose();
            mat.dispose();
        },
    };
    return item;
}

/* ------------------------------------------------------------------ */
/* Image: lazy texture, load when near, free when far                  */
/* ------------------------------------------------------------------ */
/** Cover-fit image material (also used by the wheel cards). */
export function imageMaterial(G) {
    return G.material(imageFrag, {
        uTex: { value: null },
        uImg: { value: new THREE.Vector2(1, 1) },
        uSize: { value: new THREE.Vector2(1, 1) },
        uReveal: { value: 0 },
        uVel: { value: 0 },
        uBorder: { value: 0 },
        uAlpha: { value: 1 },
        uBorderColor: { value: new THREE.Vector3(1, 1, 1) },
    });
}

export function createImageItem(el, G) {
    const mat = imageMaterial(G);
    if (G.seen.has(el)) mat.uniforms.uReveal.value = 1;
    const mesh = new THREE.Mesh(G.geo, mat);
    mesh.visible = false;
    G.scene.add(mesh);

    let tex = null;
    let loading = false;
    let dead = false;

    const fetchTexture = () => {
        // La textura usa la misma URL que eligió el navegador para la <img> (puede ser una variante del srcset): se baja una sola vez.
        G.loader.load(el.currentSrc || el.src, (t) => {
            loading = false;
            if (dead) { t.dispose(); return; }
            t.flipY = false;
            t.generateMipmaps = false;
            t.minFilter = THREE.LinearFilter;
            tex = t;
            mat.uniforms.uTex.value = t;
            mat.uniforms.uImg.value.set(t.image.width, t.image.height);
        }, undefined, () => { loading = false; });
    };
    const load = () => {
        loading = true;
        if (el.currentSrc) { fetchTexture(); return; }
        // Una <img> lazy que todavía no empezó a bajar no tiene currentSrc, y sin él se pediría el original en vez de la variante.
        // Se la pasa a eager (el navegador elige la fuente) y se espera a que cargue.
        const ready = () => { el.removeEventListener('load', ready); el.removeEventListener('error', ready); fetchTexture(); };
        el.addEventListener('load', ready);
        el.addEventListener('error', ready);
        el.loading = 'eager';
    };
    const unload = () => {
        tex.dispose();
        tex = null;
        mat.uniforms.uTex.value = null;
        // La animación de entrada se muestra una sola vez: liberar la textura al alejarse NO la reinicia (volver a subir no la repite).
    };

    const item = {
        el, mesh, mat, revealed: G.seen.has(el),
        update(r) {
            const { vh, vel } = G.frame;
            const near = r.bottom > -vh * 1.5 && r.top < vh * 2.5;
            const far = r.bottom < -vh * 3 || r.top > vh * 4;
            if (near && !tex && !loading) load();
            if (far && tex) unload();

            const vis = !!tex && r.bottom > 0 && r.top < vh;
            mesh.visible = vis;
            if (!vis) return;

            place(mesh, r);
            const u = mat.uniforms;
            u.uSize.value.set(r.width, r.height);
            u.uVel.value = vel;
            revealOnce(item, G, r);
        },
        dispose() {
            dead = true;
            G.scene.remove(mesh);
            tex?.dispose();
            mat.dispose();
        },
    };
    return item;
}
