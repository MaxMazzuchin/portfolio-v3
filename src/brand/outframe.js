import './outframe.css';
import gsap from 'gsap';
import { onceInView, loadFonts, fitCaps, reduced } from './motion.js';

// Outframe (publicación sobre Chema Madoz) con la maquetación armada en código: portada, 4 dobles páginas
// y las dos láminas que ya traen el texto impreso encima de la foto (esas siguen siendo imagen).
// Las fotos son recortes de las láminas originales (scripts/outframe-photos.mjs).

export const pieces = 7;

const FOTOS = '/images/projects/outframe/fotos';
const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter+Tight:wght@300;400&display=swap';
const ANTON = '"Anton"';

const LOREM = 'consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. ';
const lorem = (n) => LOREM.repeat(Math.ceil(n / LOREM.length)).slice(0, n).trim();
const H = 'Lorem ipsuLorem ipsum dolor sit amet,';

// Posición y ancho en "u": 1 u = 1 px de una doble página de 1757 px de ancho.
const at = (x, y, w, h) => `style="left:calc(var(--u)*${x});top:calc(var(--u)*${y});${w ? `width:calc(var(--u)*${w});` : ''}${h ? `height:calc(var(--u)*${h});` : ''}"`;
const photo = (name, x, y, w, h, extra = '', alt = '') => `<div class="of-ph ${extra}" ${at(x, y, w, h)}><img src="${FOTOS}/${name}.webp" alt="${alt}" loading="lazy" decoding="async"></div>`;
// Bloque de texto: título opcional y párrafos de n caracteres.
const block = (x, y, w, { h, tone = 'red', center = false, ps = [] }) => `<div class="of-tx${center ? ' of-tx--c' : ''}" ${at(x, y, w)}>${h ? `<p class="of-h of-h--${tone}">${h}</p>` : ''}${ps.map((n) => `<p class="of-p">${lorem(n)}</p>`).join('')}</div>`;

// Tapa: vidrio esmerilado (filtro de iluminación sobre ruido), "OUT / FRA / ME" con la foto de Madoz dentro de las letras.
// Coordenadas en el espacio de la tapa original reducida a 1100 px de ancho.
const LINES = [['OUT', 244, 563, 604], ['FRA', 251, 863, 596], ['ME', 318, 1165, 451]];
function frontSheet() {
    return `<svg class="of-art" viewBox="0 0 1100 1543" role="img" aria-label="Tapa de Outframe: las letras OUT FRA ME en rojo con una foto de Chema Madoz adentro" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="ofGlass" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.026" numOctaves="3" seed="12" result="t"/>
    <feDiffuseLighting in="t" surfaceScale="5.5" diffuseConstant="1.15" lighting-color="#fff"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting>
  </filter>
  <radialGradient id="ofFade" cx="550" cy="760" r="620" gradientUnits="userSpaceOnUse" gradientTransform="translate(550 760) scale(.72 1) translate(-550 -760)"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></radialGradient>
  <mask id="ofGlassMask"><rect width="1100" height="1543" fill="url(#ofFade)"/></mask>
  <pattern id="ofPhoto" patternUnits="userSpaceOnUse" x="200" y="240" width="700" height="970"><image href="${FOTOS}/letras-foto.webp" width="700" height="970" preserveAspectRatio="none"/></pattern>
  ${LINES.map(([, , y], i) => `<clipPath id="ofLn${i}"><rect class="of-reveal" x="200" y="${y - 300}" width="700" height="326"/></clipPath>`).join('')}
</defs>
<rect width="1100" height="1543" fill="#e8e8e7"/>
<rect width="1100" height="1543" filter="url(#ofGlass)" mask="url(#ofGlassMask)" opacity=".62" style="mix-blend-mode:multiply"/>
${LINES.map(([t, x, y, w], i) => `<g clip-path="url(#ofLn${i})"><text class="of-word" x="${x}" y="${y}" data-cap="282" font-size="390" textLength="${w}" lengthAdjust="spacingAndGlyphs" fill="url(#ofPhoto)" style="font-family:'Anton','Archivo Black',sans-serif">${t}</text></g>`).join('')}
<rect x="8" y="8" width="1084" height="1527" fill="none" stroke="#fafafa" stroke-width="16"/>
</svg>`;
}

// Contratapa: filas de OUTFRAME en contorno sobre rojo; los círculos "llenan" de blanco las letras que cruzan.
const CIRCLES = [[590, 110, 225], [90, 470, 225], [560, 730, 255], [220, 990, 245]];
function backSheet() {
    const rows = () => Array.from({ length: 10 }, (_, k) => `<text x="75" y="${172 + (k - 1) * 131.7}" data-cap="108" font-size="150" textLength="655" lengthAdjust="spacingAndGlyphs" style="font-family:'Anton','Archivo Black',sans-serif">OUTFRAME</text>`).join('');
    return `<svg class="of-art" viewBox="0 0 800 1122" role="img" aria-label="Contratapa de Outframe: filas de la palabra OUTFRAME sobre fondo rojo" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="ofCircles">${CIRCLES.map(([x, y, r]) => `<circle class="of-circ" cx="${x}" cy="${y}" r="${r}" data-r="${r}"/>`).join('')}</clipPath></defs>
<rect width="800" height="1122" fill="#f0413a"/>
<g fill="none" stroke="#fbeae6" stroke-width="1.3" stroke-opacity=".85">${rows()}</g>
<g clip-path="url(#ofCircles)" fill="#f8f3ef">${rows()}</g>
<text x="392" y="406" data-cap="64" font-size="90" textLength="337" lengthAdjust="spacingAndGlyphs" fill="#f8f3ef" style="font-family:'Anton','Archivo Black',sans-serif">OUTFRAME.</text>
<rect x="6" y="6" width="788" height="1110" fill="none" stroke="#fafafa" stroke-width="12"/>
</svg>`;
}

const spreads = {
    retrato: `
        ${photo('retrato', 12, 13, 1730, 607, 'of-ph--wide', 'Chema Madoz sentado en un banco')}
        ${block(120, 640, 300, { h: 'Lorem ipsum', tone: 'ink' })}
        <p class="of-big" ${at(92, 1010)}>Chema Madoz</p>
        ${block(989, 652, 643, { h: 'Lorem ipsuLorem ipsum dolor sit amet', center: true, ps: [520] })}
        ${block(989, 800, 255, { ps: [560, 250] })}
        ${block(1377, 796, 255, { ps: [560, 250] })}`,
    platos: `
        ${block(121, 138, 247, { h: H, ps: [520, 1450] })}
        ${photo('platos', 377, 133, 745, 970, 'of-ph--arch-a', 'Platos apilados en una rejilla')}
        ${photo('piedras', 1382, 133, 365, 970, 'of-ph--arch-b', 'Dos piedras sobre una maceta')}
        ${block(1133, 628, 235, { h: H, ps: [520, 340] })}`,
    lampara: `
        ${photo('lampara', 120, 133, 257, 717, '', 'Una lámpara con helicópteros dentro de la bombita')}
        ${block(121, 880, 255, { h: H, tone: 'ink', ps: [560] })}
        <p class="of-big of-big--s" ${at(509, 134)}>Lorem ipsum</p>
        ${block(509, 224, 255, { h: H, tone: 'ink', ps: [600] })}
        ${photo('piramides', 509, 521, 1171, 586, 'of-ph--arch-c', 'Figuras geométricas de madera y una pera')}
        ${block(1400, 168, 262, { h: H, ps: [330, 200] })}`,
    blobs: `
        ${photo('arbol', 0, 0, 480, 470, 'of-ph--blob-a', 'Un árbol seco contra las nubes')}
        ${block(121, 532, 255, { h: H, tone: 'ink', ps: [1250] })}
        ${block(508, 438, 255, { h: H, tone: 'ink', ps: [470] })}
        ${block(508, 778, 255, { h: H, tone: 'ink', ps: [600] })}
        ${photo('cipres', 920, 3, 470, 1237, 'of-ph--pill', 'Un ciprés con una campana adentro')}
        ${block(1420, 138, 250, { h: H, tone: 'ink', ps: [1000] })}
        ${block(1420, 760, 250, { h: H, tone: 'ink', ps: [520] })}`,
};

const spread = (key, label, cls = '') => `
<section class="of-slide" data-sec="${key}">
    <p class="of-head mono">${label}</p>
    <div class="of-spread ${cls}"><div class="of-gutter"></div>${spreads[key]}</div>
</section>`;

const imageSpread = (key, label, src, alt) => `
<section class="of-slide" data-sec="${key}">
    <p class="of-head mono">${label}</p>
    <div class="of-spread of-spread--img"><img src="${FOTOS}/${src}.webp" alt="${alt}" width="2108" height="1488" loading="lazy" decoding="async"></div>
</section>`;

export function manualHTML() {
    return `
<div class="of-manual of-pending">

<section class="of-cover" data-sec="cover" aria-label="Tapa y contratapa">
    <p class="of-cover-top mono">Publicación // Tapa y contratapa</p>
    <div class="of-stage">
        <div class="of-sheet of-sheet--back">${backSheet()}</div>
        <div class="of-sheet of-sheet--front">${frontSheet()}</div>
    </div>
    <p class="of-cover-bot mono"><span>Chema Madoz</span><button class="of-replay" type="button" data-cursor-item data-cursor="Repetir">↻ Repetir</button></p>
</section>

${spread('retrato', 'Doble página 01 // Retrato')}
${spread('platos', 'Doble página 02 // Platos y piedras')}
${spread('lampara', 'Doble página 03 // Lámpara y figuras')}
${spread('blobs', 'Doble página 04 // Formas')}
${imageSpread('manos', 'Doble página 05 // Texto sobre los hilos', 'manos', 'Dos manos de yeso sostienen hilos hechos de texto')}
${imageSpread('avion', 'Doble página 06 // A página completa', 'avion', 'Un avión a escala entre troncos en un campo de nieve')}

</div>`;
}

// ---------------------------------------------------------------------------------------------------------

const all = (root, sel) => [...root.querySelectorAll(sel)];

function coverTimeline(sec) {
    const front = sec.querySelector('.of-sheet--front');
    const back = sec.querySelector('.of-sheet--back');
    const reveals = all(front, '.of-reveal');
    const circs = all(back, '.of-circ');
    gsap.set(front, { opacity: 0, y: 90, rotate: -5 });
    gsap.set(back, { opacity: 0, y: 60, rotate: 7, x: -40 });
    gsap.set(reveals, { attr: { width: 0 } });
    gsap.set(circs, { attr: { r: 0 } });
    const tl = gsap.timeline({ paused: true });
    tl.to(back, { opacity: 1, y: 0, x: 0, rotate: 4, duration: 1.2, ease: 'power4.out' }, 0)
        .to(front, { opacity: 1, y: 0, rotate: -2.5, duration: 1.2, ease: 'power4.out' }, 0.2)
        .to(reveals, { attr: { width: 700 }, duration: 0.9, stagger: 0.25, ease: 'power3.inOut' }, 0.9)
        .to(circs, { attr: { r: (i, el) => Number(el.dataset.r) }, duration: 1.6, stagger: 0.2, ease: 'power2.inOut' }, 0.7);
    return tl;
}

/** La doble página se abre desde el pliegue; después entran fotos, títulos y párrafos. */
function spreadTimeline(sec) {
    const paper = sec.querySelector('.of-spread');
    const photos = all(sec, '.of-ph');
    const imgs = all(sec, '.of-ph img, .of-spread--img img');
    const heads = all(sec, '.of-h, .of-big');
    const paras = all(sec, '.of-p');
    const tl = gsap.timeline({ paused: true });
    gsap.set(paper, { clipPath: 'inset(0 50% 0 50%)' });
    tl.to(paper, { clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: 'power3.inOut' }, 0);
    // Los grupos que la lámina no tiene (por ejemplo las láminas que son una foto entera) no se animan.
    if (photos.length) {
        gsap.set(photos, { clipPath: 'inset(0 0 100% 0)' });
        tl.to(photos, { clipPath: 'inset(0 0 0% 0)', duration: 1, stagger: 0.18, ease: 'power3.inOut' }, 0.7);
    }
    if (imgs.length) {
        gsap.set(imgs, { scale: 1.18 });
        tl.to(imgs, { scale: 1, duration: 1.8, stagger: 0.18, ease: 'power2.out' }, 0.7);
    }
    if (heads.length) {
        gsap.set(heads, { opacity: 0, y: 16 });
        tl.to(heads, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 1.2);
    }
    if (paras.length) {
        gsap.set(paras, { opacity: 0, y: 16 });
        tl.to(paras, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 1.4);
    }
    return tl;
}

export async function mountManual(root) {
    const m = root.querySelector('.of-manual');
    let alive = true;

    await loadFonts(FONTS, ['1em "Anton"', '1em "Archivo Black"', '300 1em "Inter Tight"', '400 1em "Inter Tight"'], 'OUT FRA ME');
    fitCaps(root, ANTON, 400);
    if (!alive) return () => {};
    if (reduced) { m.classList.remove('of-pending'); return () => {}; }

    const tls = [];
    const when = [];
    const sec = (k) => m.querySelector(`[data-sec="${k}"]`);

    const cover = sec('cover');
    const cTl = coverTimeline(cover);
    tls.push(cTl);
    when.push([cover, () => cTl.play()]);
    const replay = () => cTl.restart();
    cover.querySelector('.of-replay').addEventListener('click', replay);
    // Las láminas se inclinan siguiendo al puntero.
    const stage = cover.querySelector('.of-stage');
    const tx = gsap.quickTo(stage, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const ty = gsap.quickTo(stage, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    gsap.set(stage, { transformPerspective: 1400 });
    const onMove = (e) => { const r = cover.getBoundingClientRect(); tx(((e.clientX - r.left) / r.width - 0.5) * 14); ty(-((e.clientY - r.top) / r.height - 0.5) * 10); };
    const onLeave = () => { tx(0); ty(0); };
    cover.addEventListener('pointermove', onMove);
    cover.addEventListener('pointerleave', onLeave);

    for (const k of ['retrato', 'platos', 'lampara', 'blobs', 'manos', 'avion']) {
        const s = sec(k);
        const tl = spreadTimeline(s);
        tls.push(tl);
        when.push([s, () => tl.play()]);
    }

    m.classList.remove('of-pending');
    const stop = onceInView(when, { threshold: 0.25 });

    return () => {
        alive = false;
        stop();
        cover.querySelector('.of-replay')?.removeEventListener('click', replay);
        cover.removeEventListener('pointermove', onMove);
        cover.removeEventListener('pointerleave', onLeave);
        tls.forEach((t) => t.kill());
    };
}
