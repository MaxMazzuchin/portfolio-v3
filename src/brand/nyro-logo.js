// Logo de Nyro reconstruido en vectores a partir de la lámina de construcción del manual.
// El isotipo es una "n" armada sobre una grilla de 3 × 3 módulos (1 módulo = 100 unidades):
//   A  cuadrado superior izquierdo
//   B  semicírculo superior (centro 200,100)
//   C  pie izquierdo: rectángulo con la esquina superior redondeada (cuarto de círculo, centro 100,200)
//   D  pie derecho: rectángulo con la esquina inferior redondeada (cuarto de círculo, centro 300,200)

export const M = 100;
const TILE = 441; // lado del cuadrado de la versión alternativa (medido sobre la tapa); el isotipo queda inscripto, centrado
const PAD = (TILE - 3 * M) / 2;
const WORD_X = TILE + 70;
const WORD_CAP = TILE; // la mayúscula del wordmark mide lo mismo que el cuadrado
export const MAIN_BOX = [1770, 570];
export const WORD = 'Nyro';

/** d de cada parte del isotipo, con origen (ox, oy). */
export function nParts(ox = 0, oy = 0) {
    const p = (x, y) => `${ox + x} ${oy + y}`;
    return [
        `M${p(0, 0)}H${ox + 100}V${oy + 100}H${ox}Z`,
        `M${p(100, 100)}A100 100 0 0 1 ${p(300, 100)}Z`,
        `M${p(0, 300)}V${oy + 200}A100 100 0 0 1 ${p(100, 100)}V${oy + 300}Z`,
        `M${p(200, 100)}H${ox + 300}V${oy + 300}A100 100 0 0 1 ${p(200, 200)}Z`,
    ];
}

const tileD = () => `M0 0H${TILE}V${TILE}H0Z${nParts(PAD, PAD).join('')}`;
const nPath = (d, cls) => `<path class="ny-p ${cls}" pathLength="100" d="${d}"/>`;

/** Guías de construcción para la versión principal (el isotipo queda en PAD, PAD). */
function guides() {
    const L = (d) => `<path class="ny-g" pathLength="100" d="${d}"/>`;
    const xs = [0, 100, 200, 300].map((v) => PAD + v);
    const circles = [[200, 100], [100, 200], [300, 200]].map(([cx, cy]) => {
        const x = PAD + cx, y = PAD + cy;
        return `<path class="ny-g ny-c" pathLength="100" d="M${x - 100} ${y}a100 100 0 1 0 200 0a100 100 0 1 0 -200 0"/>`;
    });
    const dots = xs.flatMap((x) => xs.map((y) => `<circle class="ny-dot" cx="${x}" cy="${y}" r="5"/>`));
    const lab = (x, y, n, pre, a = 'start') => `<text class="ny-lab" x="${x}" y="${y}" text-anchor="${a}" data-n="${n}" data-pre="${pre}">${pre} 0</text>`;
    return `<g class="ny-guides" aria-hidden="true">
        ${xs.map((x) => L(`M${x} -70V${TILE + 70}`)).join('')}
        ${xs.map((y) => L(`M-70 ${y}H${TILE + 70}`)).join('')}
        ${circles.join('')}${dots.join('')}
        ${lab(PAD, -22, 300, 'W')}${lab(TILE + 18, PAD + 150, 300, 'H')}${lab(PAD + 300, TILE + 54, 100, 'R', 'end')}
    </g>`;
}

/**
 * layout: 'icon' (solo la n) · 'tile' (cuadrado con la n calada) · 'main' (cuadrado + wordmark)
 * Todo toma `currentColor`; las partes caladas son agujeros reales (fill-rule evenodd), así que se ve lo que hay detrás.
 */
export function nyroSVG({ layout = 'main', build = false, cls = '', label = 'Nyro' } = {}) {
    let box, body;
    if (layout === 'icon') {
        box = [3 * M, 3 * M];
        body = nParts().map((d) => nPath(d, 'ny-n-solid')).join('');
    } else {
        box = layout === 'tile' ? [TILE, TILE] : MAIN_BOX;
        body = nPath(tileD(), 'ny-tile');
        if (build) body += nParts(PAD, PAD).map((d) => `<path class="ny-p ny-n" pathLength="100" d="${d}"/>`).join('');
        if (layout === 'main') body += `<text class="ny-word" x="${WORD_X}" y="${TILE}" font-size="${WORD_CAP * 0.95}" data-text="${WORD}" data-cap="${WORD_CAP}">${WORD}</text>`;
    }
    return `<svg class="ny-logo ${cls}" viewBox="0 0 ${box[0]} ${box[1]}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${build && layout === 'main' ? guides() : ''}${body}</svg>`;
}
