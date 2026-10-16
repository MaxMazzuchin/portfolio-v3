// Logo de Contigiani Briñón en vectores reales (los trazados salen del SVG original del cliente).
// Medidas de cada pieza, en unidades del SVG original:
//   marco del ícono 0–460.8 × 0–503.3 · C 561.9–1037.3 × 0–414.8 · B 830.5–1287.6 × 9.6–401.2

const FRAME = 'M0,0v503.29h29.61v-23.68l84.14-21.81-76.98-8.4v-26.93l40.03-21.92-32.56-6.25v-22.41l28.05-23-21.51-5.02v-23.81l20.3-20.46-14.7-4.6v-24.28l2.8-3.89L234.29,59.03l136.35,147.56,4.2,33.62-17.86,8.93,29.07,29.36s-.93,15.88,0,19.61c.66,2.64-12.7,6.92-20.58,9.2l32.25,26.06,2.33,27.32-32.88,9.99,40.82,23.16s4.2,37.36,4.2,38.76c0,.96-47.59,6.06-77.69,9.2l87.34,24.58,7.1,36.93h31.84V0H0Z';

// De arriba hacia abajo: los 4 "pisos" del edificio.
const CHEVRONS = [
    { points: '347.92 239.99 364.1 232.27 244.56 112.73 230.55 112.73 68.52 285.96 81.2 289.39 231.02 138.41 247.36 138.41 347.92 239.99' },
    { points: '85.58 337.98 236.15 214.52 250.63 214.52 353.2 297.39 371.1 287.37 248.76 187.9 236.15 187.9 66.18 332.66 85.58 337.98' },
    { points: '97.5 389.21 243.39 309.31 259.03 309.31 347.65 359.59 380.44 350.87 257.63 276.63 241.29 276.63 66.18 384.96 97.5 389.21' },
    { d: 'M149.14,448.62l100.87-26.15h15.88l38.03,10.7,74.66-10.7-116.74-37.04h-13.54c-1.4,0-173.71,56.03-173.71,56.03l74.55,7.16Z' },
];

const B = 'M1204.09,285.29c.61-23.83-18.44-37.34-39.98-43.3-14.29-3.96-28.84-6.23-43.99-6.24l-210.96-.13v69.14c-12.32,8.97-25.63,15.33-40.08,19.92-12.71,3.96-25.46,6.28-38.54,7.4V83.82c14.79,2.27,28.99,6.39,42.66,12.72,13.31,6.24,25.23,13.98,35.97,23.85v50.74s199.09-.06,199.09-.06c12.85,0,24.92-1.39,37.21-3.98,22.38-4.73,43.25-16.59,43.58-41.26.31-23.11-17.76-35.75-38.69-41.45-13.72-3.73-27.47-5.63-41.91-5.64l-103.31-.12c-24.93-31.82-56.46-53.17-93.41-68.99h217.29c16.23,0,31.7,1.65,47.38,4.88,25.05,5.17,48.5,15.17,66.89,32.3,39.25,36.56,36.58,99.16-5.59,132.28-13.06,10.26-28.08,16.98-45.06,21.25,14.81,3.18,28.12,6.19,41.21,12.24,9.61,4.44,18.25,9.56,26.15,16.56,13.03,11.54,21.79,26.27,25.4,43.39,2.83,13.46,2.98,26.83.59,40.42-8.56,48.82-53.4,73.35-98.8,82.6-17.06,3.48-33.99,5.56-51.64,5.57l-201.42.07c-1.43,0-1.51-.67-.22-.94,33.21-15.36,61.88-38.36,83.18-68.12l103.05-.09c14.42-.01,27.9-1.9,41.66-5.08,21.72-5.83,41.67-17.41,42.29-41.66Z';

const C = 'M763.01,339.04c41.35,8,89.2,6.18,127.8-11.62,35.11-16.18,59.63-43.7,73.28-79.81l73.19,23.9c-19.18,51.83-53.13,92.33-103.23,116.96-53.92,26.55-123.6,31.36-182.29,21.68-48.49-7.99-95.15-27.86-130.78-61.93-27.19-26-45.96-59.08-54.08-95.92-6.58-29.88-6.71-60.9-.35-90.82,7.35-34.62,24.29-65.79,49.05-90.92,28.16-28.58,63.98-47.68,102.48-58.79,57.23-16.52,124.24-16.16,180.47,4.34,25.77,9.29,49.67,22.61,70.56,40.26,22.02,18.73,39.74,41.48,51.33,68.46l-72.74,27.99c-17.69-32.63-46.18-57.23-80.61-70.3-19.28-7.3-39.19-10.84-59.89-11.29-40.28-.82-80.9,9.33-112.78,34.27-24.87,19.45-41.64,46.74-47.24,77.89-3.37,18.74-3.2,37.5.64,56.12,11.79,57.18,60.4,88.94,115.19,99.53Z';

export const ICON_W = 460.8;
export const ICON_H = 503.3;
const CB_X = 561.9, CB_W = 725.7, CB_H = 414.8;
const TAG = 'BIENES RAÍCES';

// Vertical: el CB se escala al ancho del ícono, igual que en el manual.
const S = ICON_W / CB_W;
const V_CB_Y = ICON_H + 12;
const V_CB_BOTTOM = V_CB_Y + CB_H * S;
const V_TAG_Y = V_CB_BOTTOM + 77;
export const V_BOX = [ICON_W, V_TAG_Y + 12];
export const H_BOX = [1291.8, 515];

const LAYOUTS = {
    v: { box: V_BOX, mono: `translate(${(-CB_X * S).toFixed(2)} ${V_CB_Y.toFixed(2)}) scale(${S.toFixed(5)})`, tag: { x: 0, y: V_TAG_Y, size: 54.7, w: ICON_W } },
    h: { box: H_BOX, mono: '', tag: { x: 551.85, y: 505, size: 87.89, w: 739.9 } },
    icon: { box: [ICON_W, ICON_H] },
};

const shape = (s, cls) => (s.d ? `<path class="${cls}" pathLength="100" d="${s.d}"/>` : `<polygon class="${cls}" pathLength="100" points="${s.points}"/>`);

// Guías de construcción del logo vertical (solo para la animación del hero).
export function guides() {
    const cx = CB_X * 0 + (237.7 * S);
    const cy = V_CB_Y + 207.4 * S;
    const r = 207.4 * S;
    const L = (d) => `<path class="cb-g" pathLength="100" d="${d}"/>`;
    const lab = (x, y, n, pre, anchor = 'start') => `<text class="cb-lab" x="${x}" y="${y}" text-anchor="${anchor}" data-n="${n}" data-pre="${pre}">${pre} 0</text>`;
    const dot = (x, y) => `<circle class="cb-dot" cx="${x}" cy="${y}" r="5"/>`;
    return `<g class="cb-guides" aria-hidden="true">
        ${L(`M0 -50V${V_BOX[1] + 40}`)}${L(`M${ICON_W} -50V${V_BOX[1] + 40}`)}${L(`M${ICON_W / 2} -50V${V_BOX[1] + 40}`)}
        ${[0, ICON_H, V_CB_Y, V_CB_BOTTOM, V_TAG_Y].map((y) => L(`M-70 ${y.toFixed(1)}H${ICON_W + 70}`)).join('')}
        ${L('M234.3 59L0 312')}${L(`M234.3 59L${ICON_W} 304`)}
        ${L(`M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0`)}
        ${dot(234.3, 59)}${dot(0, 0)}${dot(ICON_W, 0)}${dot(0, ICON_H)}${dot(ICON_W, ICON_H)}${dot(cx.toFixed(1), cy.toFixed(1))}
        ${lab(0, -16, ICON_W, 'W')}
        ${lab(ICON_W + 12, ICON_H / 2, ICON_H, 'H')}
        ${lab(cx.toFixed(1), (cy + r + 24).toFixed(1), Math.round(r * 10) / 10, 'R', 'middle')}
    </g>`;
}

/**
 * @param {{layout?: 'v'|'h'|'icon', tag?: boolean, withGuides?: boolean, cls?: string, label?: string}} o
 * Todo toma el color de `color` (currentColor): el que lo use define el color del logo.
 */
export function logoSVG({ layout = 'v', tag = true, withGuides = false, cls = '', label = 'Contigiani Briñón, Bienes Raíces' } = {}) {
    const l = LAYOUTS[layout];
    const icon = `<g class="cb-icon">${shape({ d: FRAME }, 'cb-p cb-f')}${CHEVRONS.map((c, i) => shape(c, `cb-p cb-c cb-c${i + 1}`)).join('')}</g>`;
    let body = icon;
    if (layout !== 'icon') {
        body += `<g class="cb-mono"${l.mono ? ` transform="${l.mono}"` : ''}>${shape({ d: C }, 'cb-p cb-m')}${shape({ d: B }, 'cb-p cb-m')}</g>`;
        if (tag) {
            const t = l.tag;
            body += `<text class="cb-tag" x="${t.x}" y="${t.y.toFixed(1)}" font-size="${t.size}" data-w="${t.w}" data-text="${TAG}" textLength="${t.w}" lengthAdjust="spacing">${TAG}</text>`;
        }
    }
    return `<svg class="cb-logo ${cls}" viewBox="0 0 ${l.box[0]} ${l.box[1]}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${withGuides ? guides() : ''}${body}</svg>`;
}
