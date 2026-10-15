// Fuente única de proyectos para las vistas: los del V2 (projects.js, generado) + los nuevos
// (extra-projects.js, a mano) + el caso de estudio de cada uno (cases.js, a mano).
import { projects as v2 } from './projects.js';
import { extras } from './extra-projects.js';
import { cases } from './cases.js';

const pad = (n) => String(n).padStart(2, '0');

export const projects = [...v2, ...extras].map((p, i) => ({
    ...p,
    index: pad(i + 1),
    case: cases[p.slug] || null,
}));

export const bySlug = (slug) => projects.find((p) => p.slug === slug);

/** Un dato del caso se muestra solo si está cargado: vacío o con [CONFIRMAR] queda oculto. */
export const known = (v) => {
    if (Array.isArray(v)) return v.filter(known).length > 0;
    return typeof v === 'string' && v.trim() !== '' && !v.includes('[CONFIRMAR]');
};
