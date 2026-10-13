import { setAccent } from '../core/accent.js';
import { ditherField } from '../core/dither.js';

/** Home is static: the markup is complete in index.html. Counts in the nav / home are filled by main.js. */
export function mountHome() {
    document.title = 'Máximo Mazzuchin | Diseñador gráfico en Córdoba, Argentina';
    setAccent(null);

    // Animated dither background: a canvas hoisted (by main.js) into the ghost layer, below the WebGL canvas.
    const canvas = document.querySelector('.ghost-dither canvas');
    if (!canvas) return () => {};
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const color = () => getComputedStyle(canvas).color;
    if (reduce) { ditherField(canvas, color(), 0); return () => {}; }

    // The field thickens around the cursor (fine pointers only); it eases in/out so it never snaps.
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const ptr = { x: 0, y: 0, r: 240, k: 0 };
    const target = { x: 0, y: 0, k: 0 };
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); target.x = e.clientX - r.left; target.y = e.clientY - r.top; target.k = 1; };
    const onLeave = () => { target.k = 0; };
    if (fine) {
        addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
    }

    let raf = 0;
    let last = 0;
    const frame = (now) => {
        raf = requestAnimationFrame(frame);
        if (now - last < 50) return; // ~20fps
        last = now;
        if (ptr.k < 0.01 && target.k === 0) { ptr.x = target.x; ptr.y = target.y; }
        ptr.x += (target.x - ptr.x) * 0.25;
        ptr.y += (target.y - ptr.y) * 0.25;
        ptr.k += (target.k - ptr.k) * 0.15;
        ditherField(canvas, color(), now / 1000, 8, 0.22, ptr);
    };
    raf = requestAnimationFrame(frame);

    return () => {
        cancelAnimationFrame(raf);
        removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
    };
}
