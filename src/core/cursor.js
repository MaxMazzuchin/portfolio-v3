import gsap from 'gsap';
import { bayerAt } from './dither.js';

const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const CELL = 3;        // px per dither cell
const BOARD = 32;      // cells per side (96px canvas)

let state = { r: 4.5, solid: 0 };
let paint = () => {};

export const cursor = {
    /** Force the labelled state from code (e.g. over a WebGL card). null clears it. */
    hint(label) {
        const c = document.querySelector('.cursor');
        if (!c || !fine) return;
        setActive(c, !!label, label);
    },
};

function setActive(c, on, label) {
    c.classList.toggle('is-active', on);
    if (label) c.querySelector('.cursor-label').textContent = label;
    gsap.to(state, { r: on ? 14 : 4.5, solid: on ? 1 : 0, duration: 0.45, ease: 'power3.out', onUpdate: paint });
}

/**
 * Small dithered dot that follows the pointer. At rest it is a ~27px soft dither spot;
 * over [data-cursor-item] it grows into a solid disc that carries the label.
 */
export function initCursor() {
    const c = document.querySelector('.cursor');
    if (!c || !fine) return;

    const canvas = c.querySelector('.cursor-dots');
    canvas.width = BOARD * CELL;
    canvas.height = BOARD * CELL;
    const ctx = canvas.getContext('2d');

    paint = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        const mid = BOARD / 2;
        for (let y = 0; y < BOARD; y++) {
            for (let x = 0; x < BOARD; x++) {
                const d = Math.hypot(x + 0.5 - mid, y + 0.5 - mid);
                if (d > state.r) continue;
                const falloff = 1 - d / state.r;                       // 1 at the centre → 0 at the edge
                const density = Math.min(1, falloff * 1.6 + state.solid * 0.9);
                if (density > bayerAt(x, y)) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
            }
        }
    };
    paint();

    const x = gsap.quickTo(c, 'x', { duration: 0.3, ease: 'power3' });
    const y = gsap.quickTo(c, 'y', { duration: 0.3, ease: 'power3' });
    addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });

    let current = null;
    document.addEventListener('pointerover', (e) => {
        const item = e.target.closest?.('[data-cursor-item]');
        if (item === current) return;
        current = item;
        setActive(c, !!item, item?.dataset.cursor || '');
    });
    document.addEventListener('pointerleave', () => { current = null; setActive(c, false); });
}
