// Recortes para armar la tapa y la primera doble página de D2X en código, y las demás dobles como imagen.
// Los originales (mockups) están en Descargas/PORTFOLIO/d2x; si hay fotos sueltas se reemplazan los .webp de /fotos.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const src = 'C:/Users/Máximo/Downloads/PORTFOLIO/d2x';
const dir = 'public/images/projects/d2x/fotos';
mkdirSync(dir, { recursive: true });
const cover = `${src}/1 (1).png`; // 4000 × 4000
const spreads = `${src}/1 (2).png`; // 1920 × 6750: cinco dobles de 1350 px de alto

const out = async (input, region, name, opts = {}) => {
    let p = sharp(input).extract(region);
    if (opts.width) p = p.resize({ width: opts.width });
    await p.webp({ quality: opts.q || 86 }).toFile(`${dir}/${name}.webp`);
    console.log(name, region.width, 'x', region.height);
};

// Tapa (4000 px). El retrato se corta a la derecha de los titulares, que en el mockup están impresos encima del hombro izquierdo.
await out(cover, { left: 1540, top: 1320, width: 800, height: 1700 }, 'retrato', { width: 900 });
await out(cover, { left: 2400, top: 535, width: 700, height: 800 }, 'marco-1', { width: 560 });
await out(cover, { left: 2400, top: 1440, width: 700, height: 800 }, 'marco-2', { width: 560 });
await out(cover, { left: 2580, top: 2345, width: 520, height: 800 }, 'marco-3', { width: 520 });

// Doble 1-2 (la primera de la imagen alta). Medidas tomadas sobre la imagen reducida a 1280 y llevadas a 1920 (×1,5).
const k = 1.5;
const r = (l, t, w, h) => ({ left: Math.round(l * k), top: Math.round(t * k), width: Math.round(w * k), height: Math.round(h * k) });
await out(spreads, r(128, 300, 505, 543), 'disqueria', { width: 1100 });
await out(spreads, r(652, 292, 214, 548), 'estantes', { width: 700 });
await out(spreads, r(882, 292, 282, 228), 'escenario', { width: 900 });
await out(spreads, r(882, 535, 282, 250), 'esmoquin', { width: 900 });

// Las otras cuatro dobles, enteras (mockups con perspectiva).
for (let i = 1; i < 5; i++) await out(spreads, { left: 0, top: i * 1350, width: 1920, height: 1350 }, `doble-${i + 1}`, { width: 1700, q: 84 });
