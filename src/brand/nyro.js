import './nyro.css';
import gsap from 'gsap';
import { nyroSVG } from './nyro-logo.js';
import { stickersSVG, notebookSVG } from './nyro-scenes.js';
import { enterTimeline, onceInView, loadFonts, splitLetters, fitCaps, reduced } from './motion.js';

// Manual de marca de Nyro armado con HTML/SVG/CSS. El isotipo está reconstruido en vectores a partir
// de la lámina de construcción (src/brand/nyro-logo.js); no hay fotos: todo es código.

export const pieces = 8;

const SPLINE = '"Spline Sans"';
const SPLINE_URL = 'https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;600;700&display=swap';
const SWITZER_URL = 'https://api.fontshare.com/v2/css?f[]=switzer@300,500,700&display=swap';

const all = (root, sel) => [...root.querySelectorAll(sel)];
const logo = (layout, cls = '', color = '') => `<span class="ny-lg ${cls}"${color ? ` style="color:${color}"` : ''}>${nyroSVG({ layout, cls: 'ny-fit' })}</span>`;
const head = (txt) => `<p class="ny-sl-head" data-in>${txt}</p>`;

const ALPHA = ['AaBbCcDdEeFfGgHhIiJjKk', 'LlMmNnOoPpQqRrSsTt', 'UuVvWwXxYyZz'];
const fontBlock = (cls, name, weights) => `
    <div class="ny-font ${cls}">
        <h3 class="ny-fname" data-in>${name}</h3>
        <div class="ny-fhead" data-in>${weights.map((w) => `<span>${w}</span>`).join('')}</div>
        <div class="ny-fbody">
            <div class="ny-alpha" data-in>${ALPHA.map((l) => `<p>${l}</p>`).join('')}<p class="ny-nums">0123456789!@#$%</p></div>
            <div class="ny-wcols" data-in>${weights.map((w, i) => `<div class="ny-wcol ny-w${i}"><span>a</span></div>`).join('')}</div>
        </div>
    </div>`;

// Tablero de isotipos: cada celda es un cuadrado de la marca con la n en el color contrario.
const CELLS = (() => {
    const out = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            const k = (r * 8 + c) % 11 === 3 ? 'lime' : (r + c) % 2 ? 'paper' : 'ink';
            out.push(`<div class="ny-cell ny-cell--${k}" data-cell>${nyroSVG({ layout: 'icon' })}</div>`);
        }
    }
    return out.join('');
})();

// Gráficos "fantasma" del banner: barras, línea, dona. Todo en SVG para poder animarlo.
const bars = (x, y, vals, w = 14, gap = 8, h = 120) => vals.map((v, i) => `<rect class="ny-bar" x="${x + i * (w + gap)}" y="${y + h - v * h}" width="${w}" height="${v * h}" rx="2"/>`).join('');
const BANNER = `
<svg class="ny-charts" viewBox="0 0 2000 667" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="ny-card"><rect x="100" y="60" width="330" height="210" rx="14"/><circle cx="195" cy="160" r="58"/><path d="M195 160V102M195 160l50 29" /></g>
    <g class="ny-card"><rect x="440" y="40" width="220" height="150" rx="14"/>${bars(470, 70, [0.3, 0.45, 0.4, 0.7, 0.55, 0.85, 0.7], 16, 10, 100)}</g>
    <g class="ny-card"><rect x="180" y="330" width="440" height="250" rx="14"/>${bars(220, 380, [0.2, 0.28, 0.4, 0.34, 0.55, 0.62, 0.8, 0.95], 22, 14, 160)}</g>
    <g class="ny-card"><rect x="1020" y="50" width="290" height="200" rx="14"/>${bars(1050, 80, [0.35, 0.5, 0.42, 0.75, 0.6, 0.9, 0.7, 0.55, 0.8, 0.65], 14, 8, 130)}</g>
    <g class="ny-card"><rect x="1040" y="400" width="340" height="200" rx="14"/>${bars(1070, 430, [0.4, 0.6, 0.5, 0.85, 0.7, 0.95, 0.6, 0.75, 0.55, 0.8, 0.9], 15, 9, 140)}</g>
    <path class="ny-wave" pathLength="100" d="M-20 380C100 250 210 230 320 330S500 470 610 345"/>
    <path class="ny-arrow" pathLength="100" d="M1300 335H1440M1410 312l30 23-30 23"/>
</svg>`;

export function manualHTML() {
    return `
<div class="ny-manual ny-pending">

<section class="ny-hero" data-sec="hero" aria-label="Construcción del logo">
    <p class="ny-hero-top mono">Manual de marca // Logo</p>
    <div class="ny-hero-logo">${nyroSVG({ layout: 'main', build: true })}</div>
    <p class="ny-hero-bot mono"><span>Construcción del logo</span><button class="ny-replay" type="button" data-cursor-item data-cursor="Repetir">↻ Repetir</button></p>
</section>

<section class="ny-slide ny-vars" data-sec="vars">
    ${head('Variantes permitidas')}
    <div class="ny-vars-row">
        <figure data-in><div class="ny-vlogo ny-vlogo--icon">${logo('icon')}</div><figcaption>Icono</figcaption></figure>
        <figure data-in><div class="ny-vlogo ny-vlogo--main">${logo('main')}</div><figcaption>Principal</figcaption></figure>
        <figure data-in><div class="ny-vlogo ny-vlogo--tile">${logo('tile')}</div><figcaption>Alternativo</figcaption></figure>
    </div>
</section>

<section class="ny-slide ny-typ" data-sec="typ">
    ${head('Tipografía principal y secundaria')}
    ${fontBlock('ny-font--spline', 'Spline Sans', ['Light', 'Regular', 'Semibold'])}
    ${fontBlock('ny-font--switzer', 'Switzer', ['Light', 'Medium', 'Bold'])}
</section>

<section class="ny-slide ny-lock" data-sec="lock">
    <div class="ny-lock-logo" data-in>${logo('main')}</div>
    <div class="ny-lock-text">
        <p class="ny-lock-h" data-in><span class="ny-ln">Data With</span><span class="ny-ln">Purpose</span></p>
        <p class="ny-lock-s" data-in><span class="ny-ln">Stop guessing. Start leading.</span></p>
    </div>
</section>

<section class="ny-slide ny-pat" data-sec="pat">
    ${head('Patrón')}
    <div class="ny-grid">${CELLS}</div>
</section>

<section class="ny-slide ny-pic ny-stk" data-sec="stk">
    ${head('Aplicaciones // Stickers')}
    <figure class="ny-pic-fig" data-in>${stickersSVG()}</figure>
</section>

<section class="ny-slide ny-pic ny-pap" data-sec="pap">
    ${head('Aplicaciones // Papelería')}
    <figure class="ny-pic-fig" data-in>${notebookSVG()}</figure>
</section>

<section class="ny-banner" data-sec="ban" aria-label="Banner">
    ${BANNER}
    <div class="ny-ban-logo">${logo('main')}</div>
    <div class="ny-ban-text"><p class="ny-ban-h">Data With<br>Purpose</p><p class="ny-ban-s">Stop guessing. Start leading.</p></div>
    <p class="ny-ban-cap mono">Aplicaciones // Banner digital</p>
</section>

</div>`;
}

// ---------------------------------------------------------------------------------------------------------

/** El wordmark real no mide exactamente lo previsto: el viewBox se ajusta a su ancho para que el logo quede centrado. */
function fitBox(svg) {
    const g = svg.querySelector('g.ny-word');
    if (!g) return;
    const b = g.getBBox();
    svg.setAttribute('viewBox', `0 0 ${Math.ceil(b.x + b.width + 8)} ${svg.viewBox.baseVal.height}`);
}

const hide = (els) => gsap.set(els, { strokeDasharray: '100 200', strokeDashoffset: 100, strokeOpacity: 1, fillOpacity: 0 });

function counters(svg, tl, at) {
    all(svg, '.ny-lab').forEach((el, i) => {
        const n = Number(el.dataset.n);
        const o = { v: 0 };
        tl.to(o, { v: n, duration: 1.1, ease: 'power2.out', onUpdate: () => { el.textContent = `${el.dataset.pre} ${Math.round(o.v)}`; } }, at + i * 0.1);
    });
}

/** Construcción del logo: grilla → círculos → partes de la n → cuadrado calado → relleno → wordmark. */
function heroTimeline(svg) {
    const letters = splitLetters(svg.querySelector('.ny-word'), SPLINE);
    fitBox(svg);
    const grid = all(svg, '.ny-g:not(.ny-c)');
    const circles = all(svg, '.ny-c');
    const dots = all(svg, '.ny-dot');
    const labs = all(svg, '.ny-lab');
    const parts = all(svg, '.ny-n');
    const tile = svg.querySelector('.ny-tile');

    gsap.set([...grid, ...circles], { strokeDasharray: '100 200', strokeDashoffset: 100, opacity: 1 });
    gsap.set(dots, { opacity: 0, scale: 0 });
    gsap.set(labs, { opacity: 0 });
    hide([tile, ...parts]);
    gsap.set(letters, { opacity: 0, y: 36 });
    // Mientras se construye, el cuadrado queda en el centro del panel; cuando entra el wordmark el logo se corre a su lugar.
    gsap.set(svg, { x: () => { const w = svg.viewBox.baseVal.width; return svg.getBoundingClientRect().width * ((w / 2 - 220) / w); } });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
    tl.to(grid, { strokeDashoffset: 0, duration: 1, stagger: 0.07, ease: 'power2.inOut' }, 0)
        .to(dots, { opacity: 1, scale: 1, duration: 0.4, stagger: { each: 0.03, from: 'center' }, ease: 'back.out(3)' }, 0.7)
        .to(labs, { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.6)
        .to(circles, { strokeDashoffset: 0, duration: 1.1, stagger: 0.25 }, 1.0)
        .to(parts, { strokeDashoffset: 0, duration: 0.9, stagger: 0.22 }, 1.7)
        .to(tile, { strokeDashoffset: 0, duration: 1.3 }, 2.4)
        .to(tile, { fillOpacity: 1, duration: 0.6, ease: 'power2.out' }, 3.6)
        .to([tile, ...parts], { strokeOpacity: 0, duration: 0.4, ease: 'power1.out' }, 3.8)
        .to(svg, { x: 0, duration: 1.2, ease: 'power3.inOut' }, 3.3)
        .to(letters, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 3.8)
        .to([...grid, ...circles, ...dots, ...labs], { opacity: 0, duration: 0.7, ease: 'power1.in' }, 4.4);
    counters(svg, tl, 0.6);
    return tl;
}

/** Versión corta para los logos chicos: trazo → relleno → wordmark. */
function miniTimeline(svg, delay = 0) {
    const letters = splitLetters(svg.querySelector('.ny-word'), SPLINE);
    fitBox(svg);
    const ps = all(svg, '.ny-p');
    hide(ps);
    const tl = gsap.timeline({ paused: true, delay, defaults: { ease: 'power3.inOut' } });
    tl.to(ps, { strokeDashoffset: 0, duration: 0.8, stagger: 0.07 }, 0)
        .to(ps, { fillOpacity: 1, duration: 0.45, ease: 'power2.out' }, 0.75)
        .to(ps, { strokeOpacity: 0, duration: 0.3 }, 0.9);
    if (letters.length) {
        gsap.set(letters, { opacity: 0, y: 16 });
        tl.to(letters, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.85);
    }
    return tl;
}

export async function mountManual(root) {
    const m = root.querySelector('.ny-manual');
    const cleanups = [];
    const tls = [];
    let alive = true;
    const add = (t) => { tls.push(t); return t; };

    await Promise.all([
        loadFonts(SPLINE_URL, ['300 1em "Spline Sans"', '400 1em "Spline Sans"', '600 1em "Spline Sans"', '700 1em "Spline Sans"'], 'Nyro'),
        loadFonts(SWITZER_URL, ['300 1em Switzer', '500 1em Switzer', '700 1em Switzer'], 'Aa'),
    ]);
    if (!alive) return () => {};

    if (reduced) {
        fitCaps(m, SPLINE);
        all(m, '.ny-word').forEach((t) => splitLetters(t, SPLINE));
        all(m, '.ny-logo').forEach(fitBox);
        m.classList.remove('ny-pending');
        return () => {};
    }
    m.classList.add('is-anim');
    const sec = (k) => m.querySelector(`[data-sec="${k}"]`);
    const when = [];

    // 1 · Construcción
    const hero = sec('hero');
    const heroTl = add(heroTimeline(hero.querySelector('svg')));
    const seek = import.meta.env.DEV ? new URLSearchParams(location.search).get('cbt') : null; // solo en dev: ?cbt=2.1 congela el hero
    if (seek !== null) heroTl.time(Number(seek)); else when.push([hero, () => heroTl.play()]);
    const replay = () => heroTl.restart();
    hero.querySelector('.ny-replay').addEventListener('click', replay);

    // 2 · Variantes: cada logo se construye
    const vars = sec('vars');
    const varTl = add(enterTimeline(vars, { stagger: 0.15 }));
    const varMinis = all(vars, '.ny-logo').map((s, i) => add(miniTimeline(s, 0.3 + i * 0.25)));
    when.push([vars, () => { varTl.play(); varMinis.forEach((t) => t.play()); }]);

    // 3 · Tipografía: las "a" gigantes entran de abajo, una columna tras otra
    const typ = sec('typ');
    const typTl = add(enterTimeline(typ, { stagger: 0.1 }));
    const aa = all(typ, '.ny-wcol span');
    gsap.set(aa, { yPercent: 40, opacity: 0 });
    typTl.to(aa, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.5);
    when.push([typ, () => typTl.play()]);

    // 4 · Lockup con eslogan
    const lock = sec('lock');
    const lockTl = add(enterTimeline(lock, { y: 0, stagger: 0.2 }));
    const lockMini = add(miniTimeline(lock.querySelector('.ny-logo'), 0.2));
    const lns = all(lock, '.ny-ln');
    gsap.set(lns, { clipPath: 'inset(-10% 100% -10% 0)' });
    lockTl.to(lns, { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.9, stagger: 0.25, ease: 'power3.inOut' }, 1.6);
    when.push([lock, () => { lockTl.play(); lockMini.play(); }]);

    // 5 · Patrón: el tablero se llena desde el centro
    const pat = sec('pat');
    const patTl = add(enterTimeline(pat));
    const cells = all(pat, '[data-cell]');
    gsap.set(cells, { scale: 0.4, opacity: 0 });
    patTl.to(cells, { scale: 1, opacity: 1, duration: 0.7, stagger: { each: 0.03, grid: [4, 8], from: 'center' }, ease: 'back.out(1.7)' }, 0.3);
    when.push([pat, () => patTl.play()]);

    // 6 · Stickers: cada uno cae y se pega; después se despega la esquina
    const stk = sec('stk');
    const stkTl = add(enterTimeline(stk, { y: 0, duration: 0.5 }));
    all(stk, '.st-wrap').forEach((w, i) => {
        const cx = Number(w.dataset.cx), cy = Number(w.dataset.cy);
        const t = 0.25 + i * 0.16;
        gsap.set(w, { opacity: 0 });
        stkTl.fromTo(w, { y: -240, rotation: (i % 2 ? 1 : -1) * 16, scale: 1.3, opacity: 0, svgOrigin: `${cx} ${cy}` },
            { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'back.out(1.5)', svgOrigin: `${cx} ${cy}` }, t);
        const peel = w.querySelector('.st-peel');
        if (peel) {
            gsap.set(peel, { scale: 0.01, transformBox: 'fill-box', transformOrigin: '100% 50%' });
            stkTl.to(peel, { scale: 1, duration: 0.9, ease: 'power3.out' }, t + 0.75);
        }
    });
    when.push([stk, () => stkTl.play()]);

    // 7 · Papelería: la libreta entra, se cosen las cruces, se dibuja el piolín y baja la lapicera
    const pap = sec('pap');
    const papTl = add(enterTimeline(pap, { y: 0, duration: 0.5 }));
    const book = pap.querySelector('.nb-book');
    const xs = all(pap, '.nb-x');
    const tw = all(pap, '.nb-tw');
    const tw2 = all(pap, '.nb-tw2');
    const strap = pap.querySelector('.nb-strap');
    const pen = pap.querySelector('.nb-pen-wrap');
    gsap.set(book, { opacity: 0, y: 70 });
    gsap.set(xs, { scale: 0, transformBox: 'fill-box', transformOrigin: '50% 50%' });
    gsap.set(tw, { strokeDasharray: '100 200', strokeDashoffset: 100 });
    gsap.set(tw2, { opacity: 0 });
    gsap.set(strap, { opacity: 0 });
    gsap.set(pen, { opacity: 0, y: -160 });
    papTl.to(book, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.1)
        .to(xs, { scale: 1, duration: 0.35, stagger: 0.07, ease: 'back.out(3)' }, 0.8)
        .to(strap, { opacity: 1, duration: 0.5 }, 1.6)
        .to(tw, { strokeDashoffset: 0, duration: 1.1, stagger: 0.22, ease: 'power2.inOut' }, 1.8)
        .to(tw2, { opacity: 0.42, duration: 0.5 }, 3.0)
        .to(pen, { opacity: 1, y: 0, duration: 1.1, ease: 'back.out(1.2)' }, 1.0);
    when.push([pap, () => papTl.play()]);

    // 8 · Banner: la línea de datos se dibuja, las barras crecen y la flecha avanza
    const ban = sec('ban');
    const banTl = add(gsap.timeline({ paused: true }));
    const cards = all(ban, '.ny-card');
    const barEls = all(ban, '.ny-bar');
    const wave = ban.querySelector('.ny-wave');
    const arrow = ban.querySelector('.ny-arrow');
    const banMini = add(miniTimeline(ban.querySelector('.ny-logo'), 0.8));
    gsap.set(cards, { opacity: 0, y: 24 });
    gsap.set(barEls, { scaleY: 0, transformOrigin: '50% 100%', transformBox: 'fill-box' });
    gsap.set([wave, arrow], { strokeDasharray: '100 200', strokeDashoffset: 100 });
    banTl.to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 0)
        .to(barEls, { scaleY: 1, duration: 0.9, stagger: 0.025, ease: 'power3.out' }, 0.4)
        .to(wave, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.4)
        .to(arrow, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 2.2)
        .fromTo(ban.querySelector('.ny-ban-text'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.6);
    when.push([ban, () => { banTl.play(); banMini.play(); }]);

    fitCaps(m, SPLINE);
    // Los logos que no están en ninguna animación (y los de reduced) igual tienen que medir bien el wordmark.
    all(m, '.ny-word').forEach((t) => splitLetters(t, SPLINE));
    all(m, '.ny-logo').forEach(fitBox);

    m.classList.remove('ny-pending');
    cleanups.push(onceInView(when, { threshold: 0.3 }));

    return () => {
        alive = false;
        cleanups.forEach((fn) => fn());
        hero.querySelector('.ny-replay')?.removeEventListener('click', replay);
        tls.forEach((t) => t.kill());
    };
}

