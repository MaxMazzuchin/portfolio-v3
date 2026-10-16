// Fuente única de proyectos para las vistas: los del V2 (projects.js, generado) + los nuevos
// (extra-projects.js, a mano) + el caso de cada uno (cases.js, a mano).
import { projects as v2 } from './projects.js';
import { extras, additions } from './extra-projects.js';
import { cases } from './cases.js';

const pad = (n) => String(n).padStart(2, '0');

// Proyectos del V2 que se reemplazan por uno nuevo (touchdesigner → animacion).
const HIDDEN = new Set(['touchdesigner']);

// Orden en la rueda y en la lista, por afinidad. Lo que no esté acá va al final, en el orden en que se agregó.
const ORDER = [
    'album-artwork', 'curu', 'pone-atencion', 'sin-datos',
    'i-life', 'nyro', 'contigiani-brinon', 'outframe', 'd2x',
    'exp-grafica', '100-posters',
    'taylor-swift', 'animacion',
    'gracias',
];

// Piezas que se suman a la grilla de un proyecto del V2 (por ejemplo las nuevas de Exp. Gráfica).
const withAdditions = (p) => {
    const extra = additions[p.slug];
    if (!extra?.length) return p;
    const sections = p.sections.map((s) => ({ ...s }));
    const grid = sections.find((s) => s.kind === 'grid');
    if (grid) grid.images = [...grid.images, ...extra];
    else sections.push({ kind: 'grid', images: extra });
    return { ...p, sections };
};

// Proyectos sin portada destacada: el título y después todas las piezas al mismo tamaño en una grilla
// (series de portadas, estampitas). Los demás arrancan con la portada grande.
const EQUAL = new Set(['album-artwork', 'gracias', 'taylor-swift']);

// Exp. Gráfica va de lo más nuevo a lo más viejo. La fecha real de creación solo sobrevive en 13 archivos; el resto se
// exportó junto el 24/3/2026, así que se ordena por el número de "exp-g (n)" de los originales (mayor = más nuevo).
// grid-1 es exp-g (43), grid-2..43 son exp-g (1..42) y grid-44..49 son las piezas sumadas después (las más nuevas).
const createdRank = (src) => {
    const n = Number(/grid-(\d+)\.webp$/.exec(src)?.[1]);
    if (!n) return 0;
    return n === 1 ? 43 : n <= 43 ? n - 1 : 100 + n;
};
const NEWEST_FIRST = new Set(['exp-grafica']);
const byNewest = (p) => {
    if (!NEWEST_FIRST.has(p.slug)) return p;
    const sections = p.sections.map((s) => (s.images ? { ...s, images: [...s.images].sort((a, b) => createdRank(b.src) - createdRank(a.src)) } : s));
    return { ...p, sections };
};

const rank = (slug) => { const i = ORDER.indexOf(slug); return i < 0 ? ORDER.length : i; };

export const projects = [...v2.filter((p) => !HIDDEN.has(p.slug)), ...extras]
    .map(withAdditions)
    .map(byNewest)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p.slug) - rank(b.p.slug) || a.i - b.i)
    .map(({ p }, i) => ({ ...p, index: pad(i + 1), case: cases[p.slug] || null, layout: EQUAL.has(p.slug) ? 'equal' : 'hero' }));

export const bySlug = (slug) => projects.find((p) => p.slug === slug);

/** URL de la página de un proyecto. Al compilar, vite.config.js genera una página real en esta ruta (con su título e imagen para compartir). */
export const projectUrl = (slug) => `/proyecto/${slug}/`;

/** Un dato del caso se muestra solo si está cargado: vacío o con [CONFIRMAR] queda oculto. */
export const known = (v) => {
    if (Array.isArray(v)) return v.filter(known).length > 0;
    return typeof v === 'string' && v.trim() !== '' && !v.includes('[CONFIRMAR]');
};
