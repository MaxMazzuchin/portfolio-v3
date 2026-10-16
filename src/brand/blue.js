import './blue.css';
import gsap from 'gsap';
import { LOGO, GAP, LIFT, WORD, blueSVG, wavesSVG, coverSVG } from './blue-logo.js';
import { enterTimeline, onceInView, loadFonts, splitLetters, capRatio, reduced } from './motion.js';

// Manual de marca de Blue Marketing armado con HTML/SVG/CSS. El logo y las olas son los vectores del PDF de lineamientos del
// cliente (blue-logo.js / blue-paths.js); los stickers y los posts son las piezas originales (en /images/projects/blue-marketing).
// Cada lámina escala con su ancho: 1 "u" = 1px de una lámina de 1920px (las medidas salen del PDF, que es 1920 × 1080).

export const pieces = 7;

const POPPINS = 'Poppins';
const POPPINS_URL = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap';
const IMG = '/images/projects/blue-marketing';

const all = (root, sel) => [...root.querySelectorAll(sel)];
const LIN = '<p class="bm-lin">//Lineamientos de Marca</p>';
const head = (txt) => `<p class="bm-sl-head" data-in>${txt}</p>`;

/** Logo dentro de su zona segura: caja punteada exterior, la del logo y cuatro cuadrados en las esquinas (como en el PDF). */
function safeSVG({ word = false } = {}) {
    const { w, h } = LOGO;
    const m = 30;
    const sq = [[-m, -m], [w, -m], [-m, h], [w, h]].map(([x, y]) => `<rect class="bm-zone-sq" x="${x}" y="${y}" width="${m}" height="${m}"/>`).join('');
    const label = word
        ? `<text class="bm-word bm-t" x="0" y="${h + 40}" font-size="30" data-text="${WORD}" data-w="${w}" data-gap="${m + 8}">${WORD}</text>`
        : '';
    return `<svg class="bm-safe" viewBox="${-m} ${-m} ${w + 2 * m} ${h + 2 * m + (word ? 52 : 0)}" role="img" aria-label="Logo con su zona segura" xmlns="http://www.w3.org/2000/svg">`
        + `<g class="bm-zone"><rect class="bm-zone-out" x="${-m}" y="${-m}" width="${w + 2 * m}" height="${h + 2 * m}"/><rect class="bm-zone-in" width="${w}" height="${h}"/>${sq}</g>`
        + `<path class="bm-fill" d="${LOGO.d}"/>${label}</svg>`;
}

/** El contorno del logo, grande y punteado, como decorado de fondo. */
const decor = (cls) => `<svg class="bm-decor ${cls}" viewBox="0 0 ${LOGO.w} ${LOGO.h}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="${LOGO.d}"/></svg>`;

const STICKERS = [
    'Tiburón con anteojos de sol y la frase ALWAYS HUNGRY', 'Globo terráqueo con una flecha de crecimiento', 'Megáfono con la frase WE ARE BLUE',
    'Cursor sobre el agua', 'Ola con una flecha ascendente', 'Disquete sobre una ola',
    'BLUE con un cursor', 'Tiburón en círculo con un blanco', 'BLUE MKT con un ojo y una ola',
    'Aleta de tiburón con la frase SIEMPRE FLUYENDO', 'Diente de tiburón con una flecha', 'Palmera con un gráfico de barras',
    'BLUE Marketing Worldwide con una flecha', 'Barquito de papel y una alerta', 'Esqueleto surfeando con la frase SURFEANDO EL ALGORITMO',
];
const TILT = [-5, 4, -3, 6, -4, 3, -6, 5, -2, 4, -5, 3, -4, 6, -3];

const HEX = [['#00004B', 'navy'], ['#E7ECFF', 'ice'], ['#0C0C0C', 'ink']];
const ALPHA = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789#+¡¿?*'];
const WEIGHTS = [['Poppins Bold', 700], ['Poppins Medium', 500], ['Poppins Light', 300]];

export function manualHTML() {
    return `
<div class="bm-manual bm-pending">

<section class="bm-hero" data-sec="hero" aria-label="Construcción del logo">
    ${coverSVG()}
    <p class="bm-hero-top mono"><span>Manual de marca // Construcción del logo</span><button class="bm-replay" type="button" data-cursor-item data-cursor="Repetir">↻ Repetir</button></p>
</section>

<section class="bm-slide bm-var" data-sec="var">
    ${LIN}
    <h3 class="bm-title" data-in><span class="bm-bar"></span>Logo y variantes</h3>
    <figure class="bm-var-a" data-in>${safeSVG()}<figcaption>(ZONA SEGURA)</figcaption></figure>
    <figure class="bm-var-b" data-in>${safeSVG({ word: true })}</figure>
</section>

<section class="bm-slide bm-pal" data-sec="pal">
    ${LIN}
    ${decor('bm-decor--pal')}
    <h3 class="bm-title bm-pal-t" data-in><span class="bm-bar"></span>Paleta<br>Cromática</h3>
    ${HEX.map(([hex, k]) => `<div class="bm-band bm-band--${k}" data-band><span class="bm-hex" data-in>${hex}</span>${blueSVG({ cls: 'bm-band-logo' })}</div>`).join('')}
</section>

<section class="bm-slide bm-bw" data-sec="bw">
    <div class="bm-bw-l" data-half><p class="bm-lin">//Lineamientos de Marca</p><h3 class="bm-title" data-in><span class="bm-bar"></span>Blanco y negro</h3>${blueSVG({ cls: 'bm-bw-logo' })}${wavesSVG({ cls: 'bm-bw-waves', bottom: true })}</div>
    <div class="bm-bw-r" data-half>${blueSVG({ cls: 'bm-bw-logo' })}${wavesSVG({ cls: 'bm-bw-waves', bottom: true })}</div>
</section>

<section class="bm-slide bm-typ" data-sec="typ">
    ${LIN}
    <div class="bm-typ-l"><h3 class="bm-title" data-in><span class="bm-bar"></span>Tipografía</h3></div>
    ${decor('bm-decor--typ')}
    <div class="bm-typ-r">
        ${WEIGHTS.map(([name, w]) => `<div class="bm-spec" style="--w:${w}"><p class="bm-spec-n" data-in>${name}</p>${ALPHA.map((l) => `<p class="bm-spec-l" data-line>${l}</p>`).join('')}</div>`).join('')}
    </div>
</section>

<section class="bm-slide bm-stk" data-sec="stk">
    ${head('Aplicaciones // Stickers')}
    <div class="bm-stk-grid">${STICKERS.map((alt, i) => `<img class="bm-st" style="--r:${TILT[i]}deg" src="${IMG}/stickers/sticker-${i + 1}.svg" alt="${alt}" loading="lazy" decoding="async">`).join('')}</div>
</section>

<section class="bm-slide bm-posts" data-sec="posts">
    ${head('Aplicaciones // Posts de resultados')}
    <div class="bm-posts-row">${[1, 2, 3, 4, 5].map((n) => `<img class="bm-post" src="${IMG}/posts/post-${n}.webp" width="1080" height="1440" alt="Post de resultados de Blue Marketing, ${n} de 5" loading="lazy" decoding="async">`).join('')}</div>
</section>

</div>`;
}

// ---------------------------------------------------------------------------------------------------------

/**
 * Con Poppins ya cargada: cada wordmark se ajusta al ANCHO del logo (así es el lockup del cliente) y se le fija la mayúscula real;
 * el SVG que lo contiene crece lo justo para que no quede cortado.
 */
function fitWords(root) {
    const ratio = capRatio(POPPINS, 700);
    for (const t of all(root, 'text[data-w]')) {
        t.setAttribute('font-size', '100');
        const len = t.getComputedTextLength();
        if (!len) continue;
        const fs = (100 * Number(t.dataset.w)) / len;
        const y = LOGO.h + Number(t.dataset.gap) + ratio * fs;
        t.setAttribute('font-size', fs.toFixed(2));
        t.setAttribute('y', y.toFixed(2));
        const svg = t.ownerSVGElement;
        const vb = svg.viewBox.baseVal;
        // El lockup suelto (viewBox desde 0) y la zona segura (desde −margen) se agrandan hacia abajo hasta pasar la base del wordmark.
        const need = y + 8 - vb.y;
        if (need > vb.height) svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${need.toFixed(1)}`);
    }
}

const ND = '100 200';
const draw = (els) => gsap.set(els, { strokeDasharray: ND, strokeDashoffset: 100 });

/** Tapa: guías → contorno → el agua sube y llena la B (con las olas) → el logo sube y entra el wordmark. */
function heroTimeline(hero) {
    const lock = hero.querySelector('.bm-lock');
    const guides = all(hero, '.bm-g');
    const outline = hero.querySelector('.bm-outline');
    const rise = hero.querySelector('.bm-rise');
    const wA = hero.querySelector('.bm-waveA');
    const wB = hero.querySelector('.bm-waveB');
    const letters = splitLetters(hero.querySelector('.bm-word'), POPPINS, 700);

    draw(guides);
    gsap.set(outline, { strokeDasharray: ND, strokeDashoffset: 100, strokeOpacity: 1 });
    gsap.set(rise, { y: LOGO.h + 80, x: 0 });
    gsap.set(wA, { y: 340 });
    gsap.set(wB, { y: 420 });
    gsap.set(letters, { opacity: 0, y: 20 });
    gsap.set(lock, { y: LIFT });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
    tl.to(guides, { strokeDashoffset: 0, duration: 1.1, stagger: 0.09, ease: 'power2.inOut' }, 0)
        .to(outline, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.7)
        // El agua sube dentro del logo; el borde de la onda se desplaza un período para que el movimiento no se corte.
        .to(rise, { y: -40, duration: 2.4, ease: 'power2.inOut' }, 3.0)
        .to(rise, { x: -160, duration: 2.4, ease: 'none' }, 3.0)
        .to(wA, { y: 0, duration: 2.2, ease: 'power3.out' }, 2.7)
        .to(wB, { y: 0, duration: 2.4, ease: 'power3.out' }, 3.0)
        .to(outline, { strokeOpacity: 0, duration: 0.6, ease: 'power1.out' }, 5.0)
        .to(guides, { opacity: 0, duration: 0.7, ease: 'power1.in' }, 5.0)
        .to(lock, { y: 0, duration: 1.2, ease: 'power3.inOut' }, 5.4)
        .to(letters, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }, 5.9);
    return tl;
}

export async function mountManual(root) {
    const m = root.querySelector('.bm-manual');
    const cleanups = [];
    const tls = [];
    let alive = true;
    const add = (t) => { tls.push(t); return t; };

    await loadFonts(POPPINS_URL, ['300 1em Poppins', '500 1em Poppins', '700 1em Poppins'], 'Blue Marketing');
    if (!alive) return () => {};
    fitWords(m);

    if (reduced) {
        splitLetters(m.querySelector('.bm-hero .bm-word'), POPPINS, 700);
        m.classList.remove('bm-pending');
        return () => {};
    }

    m.classList.add('is-anim');
    const sec = (k) => m.querySelector(`[data-sec="${k}"]`);
    const when = [];

    // 1 · Tapa. Solo en dev, ?cbt=4.2 deja la construcción congelada en ese segundo (para sacar capturas).
    const hero = sec('hero');
    const heroTl = add(heroTimeline(hero));
    const bob = gsap.to(hero.querySelector('.bm-waveB'), { y: -8, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
    tls.push(bob);
    let built = false;
    let inView = false;
    const sync = () => (built && inView ? bob.play() : bob.pause());
    heroTl.eventCallback('onComplete', () => { built = true; sync(); });
    const seek = import.meta.env.DEV ? new URLSearchParams(location.search).get('cbt') : null;
    if (seek !== null) heroTl.time(Number(seek)); else when.push([hero, () => heroTl.play()]);
    const replay = () => { built = false; bob.pause(); gsap.set(hero.querySelector('.bm-waveB'), { y: 420 }); heroTl.restart(); };
    hero.querySelector('.bm-replay').addEventListener('click', replay);
    // La ola del fondo se mece solo mientras la tapa se ve.
    const heroIo = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.2 });
    heroIo.observe(hero);
    cleanups.push(() => heroIo.disconnect());

    // 2 · Logo y variantes: las zonas seguras aparecen y el logo se asienta
    const vars = sec('var');
    const varTl = add(enterTimeline(vars, { y: 24, stagger: 0.25, duration: 0.9 }));
    const zones = all(vars, '.bm-zone');
    gsap.set(zones, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', transformBox: 'fill-box' });
    varTl.to(zones, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.2, ease: 'power3.out' }, 0.5);
    when.push([vars, () => varTl.play()]);

    // 3 · Paleta: las bandas se abren desde la izquierda
    const pal = sec('pal');
    const palTl = add(enterTimeline(pal, { y: 20, stagger: 0.18 }));
    const bands = all(pal, '[data-band]');
    const bandLogos = all(pal, '.bm-band-logo');
    gsap.set(bands, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(bandLogos, { opacity: 0, y: 24 });
    palTl.to(bands, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, stagger: 0.2, ease: 'power3.inOut' }, 0.1)
        .to(bandLogos, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 0.9);
    when.push([pal, () => palTl.play()]);

    // 4 · Blanco y negro: cada mitad entra desde su lado
    const bw = sec('bw');
    const bwTl = add(enterTimeline(bw, { y: 0 }));
    const [bwL, bwR] = all(bw, '[data-half]');
    const bwLogos = all(bw, '.bm-bw-logo');
    const bwWaves = all(bw, '.bm-bw-waves');
    gsap.set(bwL, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(bwR, { clipPath: 'inset(0 0 0 100%)' });
    gsap.set(bwLogos, { opacity: 0, y: 30 });
    gsap.set(bwWaves, { yPercent: 40 });
    bwTl.to([bwL, bwR], { clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: 'power3.inOut' }, 0)
        .to(bwLogos, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, 0.7)
        .to(bwWaves, { yPercent: 0, duration: 1.3, stagger: 0.15, ease: 'power3.out' }, 0.6);
    when.push([bw, () => bwTl.play()]);

    // 5 · Tipografía: cada línea se descubre de izquierda a derecha
    const typ = sec('typ');
    const typTl = add(enterTimeline(typ, { y: 18, stagger: 0.12 }));
    const lines = all(typ, '[data-line]');
    gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' });
    typTl.to(lines, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, stagger: 0.09, ease: 'power3.inOut' }, 0.4);
    when.push([typ, () => typTl.play()]);

    // 6 · Stickers: cada uno cae y se pega
    const stk = sec('stk');
    const stkTl = add(enterTimeline(stk, { y: 0, duration: 0.5 }));
    const stickers = all(stk, '.bm-st');
    gsap.set(stickers, { opacity: 0, y: -160, scale: 1.3, rotation: (i) => TILT[i] + (i % 2 ? 14 : -14) });
    stkTl.to(stickers, { opacity: 1, y: 0, scale: 1, rotation: (i) => TILT[i], duration: 0.8, stagger: 0.09, ease: 'back.out(1.5)' }, 0.3);
    when.push([stk, () => stkTl.play()]);

    // 7 · Posts de resultados: suben de a uno
    const posts = sec('posts');
    const postsTl = add(enterTimeline(posts, { y: 0 }));
    const pics = all(posts, '.bm-post');
    gsap.set(pics, { opacity: 0, y: 70 });
    postsTl.to(pics, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.2);
    when.push([posts, () => postsTl.play()]);

    m.classList.remove('bm-pending');
    cleanups.push(onceInView(when, { threshold: 0.3 }));

    return () => {
        alive = false;
        cleanups.forEach((fn) => fn());
        hero.querySelector('.bm-replay')?.removeEventListener('click', replay);
        tls.forEach((t) => t.kill());
    };
}
