import './d2x.css';
import gsap from 'gsap';
import { onceInView, loadFonts, fitCaps, reduced } from './motion.js';

// D2X Magazine: la tapa y la primera doble página están armadas en código con recortes de las fotos del mockup
// (scripts/d2x-photos.mjs). Las otras cuatro dobles son mockups con perspectiva: quedan como imagen.

export const pieces = 6;

const FOTOS = '/images/projects/d2x/fotos';
const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&display=swap';
const ORANGE = '#ff6a0d';

const all = (root, sel) => [...root.querySelectorAll(sel)];

// Código de barras: anchos pseudoaleatorios pero siempre los mismos.
function barcode(x, y, w, h) {
    let seed = 7, cx = x, out = '';
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    while (cx < x + w - 3) {
        const bar = 1.6 + Math.floor(rnd() * 3) * 1.8;
        const gap = 1.4 + Math.floor(rnd() * 3) * 1.5;
        out += `<rect class="dx-bar" x="${cx.toFixed(1)}" y="${y}" width="${bar.toFixed(1)}" height="${h}" fill="#0c0c0c"/>`;
        cx += bar + gap;
    }
    return out;
}

const HEADS = [
    [['BACKGROUND', 596, 212], ['HISTORY', 643, 120]],
    [['LIFE-CHANGING', 795, 232], ['ALBUMS', 843, 132]],
    [['CREATIVITY &', 996, 216], ['INSPIRATION', 1044, 206]],
];

function cover() {
    const frames = [[89, 'marco-1'], [464, 'marco-2'], [840, 'marco-3']];
    return `<svg class="dx-art" viewBox="0 0 1000 1376" role="img" aria-label="Tapa de D2X Magazine: D2X en naranja, el artista con los brazos cruzados y tres fotos en marcos" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="dxNoise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 -.18"/></filter>
  <linearGradient id="dxFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".42" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <linearGradient id="dxFadeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <mask id="dxPortraitMask"><rect x="309" y="424" width="332" height="706" fill="url(#dxFade)"/></mask>
  <mask id="dxPortraitMask2"><rect x="309" y="424" width="332" height="706" fill="url(#dxFadeV)" mask="url(#dxPortraitMask)"/></mask>
  <linearGradient id="dxWrap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  ${[0, 1, 2].map((i) => `<clipPath id="dxFr${i}"><rect x="662" y="${frames[i][0] + 8}" width="300" height="334"/></clipPath>`).join('')}
  <clipPath id="dxTitleClip"><rect class="dx-reveal" x="30" y="215" width="600" height="200"/></clipPath>
</defs>
<rect width="1000" height="1376" fill="#0c0c0c"/>
<g class="dx-strip"><rect x="647" y="28" width="329" height="1348" fill="${ORANGE}"/>
${frames.map(([y, img], i) => `<g class="dx-frame"><rect x="654" y="${y}" width="316" height="350" fill="#fff" stroke="#0c0c0c" stroke-width="4"/><image href="${FOTOS}/${img}.webp" x="662" y="${y + 8}" width="300" height="334" preserveAspectRatio="xMidYMid slice" clip-path="url(#dxFr${i})"/></g>`).join('')}
<g class="dx-code"><rect x="707" y="1213" width="211" height="107" fill="#fff" stroke="#0c0c0c" stroke-width="3"/>${barcode(722, 1226, 182, 56)}<text x="812" y="1308" text-anchor="middle" font-size="13" fill="#0c0c0c" style="font-family:'Roboto Mono',monospace;letter-spacing:.06em">0045406271</text></g>
</g>
<g class="dx-portrait"><image href="${FOTOS}/retrato.webp" x="309" y="424" width="332" height="706" preserveAspectRatio="xMidYMid slice" mask="url(#dxPortraitMask2)"/></g>
<text class="dx-tag" x="47" y="211" data-cap="36" font-size="50" textLength="568" lengthAdjust="spacing" fill="#f4f1ea" style="font-family:'Anton',sans-serif;letter-spacing:.16em">CHICAGO UNDERGROUND GEMS</text>
<g clip-path="url(#dxTitleClip)"><text class="dx-title" x="47" y="400" data-cap="172" font-size="235" textLength="566" lengthAdjust="spacingAndGlyphs" fill="${ORANGE}" style="font-family:'Archivo Black',sans-serif">D2X</text></g>
${HEADS.map((lines, i) => `<g class="dx-head">${lines.map(([t, y, w]) => `<text x="71" y="${y}" data-cap="40" font-size="55" textLength="${w}" lengthAdjust="spacingAndGlyphs" fill="#f4f1ea" style="font-family:'Anton',sans-serif">${t}</text>`).join('')}<rect class="dx-underline" x="71" y="${[655, 858, 1057][i]}" width="112" height="11" fill="${ORANGE}"/></g>`).join('')}
<text class="dx-era" x="73" y="1243" data-cap="70" font-size="96" textLength="500" lengthAdjust="spacingAndGlyphs" fill="#f4f1ea" style="font-family:'Anton',sans-serif">THE HUNGER ERA</text>
<g class="dx-sticker" transform="translate(222 1190) rotate(-3)"><rect x="-130" y="-76" width="260" height="152" rx="9" fill="#d3d2cd" opacity=".93"/><text x="0" y="34" text-anchor="middle" font-size="112" fill="#111" style="font-family:'Times New Roman',serif;font-style:italic;font-weight:700">M</text></g>
<text x="73" y="1346" data-cap="26" font-size="36" fill="#f4f1ea" style="font-family:'Anton',sans-serif;letter-spacing:.02em">2024 - 2025</text>
<rect width="1000" height="1376" fill="url(#dxWrap)"/>
<rect width="1000" height="1376" filter="url(#dxNoise)" opacity=".5" style="mix-blend-mode:screen"/>
<rect x="6" y="6" width="988" height="1364" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
</svg>`;
}

// Doble 1-2: coordenadas en unidades de una doble de 1089 de ancho.
const at = (x, y, w, h) => `style="left:calc(var(--u)*${x});top:calc(var(--u)*${y});${w ? `width:calc(var(--u)*${w});` : ''}${h ? `height:calc(var(--u)*${h});` : ''}"`;
const photo = (name, x, y, w, h, alt) => `<div class="dx-ph" ${at(x, y, w, h)}><img src="${FOTOS}/${name}.webp" alt="${alt}" loading="lazy" decoding="async"></div>`;

function spreadOne() {
    return `
        <svg class="dx-d2x" ${at(27, 30, 481, 120)} viewBox="0 0 481 120" aria-hidden="true"><text x="0" y="118" data-cap="116" font-size="160" textLength="481" lengthAdjust="spacingAndGlyphs" fill="${ORANGE}" style="font-family:'Archivo Black',sans-serif">D2X</text></svg>
        <p class="dx-p dx-p--lead" ${at(27, 156, 485)}>Chicago rapper Demauris “D2x” Dixon performs like he insists on giving his absolute best to every facet of his life. Sometimes that pressure gets to him—when he races to squeeze a knotty, weighty lyric into an otherwise easygoing verse, for instance, he can disrupt his crisp flow and casual charisma.</p>
        ${photo('disqueria', 27, 199, 510, 548, 'D2X sentado en el piso de una disquería')}
        <h3 class="dx-who" ${at(580, 30, 232)}>WHO IS D2X?</h3>
        <div class="dx-tx" ${at(814, 20, 262)}>
            <p class="dx-p">D2X is a rising star in the hip-hop scene, known for his raw energy, introspective lyrics, and innovative production. His music is a fusion of various genres, including trap, R&B, and alternative hip-hop, creating a unique sound that sets him apart from his peers.</p>
            <p class="dx-p">With his latest project, "The Hunger Era," D2X has solidified his position as a force to be reckoned with. The album showcases his growth as an artist, both lyrically and sonically. The production is top-notch, blending hard-hitting beats with atmospheric soundscapes.</p>
            <p class="dx-p">Beyond his music, D2X is known for his strong work ethic and dedication to his craft. He's constantly pushing boundaries, experimenting with new sounds, and collaborating with other talented artists.</p>
        </div>
        ${photo('estantes', 552, 191, 218, 552, 'Estantes de discos de la disquería')}
        ${photo('escenario', 781, 191, 288, 231, 'D2X sobre un escenario con luz roja')}
        ${photo('esmoquin', 781, 434, 288, 256, 'D2X con esmoquin acomodándose el moño')}
        <p class="dx-p dx-p--cap" ${at(781, 698, 288)}>As D2X continues to rise through the ranks, it's clear that he's just getting started. With his passion, talent, and unwavering drive, he's poised to make a significant impact on the music industry.</p>
        <span class="dx-pg" ${at(500, 724)}>1</span><span class="dx-pg" ${at(1064, 724)}>2</span>`;
}

const imageSpread = (key, label, n, alt) => `
<section class="dx-slide" data-sec="${key}">
    <p class="dx-head-l mono">${label}</p>
    <div class="dx-spread dx-spread--img"><img src="${FOTOS}/doble-${n}.webp" alt="${alt}" width="1700" height="1195" loading="lazy" decoding="async"></div>
</section>`;

export function manualHTML() {
    return `
<div class="dx-manual dx-pending">

<section class="dx-cover" data-sec="cover" aria-label="Tapa">
    <p class="dx-cover-top mono">Revista // Tapa</p>
    <div class="dx-stage"><div class="dx-sheet">${cover()}</div></div>
    <p class="dx-cover-bot mono"><span>D2X Magazine // 01 · Volume 1</span><button class="dx-replay" type="button" data-cursor-item data-cursor="Repetir">↻ Repetir</button></p>
</section>

<section class="dx-slide" data-sec="s1">
    <p class="dx-head-l mono">Doble página 01 // Quién es D2X</p>
    <div class="dx-spread"><div class="dx-gutter"></div>${spreadOne()}</div>
</section>

${imageSpread('s2', 'Doble página 02 // Chase passion, not perfection', 2, 'Doble página con el título CHASE PASSION NOT PERFECTION sobre una foto en una escalinata y una entrevista con ilustración')}
${imageSpread('s3', 'Doble página 03 // Discos que cambiaron todo', 3, 'Doble página con los álbumes que cambiaron su vida y un aviso retro')}
${imageSpread('s4', 'Doble página 04 // The Hunger Era', 4, 'Doble página con la tapa ilustrada del álbum The Hunger Era y una entrevista')}
${imageSpread('s5', 'Doble página 05 // El proceso creativo', 5, 'Doble página con The creative process y un consejo para jóvenes creativos')}

</div>`;
}

// ---------------------------------------------------------------------------------------------------------

function coverTimeline(sec) {
    const strip = sec.querySelector('.dx-strip');
    const frames = all(sec, '.dx-frame');
    const code = sec.querySelector('.dx-code');
    const title = sec.querySelector('.dx-reveal');
    const tag = sec.querySelector('.dx-tag');
    const heads = all(sec, '.dx-head text');
    const bars = all(sec, '.dx-underline');
    const portrait = sec.querySelector('.dx-portrait');
    const era = sec.querySelector('.dx-era');
    const sticker = sec.querySelector('.dx-sticker');
    const sheet = sec.querySelector('.dx-sheet');
    gsap.set(sheet, { opacity: 0, y: 80, rotate: 3 });
    gsap.set(strip, { scaleY: 0, transformBox: 'fill-box', transformOrigin: '50% 0%' });
    gsap.set(frames, { opacity: 0, scale: 0.85, transformBox: 'fill-box', transformOrigin: '50% 50%' });
    gsap.set(code, { opacity: 0 });
    gsap.set(title, { attr: { width: 0 } });
    gsap.set([tag, era], { opacity: 0, y: 24 });
    gsap.set(heads, { opacity: 0, x: -30 });
    gsap.set(bars, { attr: { width: 0 } });
    gsap.set(portrait, { opacity: 0 });
    gsap.set(sticker, { opacity: 0, scale: 0.6, transformBox: 'fill-box', transformOrigin: '50% 50%' });
    const tl = gsap.timeline({ paused: true });
    tl.to(sheet, { opacity: 1, y: 0, rotate: -1.5, duration: 1.1, ease: 'power4.out' }, 0)
        .to(strip, { scaleY: 1, duration: 1, ease: 'power3.inOut' }, 0.4)
        .to(frames, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.18, ease: 'back.out(1.8)' }, 1.0)
        .to(code, { opacity: 1, duration: 0.5 }, 1.7)
        .to(title, { attr: { width: 600 }, duration: 0.9, ease: 'power3.inOut' }, 0.7)
        .to(tag, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.5)
        .to(portrait, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 1.0)
        .to(heads, { opacity: 1, x: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out' }, 1.4)
        .to(bars, { attr: { width: 112 }, duration: 0.6, stagger: 0.18, ease: 'power3.out' }, 1.7)
        .to(era, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 2.2)
        .to(sticker, { opacity: 0.93, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, 2.6);
    return tl;
}

function spreadTimeline(sec) {
    const paper = sec.querySelector('.dx-spread');
    const photos = all(sec, '.dx-ph');
    const imgs = all(sec, '.dx-ph img, .dx-spread--img img');
    const heads = all(sec, '.dx-d2x, .dx-who');
    const paras = all(sec, '.dx-p');
    const tl = gsap.timeline({ paused: true });
    gsap.set(paper, { clipPath: 'inset(0 50% 0 50%)' });
    tl.to(paper, { clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: 'power3.inOut' }, 0);
    if (photos.length) {
        gsap.set(photos, { clipPath: 'inset(0 0 100% 0)' });
        tl.to(photos, { clipPath: 'inset(0 0 0% 0)', duration: 1, stagger: 0.16, ease: 'power3.inOut' }, 0.7);
    }
    if (imgs.length) {
        gsap.set(imgs, { scale: 1.12 });
        tl.to(imgs, { scale: 1, duration: 1.8, stagger: 0.16, ease: 'power2.out' }, 0.7);
    }
    if (heads.length) {
        gsap.set(heads, { opacity: 0, y: 30 });
        tl.to(heads, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 1.0);
    }
    if (paras.length) {
        gsap.set(paras, { opacity: 0, y: 14 });
        tl.to(paras, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 1.4);
    }
    return tl;
}

export async function mountManual(root) {
    const m = root.querySelector('.dx-manual');
    let alive = true;
    await loadFonts(FONTS, ['1em "Anton"', '1em "Archivo Black"'], 'D2X');
    if (!alive) return () => {};
    fitCaps(root, '"Anton"', 400, 'text[data-cap][style*="Anton"]');
    fitCaps(root, '"Archivo Black"', 400, 'text[data-cap][style*="Archivo"]');
    if (reduced) { m.classList.remove('dx-pending'); return () => {}; }

    const tls = [];
    const when = [];
    const sec = (k) => m.querySelector(`[data-sec="${k}"]`);

    const cover = sec('cover');
    const cTl = coverTimeline(cover);
    tls.push(cTl);
    when.push([cover, () => cTl.play()]);
    const replay = () => cTl.restart();
    cover.querySelector('.dx-replay').addEventListener('click', replay);
    const stage = cover.querySelector('.dx-stage');
    const tx = gsap.quickTo(stage, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const ty = gsap.quickTo(stage, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    gsap.set(stage, { transformPerspective: 1400 });
    const onMove = (e) => { const r = cover.getBoundingClientRect(); tx(((e.clientX - r.left) / r.width - 0.5) * 14); ty(-((e.clientY - r.top) / r.height - 0.5) * 10); };
    const onLeave = () => { tx(0); ty(0); };
    cover.addEventListener('pointermove', onMove);
    cover.addEventListener('pointerleave', onLeave);

    for (const k of ['s1', 's2', 's3', 's4', 's5']) {
        const s = sec(k);
        const tl = spreadTimeline(s);
        tls.push(tl);
        when.push([s, () => tl.play()]);
    }

    m.classList.remove('dx-pending');
    const stop = onceInView(when, { threshold: 0.25 });
    return () => {
        alive = false;
        stop();
        cover.querySelector('.dx-replay')?.removeEventListener('click', replay);
        cover.removeEventListener('pointermove', onMove);
        cover.removeEventListener('pointerleave', onLeave);
        tls.forEach((t) => t.kill());
    };
}
