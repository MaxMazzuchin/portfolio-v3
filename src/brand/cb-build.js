import gsap from 'gsap';
import { enterTimeline, onceInView, reduced } from './motion.js';

export { enterTimeline, onceInView, reduced };

const all = (root, sel) => [...root.querySelectorAll(sel)];

/**
 * Reemplaza el rótulo "BIENES RAÍCES" por una letra por <text>, medidas con la tipografía ya cargada,
 * para poder animarlas una por una. Escala el cuerpo para que el rótulo mida exactamente `data-w`.
 * Devuelve las letras (vacío si el svg no tiene rótulo o no se pudo medir).
 */
export function splitTag(svg) {
    const t = svg.querySelector('text.cb-tag');
    if (!t) return all(svg, '.cb-tag .cb-l');
    const word = t.dataset.text;
    const w = Number(t.dataset.w);
    const y = Number(t.getAttribute('y'));
    t.removeAttribute('textLength');
    t.removeAttribute('lengthAdjust');
    t.textContent = word;
    const len = t.getComputedTextLength();
    if (!len) return [];
    const size = Number(t.getAttribute('font-size')) * (w / len);
    t.setAttribute('font-size', size.toFixed(2));
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cb-tag');
    g.setAttribute('font-size', size.toFixed(2));
    [...word].forEach((ch, i) => {
        if (ch === ' ') return;
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        l.setAttribute('class', 'cb-l');
        l.setAttribute('x', t.getStartPositionOfChar(i).x.toFixed(2));
        l.setAttribute('y', y);
        l.textContent = ch;
        g.appendChild(l);
    });
    t.replaceWith(g);
    return all(g, '.cb-l');
}

const paths = (svg) => all(svg, '.cb-p');

/** Estado inicial de una construcción: nada visible salvo lo que se va a dibujar. */
function hide(svg) {
    gsap.set(paths(svg), { strokeDasharray: '100 200', strokeDashoffset: 100, strokeOpacity: 1, fillOpacity: 0 });
}

/** Contadores de las etiquetas de medida: 0 → valor. */
function counters(svg, tl, at) {
    all(svg, '.cb-lab').forEach((el, i) => {
        const n = Number(el.dataset.n);
        const o = { v: 0 };
        tl.to(o, {
            v: n, duration: 1.1, ease: 'power2.out',
            onUpdate: () => { el.textContent = `${el.dataset.pre} ${o.v.toFixed(1)}`; },
        }, at + i * 0.1);
    });
}

/**
 * Construcción completa del logo vertical: guías → marco → pisos → C y B → relleno → rótulo → guías afuera.
 * Devuelve una timeline en pausa y ya en su estado inicial.
 */
export function heroTimeline(svg) {
    const letters = splitTag(svg);
    const guides = all(svg, '.cb-g');
    const dots = all(svg, '.cb-dot');
    const labs = all(svg, '.cb-lab');
    const floors = all(svg, '.cb-c').reverse(); // de abajo hacia arriba, como se levanta un edificio
    const mono = all(svg, '.cb-m');

    gsap.set(guides, { strokeDasharray: '100 200', strokeDashoffset: 100, opacity: 1 });
    gsap.set(dots, { opacity: 0, scale: 0 });
    gsap.set(labs, { opacity: 0 });
    gsap.set(letters, { opacity: 0, y: 18 });
    hide(svg);

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
    tl.to(guides, { strokeDashoffset: 0, duration: 1, stagger: 0.07, ease: 'power2.inOut' }, 0)
        .to(labs, { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.5)
        .to(all(svg, '.cb-f'), { strokeDashoffset: 0, duration: 1.2 }, 0.7)
        .to(dots, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(3)' }, 1.1)
        .fromTo(floors, { y: 22 }, { y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out' }, 1.3)
        .to(floors, { strokeDashoffset: 0, duration: 0.9, stagger: 0.14 }, 1.3)
        .to(mono, { strokeDashoffset: 0, duration: 1.15, stagger: 0.16 }, 1.9)
        .to(paths(svg), { fillOpacity: 1, duration: 0.55, stagger: 0.05, ease: 'power2.out' }, 2.9)
        .to(paths(svg), { strokeOpacity: 0, duration: 0.4, ease: 'power1.out' }, 3.1)
        .to(letters, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' }, 3.2)
        .to([...guides, ...dots, ...labs], { opacity: 0, duration: 0.7, ease: 'power1.in' }, 4.1);
    counters(svg, tl, 0.5);
    return tl;
}

/** Versión corta (1,3 s) para los logos chicos: trazo → relleno → rótulo. */
export function miniTimeline(svg, delay = 0) {
    const letters = splitTag(svg);
    hide(svg);
    const tl = gsap.timeline({ paused: true, delay, defaults: { ease: 'power3.inOut' } });
    tl.to(all(svg, '.cb-f'), { strokeDashoffset: 0, duration: 0.6 }, 0)
        .to(all(svg, '.cb-c'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.06 }, 0.15)
        .to(paths(svg), { fillOpacity: 1, duration: 0.4, ease: 'power2.out' }, 0.85)
        .to(paths(svg), { strokeOpacity: 0, duration: 0.3 }, 0.95);
    const mono = all(svg, '.cb-m'); // el logo "solo ícono" no tiene monograma ni rótulo
    if (mono.length) tl.to(mono, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, 0.3);
    if (letters.length) {
        gsap.set(letters, { opacity: 0, y: 8 });
        tl.to(letters, { opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: 'power3.out' }, 0.9);
    }
    return tl;
}

