import { ditherBar } from './dither.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bars = new Map(); // canvas → colour
let raf = 0;
let last = 0;

function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 50) return; // ~20fps is plenty for a thin rule
    last = now;
    for (const [canvas, color] of bars) {
        if (!canvas.isConnected) bars.delete(canvas);
        else ditherBar(canvas, color, 3, now / 1000);
    }
    if (!bars.size) { cancelAnimationFrame(raf); raf = 0; }
}

/** Replaces every empty [data-dbar] element with a thin dithered rule in the current accent colour, drifting slowly. */
export function mountDbars(root = document) {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f1f1ee';
    root.querySelectorAll('[data-dbar]').forEach((el) => {
        let canvas = el.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            el.appendChild(canvas);
        }
        if (reduceMotion) { ditherBar(canvas, color); return; }
        ditherBar(canvas, color, 3, performance.now() / 1000);
        bars.set(canvas, color);
    });
    if (bars.size && !raf) raf = requestAnimationFrame(frame);
}
