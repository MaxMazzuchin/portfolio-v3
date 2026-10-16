// Logo de Blue Marketing en vectores. Los trazados (logo, olas, separadores) salen del PDF de lineamientos del cliente
// y viven en blue-paths.js (generado por scripts/blue-assets.mjs). Acá solo se arman los SVG que usa el manual.
//
// El logo es una "B" hecha con dos velas que cortan el agua: un único trazado cerrado, que ya incluye las velas
// (por eso se rellena con nonzero y no con evenodd). Todo toma `currentColor`.
import { LOGO, WAVE_A, WAVE_B, SEPARATORS, SEP_SIZE, SHEET } from './blue-paths.js';

export { LOGO, SEPARATORS, SEP_SIZE, SHEET };

export const WORD = 'BLUE MARKETING';
/** Separación entre el logo y el wordmark, en unidades del logo (en el PDF queda pegado, con aire de ~6 %). */
export const GAP = 24;
/** Cuando termina de construirse, el logo con su wordmark sube esto para quedar centrado entre el techo y las olas. */
export const LIFT = 70;
// Altura estimada del wordmark antes de medirlo con la tipografía real (Poppins Bold, mayúscula ≈ 0.7 del cuerpo, ancho = el del logo).
const WORD_H0 = 26;

let uid = 0;
/** id único por instancia: si dos logos comparten el id de un clipPath, todos terminan usando el primero. */
export const nextId = (p) => `${p}${++uid}`;

const word = (layout) => (layout === 'lockup'
    ? `<text class="bm-word bm-t" x="0" y="${LOGO.h + GAP + WORD_H0}" font-size="36" data-text="${WORD}" data-w="${LOGO.w}" data-gap="${GAP}">${WORD}</text>`
    : '');

/**
 * Logo suelto. layout: 'icon' (solo la B) · 'lockup' (B + wordmark debajo, del mismo ancho).
 * El alto del lockup se ajusta en `fitLockups` cuando la tipografía ya cargó.
 */
export function blueSVG({ layout = 'icon', cls = '', label = 'Blue Marketing' } = {}) {
    const h = layout === 'lockup' ? LOGO.h + GAP + WORD_H0 + 4 : LOGO.h;
    return `<svg class="bm-logo ${cls}" viewBox="0 0 ${LOGO.w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`
        + `<path class="bm-fill" d="${LOGO.d}"/>${word(layout)}</svg>`;
}

/** Las dos olas de la portada, en las unidades de la lámina de 1920 × 1080. `bottom` recorta al tramo de abajo (y ≥ 700). */
export function wavesSVG({ cls = '', bottom = false } = {}) {
    const vb = bottom ? `0 700 ${SHEET[0]} ${SHEET[1] - 700}` : `0 0 ${SHEET[0]} ${SHEET[1]}`;
    return `<svg class="bm-waves ${cls}" viewBox="${vb}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`
        + `<path class="bm-waveA" d="${WAVE_A}"/><path class="bm-waveB" d="${WAVE_B}"/></svg>`;
}

/**
 * Escena de la tapa, en las unidades de la lámina (1920 × 1080): fondo, guías de construcción, el logo (contorno + relleno que
 * sube como agua), el wordmark y las olas. Su estado estático es el final; la animación parte de ahí hacia atrás (ver blue.js).
 */
export function coverSVG() {
    const clip = nextId('bmRise');
    const { w, h } = LOGO;
    // Guías (en coordenadas del logo): caja, línea de base y de altura de mayúscula, eje y los dos círculos de los lóbulos de la B.
    const g = (d, cls = '') => `<path class="bm-g ${cls}" pathLength="100" d="${d}"/>`;
    const guides = `<g class="bm-guides" aria-hidden="true">`
        + g(`M0 0H${w}V${h}H0Z`)
        + g(`M-170 ${h}H${w + 170}`) + g(`M-170 0H${w + 170}`)
        + g(`M${w / 2} -110V${h + 110}`)
        + g(`M${w * 0.77} ${h * 0.4}a${w * 0.24} ${w * 0.24} 0 1 0 0.01 0`, 'bm-gc')
        + g(`M${w * 0.65} ${h * 0.74}a${w * 0.27} ${w * 0.27} 0 1 0 0.01 0`, 'bm-gc')
        + `</g>`;
    // Borde del agua que sube: una onda periódica (160 de período) para poder desplazarla sin cortes.
    let wave = 'M-320 0';
    for (let x = -320; x < w + 480; x += 160) wave += `c40 -12 80 12 160 0`;
    wave += `V${h + 160}H-320Z`;
    return `<svg class="bm-scene" viewBox="0 0 ${SHEET[0]} ${SHEET[1]}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Blue Marketing" xmlns="http://www.w3.org/2000/svg">`
        // El agua parte en su posición final (arriba del logo): así el estado estático, sin animación, muestra el logo completo.
        + `<defs><clipPath id="${clip}"><path class="bm-rise" transform="translate(0 -40)" d="${wave}"/></clipPath></defs>`
        + `<g class="bm-pos" transform="translate(${LOGO.x} ${LOGO.y - LIFT})"><g class="bm-lock">`
        + guides
        + `<path class="bm-outline" pathLength="100" d="${LOGO.d}"/>`
        + `<path class="bm-fill" clip-path="url(#${clip})" d="${LOGO.d}"/>`
        + `<text class="bm-word bm-t" x="0" y="${h + GAP + WORD_H0}" font-size="36" data-text="${WORD}" data-w="${w}" data-gap="${GAP}">${WORD}</text>`
        + `</g></g>`
        + `<g class="bm-waves-g"><path class="bm-waveA" d="${WAVE_A}"/><path class="bm-waveB" d="${WAVE_B}"/></g></svg>`;
}

/** Un separador (Clientes / Producción / Resultados): fondo, contorno del logo ampliado, olas y título. */
export function sepSVG(s) {
    return `<svg class="bm-sep" viewBox="0 0 ${SEP_SIZE[0]} ${SEP_SIZE[1]}" role="img" aria-label="${s.title}" xmlns="http://www.w3.org/2000/svg">`
        + `<rect class="bm-sep-bg" width="${SEP_SIZE[0]}" height="${SEP_SIZE[1]}"/>`
        + `<path class="bm-sep-outline" pathLength="100" d="${s.outline}"/>`
        + `<g class="bm-sep-waves"><path d="${s.wave}"/><path d="${s.waveThin}"/></g>`
        + `<text class="bm-t bm-sep-t" x="${s.x}" y="${s.y}" font-size="${s.size}" style="letter-spacing:${s.ls}em" data-text="${s.title}">${s.title}</text></svg>`;
}
