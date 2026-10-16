// Stickers y papelería de Nyro dibujados en SVG (sin imágenes): papel con grano, sombras, esquinas despegadas,
// arrugas, libreta cosida con piolín y lapicera. Se usan el isotipo y el wordmark del logo reconstruido.
import { nParts, tileD, TILE_SIZE } from './nyro-logo.js';

const LIME = '#b8dc00';
const LIME2 = '#b9d624';
const INK = '#2b2d24';
const TEAL = '#243a3b';
const N_D = nParts(0, 0).join('');
const TILE_D = tileD();
const WORD = 'font-family:"Spline Sans","Inter Tight",sans-serif;font-weight:700;letter-spacing:-0.02em';

const nIcon = (x, y, size, fill) => `<path transform="translate(${x} ${y}) scale(${size / 300})" d="${N_D}" fill="${fill}"/>`;
const tile = (x, y, side, fill, rot = 0) => `<path transform="translate(${x} ${y}) rotate(${rot} ${side / 2} ${side / 2}) scale(${side / TILE_SIZE})" d="${TILE_D}" fill="${fill}" fill-rule="evenodd"/>`;
const tileLine = (x, y, side, stroke, w) => `<path transform="translate(${x} ${y}) scale(${side / TILE_SIZE})" d="${TILE_D}" fill="none" stroke="${stroke}" stroke-width="${w}" vector-effect="non-scaling-stroke" fill-rule="evenodd"/>`;
// El wordmark mide ~3,15 veces su mayúscula; el cuadrado va a la izquierda, a 1,159 de mayúscula.
const word = (x, base, cap, fill) => `<text x="${x}" y="${base}" data-cap="${cap}" font-size="${cap * 1.4}" fill="${fill}" style="${WORD}">Nyro</text>`;
const wordLine = (x, base, cap, stroke, w) => `<text x="${x}" y="${base}" data-cap="${cap}" font-size="${cap * 1.4}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" style="${WORD}">Nyro</text>`;
const lock = (x, y, cap, fill) => `<g>${tile(x, y, cap, fill)}${word(x + cap * 1.159, y + cap, cap, fill)}</g>`;
const lockLine = (x, y, cap, stroke, w) => `<g>${tileLine(x, y, cap, stroke, w)}${wordLine(x + cap * 1.159, y + cap, cap, stroke, w)}</g>`;
const LOCK_LEN = 4.31; // largo del lockup en mayúsculas

const circ = (r) => `M${-r} 0A${r} ${r} 0 1 0 ${r} 0A${r} ${r} 0 1 0 ${-r} 0Z`;
const rect = (w, h) => `M${-w / 2} ${-h / 2}H${w / 2}V${h / 2}H${-w / 2}Z`;

const DEFS = (p) => `<defs>
    <filter id="${p}Shadow" x="-25%" y="-25%" width="150%" height="155%"><feDropShadow dx="0" dy="12" stdDeviation="11" flood-color="#000" flood-opacity="0.42"/></filter>
    <filter id="${p}Noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -0.38"/></filter>
    <filter id="${p}Blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>
    <linearGradient id="${p}Cream" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f3e6"/><stop offset="1" stop-color="#cdccb8"/></linearGradient>
    <linearGradient id="${p}Crease" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".11"/><stop offset=".5" stop-color="#000" stop-opacity=".38"/><stop offset=".58" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="${p}Dark" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#4a4d4a"/><stop offset="1" stop-color="#353835"/></radialGradient>
    <linearGradient id="${p}Flap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55574a"/><stop offset="1" stop-color="#2f3025"/></linearGradient>
    <linearGradient id="${p}FlapLime" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e1f06a"/><stop offset="1" stop-color="#9fbd12"/></linearGradient>
</defs>`;

// Un sticker: capa exterior para animar (se mueve alrededor de su centro), capa interior con su rotación y sombra.
const sticker = (id, cx, cy, rot, shape, content, extra = '', grain = 0.1) => `
<g class="st-wrap" data-cx="${cx}" data-cy="${cy}">
  <g transform="translate(${cx} ${cy}) rotate(${rot})" filter="url(#stShadow)">
    <clipPath id="stc-${id}"><path d="${shape}"/></clipPath>
    <g clip-path="url(#stc-${id})">${content}<rect x="-330" y="-330" width="660" height="660" filter="url(#stNoise)" opacity="${grain}" style="mix-blend-mode:multiply"/></g>
    ${extra}
  </g>
</g>`;

const O = [320, 40]; // los centros están medidos sobre la lámina original de 2000 px; se corren para que la escena arranque en 0,0
const at = (x, y) => [x - O[0], y - O[1]];

export function stickersSVG() {
    const strip = (cy, cap) => `<g transform="translate(0 ${cy}) rotate(-90) translate(${-LOCK_LEN * cap / 2} ${-cap / 2})">${lock(0, 0, cap, LIME)}</g>`;
    const checker = (cols, rows, size, x0, y0) => {
        let out = '';
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            const light = (r + c) % 2 === 0;
            const x = x0 + c * size, y = y0 + r * size;
            out += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${light ? '#eceeea' : '#1c1e1b'}"/>${nIcon(x + size * 0.2, y + size * 0.2, size * 0.6, light ? '#1c1e1b' : '#eceeea')}`;
        }
        return out;
    };
    const pattern = (size, x0, y0, n) => {
        const cols = [[LIME, INK], [TEAL, LIME], ['#eceeea', INK]];
        let out = '';
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
            const [bg, fg] = cols[(r + c) % 3];
            const x = x0 + c * size, y = y0 + r * size;
            out += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${bg}"/>${nIcon(x + size * 0.2, y + size * 0.2, size * 0.6, fg)}`;
        }
        return out;
    };

    const s10 = sticker('s10', ...at(745, 975), 0, circ(78),
        `<rect x="-90" y="-90" width="180" height="180" fill="#1b2530"/><defs><path id="stCirc" d="M0 -50A50 50 0 1 1 -0.01 -50"/></defs><text font-size="12.5" fill="#8aa0a8" letter-spacing="2.6" style="font-family:'Spline Sans',sans-serif;font-weight:600"><textPath href="#stCirc">NYRO · DATA WITH PURPOSE · NYRO · DATA WITH PURPOSE ·</textPath></text>${nIcon(-14, -14, 28, LIME)}`);

    const s5 = sticker('s5', ...at(605, 585), -9.7, rect(480, 480),
        `<rect x="-250" y="-250" width="500" height="500" fill="#262a1f"/>
         <g transform="rotate(-23)">${[-2, -1, 0, 1, 2].map((i) => `<g transform="translate(${-330 + (i % 2 ? 60 : 0)} ${i * 150 - 55})">${lockLine(0, 0, 118, LIME, 2.4)}</g>`).join('')}</g>
         <g transform="rotate(34)"><rect x="-330" y="-62" width="660" height="46" fill="url(#stCrease)" opacity=".9"/><rect x="-330" y="78" width="660" height="30" fill="url(#stCrease)" opacity=".5"/></g>`, '', 0.12);

    const s7 = sticker('s7', ...at(1275, 565), -4, circ(170),
        `${pattern(100, -200, -200, 4)}`,
        `<g class="st-peel"><path d="M125 -115C72 -62 38 44 62 158A170 170 0 0 0 125 -115Z" fill="url(#stCream)"/><path d="M125 -115C72 -62 38 44 62 158" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="4" filter="url(#stBlur)"/></g>`, 0.08);

    const s6 = sticker('s6', ...at(1055, 630), 0, circ(135),
        `<rect x="-140" y="-140" width="280" height="280" fill="${LIME2}"/>${nIcon(-55, -55, 110, '#2d2f26')}<circle r="132" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5"/>`, '', 0.1);

    const s2 = sticker('s2', ...at(952, 318), -1.5, rect(145, 355),
        `<rect x="-80" y="-190" width="160" height="380" fill="${TEAL}"/>${[-138, -28, 82, 192].map((y) => strip(y, 22)).join('')}<rect x="-90" y="2" width="180" height="16" fill="url(#stCrease)" transform="rotate(7)"/>`, '', 0.1);

    const s1 = sticker('s1', ...at(780, 188), 0, circ(130),
        `<rect x="-135" y="-135" width="270" height="270" fill="url(#stDark)"/>${tile(-68, -72, 150, LIME, 2)}`,
        `<g class="st-peel"><path d="M98 -85C58 -55 30 25 60 115A130 130 0 0 0 98 -85Z" fill="url(#stCream)"/><path d="M98 -85C58 -55 30 25 60 115" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3" filter="url(#stBlur)"/></g>`, 0.09);

    const s3 = sticker('s3', ...at(1155, 262), -42, 'M-165 -65H120L165 -20V65H-165Z',
        `${checker(5, 2, 66, -165, -65)}`,
        `<g class="st-peel"><path d="M120 -65L165 -20L116 -24Z" fill="url(#stCream)"/><path d="M120 -65L116 -24" stroke="#000" stroke-opacity=".25" stroke-width="3" filter="url(#stBlur)" fill="none"/></g>`, 0.07);

    const s4 = sticker('s4', ...at(1470, 312), 6, 'M-168 -168H168V118L118 168H-168Z',
        `<rect x="-175" y="-175" width="350" height="350" fill="#2a2b1f"/>
         <text x="-142" y="-78" data-cap="40" font-size="56" fill="#f3f4ee" style="${WORD}">Data With</text>
         <text x="-142" y="-22" data-cap="40" font-size="56" fill="#f3f4ee" style="${WORD}">Purpose</text>
         <text x="-146" y="22" font-size="21.5" fill="${LIME}" style="font-family:'Spline Sans',sans-serif;font-weight:500" transform="rotate(2 -146 22)">Stop guessing. Start leading.</text>
         <g transform="translate(14 98)">${lock(0, 0, 24, LIME)}</g>`,
        `<g class="st-peel"><path d="M168 118L118 168L106 106Z" fill="url(#stFlap)"/></g>`, 0.1);

    const s9 = sticker('s9', ...at(975, 830), 18, rect(215, 215),
        `<rect x="-110" y="-110" width="220" height="220" fill="#25383a"/><rect x="-78" y="-78" width="156" height="156" fill="#e9eceb"/>${nIcon(-50, -50, 100, '#25383a')}`, '', 0.1);

    const s8 = sticker('s8', ...at(617, 853), -3, 'M-157 -95H112L157 -50V95H-157Z',
        `<rect x="-165" y="-100" width="330" height="200" fill="${LIME2}"/><g transform="translate(-120 -30)">${lock(0, 0, 60, INK)}</g><rect x="-170" y="-72" width="340" height="12" fill="url(#stCrease)" transform="rotate(-4)" opacity=".6"/>`,
        `<g class="st-peel"><path d="M112 -95L157 -50L106 -48Z" fill="url(#stFlapLime)"/></g>`, 0.1);

    return `<svg class="ny-scene ny-scene--st" viewBox="0 0 1340 1050" role="img" aria-label="Stickers de Nyro: círculos, tiras, un cuadrado con el eslogan y patrones con el isotipo" xmlns="http://www.w3.org/2000/svg">${DEFS('st')}${[s10, s5, s7, s6, s2, s1, s3, s4, s9, s8].join('')}</svg>`;
}

// ---------------------------------------------------------------------------------------------------------

export function notebookSVG() {
    const NB = { x: 70, y: 90, w: 1220, h: 803 };
    const LIME_NB = '#abe300';
    const stitches = Array.from({ length: 13 }, (_, i) => {
        const y = 62 + i * 56;
        return `<g class="nb-x" transform="translate(508 ${y})"><path d="M-15 -15L15 15M15 -15L-15 15" stroke="#f1f6d4" stroke-width="5" stroke-linecap="round"/></g>`;
    }).join('');

    const book = `
<g class="nb-book" filter="url(#nbShadow)">
  <!-- bloque de hojas -->
  <rect x="${NB.w - 4}" y="14" width="20" height="${NB.h - 6}" fill="url(#nbPages)"/>
  <rect x="10" y="${NB.h - 4}" width="${NB.w - 6}" height="14" fill="url(#nbPagesB)"/>
  <!-- tapas -->
  <rect x="0" y="0" width="${NB.w}" height="${NB.h}" fill="${LIME_NB}"/>
  <rect x="0" y="0" width="470" height="${NB.h}" fill="url(#nbLeft)"/>
  <rect x="470" y="0" width="76" height="${NB.h}" fill="#a2d800"/>
  <rect x="546" y="0" width="${NB.w - 546}" height="${NB.h}" fill="url(#nbRight)"/>
  <rect x="0" y="0" width="${NB.w}" height="${NB.h}" filter="url(#nbNoise)" opacity=".09" style="mix-blend-mode:multiply"/>
  <!-- pliegues: sombra en el borde de la tapa derecha y en el lomo -->
  <rect x="520" y="0" width="30" height="${NB.h}" fill="url(#nbEdge)"/>
  <rect x="462" y="0" width="16" height="${NB.h}" fill="url(#nbEdgeL)"/>
  <rect x="546" y="0" width="3" height="${NB.h}" fill="#fff" opacity=".28"/>
  ${stitches}
  <!-- tapa izquierda -->
  <text x="40" y="330" data-cap="56" font-size="80" fill="${INK}" style="${WORD}">Data With</text>
  <text x="40" y="414" data-cap="56" font-size="80" fill="${INK}" style="${WORD}">Purpose</text>
  <text x="42" y="486" font-size="31" fill="${INK}" style="font-family:'Spline Sans',sans-serif;font-weight:400;letter-spacing:-0.01em">Stop guessing. Start leading.</text>
  ${nIcon(36, 612, 96, INK)}
  <!-- lockup vertical de la tapa derecha -->
  <g transform="translate(966 768) rotate(-90)">${lock(0, 0, 150, INK)}</g>
  <!-- elástico y piolín -->
  <g class="nb-strap">
    <rect x="668" y="205" width="62" height="358" rx="31" fill="#fff" fill-opacity=".22" stroke="#000" stroke-opacity=".1" stroke-width="2"/>
    <rect x="672" y="209" width="54" height="350" rx="27" fill="url(#nbStrapSheen)"/>
    <circle cx="699" cy="236" r="12" fill="#d7d8c4" stroke="#7c7d6c" stroke-width="2"/><circle cx="699" cy="532" r="12" fill="#d7d8c4" stroke="#7c7d6c" stroke-width="2"/>
  </g>
  <g class="nb-twine" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${[
        'M699 236V532',
        'M699 392C760 330 862 330 852 394C844 438 742 412 699 392',
        'M699 392C650 342 556 352 570 400C582 442 662 424 699 392',
        'M699 392C690 452 650 504 638 566',
        'M699 392C720 462 772 504 792 576',
    ].map((d) => `<path class="nb-tw" pathLength="100" d="${d}" stroke="#cdc19f" stroke-width="7.5"/><path class="nb-tw2" d="${d}" stroke="#7d7154" stroke-width="7.5" stroke-dasharray="2 9" opacity=".42"/>`).join('')}
    <circle cx="699" cy="392" r="15" fill="#cdc19f" stroke="#8c8061" stroke-width="2"/>
  </g>
</g>`;

    const pen = `
<g class="nb-pen-wrap"><g class="nb-pen" transform="translate(1500 30) rotate(1.6 20 450)" filter="url(#nbShadowS)">
  <rect x="2" y="-4" width="36" height="42" rx="10" fill="url(#nbMetal)"/>
  <rect x="0" y="30" width="40" height="640" rx="6" fill="url(#nbBarrel)"/>
  <rect x="0" y="30" width="40" height="640" rx="6" filter="url(#nbNoise)" opacity=".07" style="mix-blend-mode:multiply" />
  <rect x="31" y="46" width="7" height="300" rx="3.5" fill="url(#nbMetal)"/>
  <rect x="31" y="46" width="12" height="9" rx="4" fill="url(#nbMetal)"/>
  <rect x="-1" y="662" width="42" height="26" rx="4" fill="url(#nbMetal)"/>
  <path d="M2 688H38L28 818H12Z" fill="url(#nbMetal)"/>
  <path d="M15 818H25L21 876H19Z" fill="#35363a"/>
  <g transform="translate(20 330) rotate(90) translate(0 -14)">${lock(0, 0, 28, INK)}</g>
  <rect x="5" y="40" width="5" height="620" rx="2.5" fill="#fff" opacity=".35"/>
</g></g>`;

    return `<svg class="ny-scene ny-scene--nb" viewBox="0 0 1600 1000" role="img" aria-label="Libreta lima cosida con piolín y una lapicera con el logo de Nyro" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="nbShadow" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="14" dy="26" stdDeviation="24" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="nbShadowS" x="-200%" y="-10%" width="500%" height="120%"><feDropShadow dx="14" dy="20" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="nbNoise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -.38"/></filter>
  <linearGradient id="nbLeft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b3ec04"/><stop offset=".7" stop-color="#aee500"/><stop offset="1" stop-color="#a5da00"/></linearGradient>
  <linearGradient id="nbRight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b4ec0a"/><stop offset="1" stop-color="#a9e000"/></linearGradient>
  <linearGradient id="nbEdge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  <linearGradient id="nbEdgeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
  <linearGradient id="nbStrapSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
  <linearGradient id="nbPages" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d9cf"/><stop offset=".25" stop-color="#fafaf5"/><stop offset=".5" stop-color="#d4d4c8"/><stop offset=".75" stop-color="#f6f6f0"/><stop offset="1" stop-color="#cfcfc3"/></linearGradient>
  <linearGradient id="nbPagesB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d9cf"/><stop offset=".25" stop-color="#fafaf5"/><stop offset=".5" stop-color="#d4d4c8"/><stop offset=".75" stop-color="#f6f6f0"/><stop offset="1" stop-color="#cfcfc3"/></linearGradient>
  <linearGradient id="nbBarrel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fbd00"/><stop offset=".3" stop-color="#c8f200"/><stop offset=".6" stop-color="#b4e300"/><stop offset="1" stop-color="#7ea500"/></linearGradient>
  <linearGradient id="nbMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d9094"/><stop offset=".35" stop-color="#f1f2f3"/><stop offset=".6" stop-color="#b7babd"/><stop offset="1" stop-color="#6d7074"/></linearGradient>
</defs>
<g transform="translate(${NB.x} ${NB.y})">${book}</g>${pen}
</svg>`;
}
