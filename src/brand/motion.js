// Helpers compartidos por los manuales armados en código (Contigiani Briñón, Nyro, Outframe).
import gsap from 'gsap';
import { reduced } from '../core/scroll.js';

export { reduced };

const all = (root, sel) => [...root.querySelectorAll(sel)];

/** Entrada genérica de un bloque: sus hijos con [data-in] suben y aparecen en cascada. */
export function enterTimeline(el, { y = 28, stagger = 0.08, duration = 0.8 } = {}) {
    const items = all(el, '[data-in]');
    gsap.set(items, { opacity: 0, y });
    const tl = gsap.timeline({ paused: true });
    tl.to(items, { opacity: 1, y: 0, duration, stagger, ease: 'power3.out' }, 0);
    return tl;
}

/** Corre cada callback la primera vez que su elemento entra en pantalla. Devuelve la limpieza. */
export function onceInView(entries, { threshold = 0.35 } = {}) {
    const map = new Map(entries.map(([el, fn]) => [el, fn]));
    const io = new IntersectionObserver((list) => {
        for (const e of list) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            map.get(e.target)?.();
        }
    }, { threshold });
    map.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
}

const linked = new Map();
/**
 * Carga tipografías de Google Fonts / Fontshare solo cuando un manual las pide.
 * Espera primero a que la hoja de estilos esté cargada (si no, document.fonts.load no conoce todavía la familia y
 * resuelve al instante) y después a que cada fuente esté lista. No espera más de 3 s.
 */
export function loadFonts(href, specs, sample = 'Aa') {
    if (!linked.has(href)) {
        linked.set(href, new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        }));
    }
    const ready = linked.get(href).then(() => Promise.all(specs.map((s) => document.fonts.load(s, sample).catch(() => []))));
    return Promise.race([ready, new Promise((r) => setTimeout(r, 3000))]);
}

/** Altura de mayúscula de una tipografía, medida en un canvas: ascent de la "N" por unidad de cuerpo. */
export function capRatio(family, weight = 700) {
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${weight} 100px ${family}`;
    const a = c.measureText('N').actualBoundingBoxAscent;
    return a > 0 ? a / 100 : 0.7;
}

/**
 * Reemplaza un <text> SVG por una letra por <text>, medidas con la tipografía ya cargada, para animarlas de a una.
 * Antes ajusta el cuerpo para que la altura de mayúscula sea `data-cap` (y el largo no se toca).
 * Devuelve las letras.
 */
export function splitLetters(t, family, weight = 700) {
    if (!t) return [];
    if (t.dataset.split) return all(t, '.ny-l');
    const word = t.dataset.text;
    const cap = Number(t.dataset.cap);
    if (cap) t.setAttribute('font-size', (cap / capRatio(family, weight)).toFixed(2));
    t.textContent = word;
    const y = t.getAttribute('y');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', t.getAttribute('class') + ' is-split');
    g.setAttribute('font-size', t.getAttribute('font-size'));
    g.dataset.split = '1';
    [...word].forEach((ch, i) => {
        if (ch === ' ') return;
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        l.setAttribute('class', 'ny-l');
        l.setAttribute('x', t.getStartPositionOfChar(i).x.toFixed(2));
        l.setAttribute('y', y);
        l.textContent = ch;
        g.appendChild(l);
    });
    t.replaceWith(g);
    return all(g, '.ny-l');
}

/** Ajusta el cuerpo de cada <text data-cap="…"> para que su mayúscula mida exactamente esa altura (en unidades del SVG). */
export function fitCaps(root, family, weight = 700, selector = 'text[data-cap]') {
    const ratio = capRatio(family, weight);
    root.querySelectorAll(selector).forEach((t) => t.setAttribute('font-size', (Number(t.dataset.cap) / ratio).toFixed(2)));
}
