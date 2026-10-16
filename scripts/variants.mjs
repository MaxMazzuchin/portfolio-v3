// Genera las variantes livianas de las imágenes de proyecto, al lado de cada original (que no se toca).
//
//   node scripts/variants.mjs            crea las que falten o estén desactualizadas (idempotente)
//   node scripts/variants.mjs --check    no escribe nada: verifica que los datos coincidan con el disco y que estén todas
//                                        las variantes; sale con error si algo no está bien (sirve para revisar antes de subir)
//
// Qué variantes lleva cada imagen lo decide src/core/srcset.js (la misma regla que usa el navegador), a partir del ancho `w`
// que figura en los datos. Los archivos nuevos se hacen solos con add-project.mjs; esto es para el resto o para rehacerlas.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { variantWidths, variantSrc, VARIANTS } from '../src/core/srcset.js';

const check = process.argv.includes('--check');
const root = path.resolve(import.meta.dirname, '..');
const pub = (src) => path.join(root, 'public', src);

const { projects } = await import(pathToFileURL(path.join(root, 'src/data/work.js')).href);

// Las imágenes que se muestran, sin repetir: portada y piezas, más las sueltas que usan las páginas. Los proyectos con manual en
// código (p.manual) solo muestran la portada; sus demás imágenes no se usan y no se generan variantes.
const imgs = new Map();
for (const p of projects) {
    for (const s of [p.cover, ...(p.manual ? [] : p.sections.flatMap((sec) => sec.images || []))]) imgs.set(s.src, s);
}
const loose = [{ src: '/images/about/portrait.webp' }];
for (const l of loose) {
    const m = await sharp(pub(l.src)).metadata();
    imgs.set(l.src, { src: l.src, w: m.width, h: m.height });
}

const problems = [];
let made = 0;
let kept = 0;
let saved = 0;
const expected = new Set();

for (const s of imgs.values()) {
    if (!fs.existsSync(pub(s.src))) { problems.push(`falta el original ${s.src}`); continue; }
    const meta = await sharp(pub(s.src)).metadata();
    if (meta.width !== s.w || meta.height !== s.h) problems.push(`${s.src}: los datos dicen ${s.w}×${s.h} y el archivo mide ${meta.width}×${meta.height}`);

    for (const v of variantWidths(s.w)) {
        const out = variantSrc(s.src, v);
        expected.add(path.normalize(pub(out)));
        const exists = fs.existsSync(pub(out));
        const stale = exists && fs.statSync(pub(out)).mtimeMs < fs.statSync(pub(s.src)).mtimeMs;
        if (exists && !stale) { kept++; continue; }
        if (check) { problems.push(`${exists ? 'desactualizada' : 'falta'} ${out}`); continue; }
        await sharp(pub(s.src)).resize({ width: v, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(pub(out));
        saved += fs.statSync(pub(s.src)).size - fs.statSync(pub(out)).size;
        made++;
    }
}

// Variantes que ya no corresponden a ningún original (por ejemplo, si el original se achicó).
const dirs = new Set([...imgs.keys()].map((s) => path.dirname(pub(s))));
const orphans = [];
for (const d of dirs) {
    for (const f of fs.readdirSync(d)) {
        if (new RegExp(`-(${VARIANTS.join('|')})\\.webp$`).test(f) && !expected.has(path.normalize(path.join(d, f)))) orphans.push(path.join(d, f));
    }
}
// Son archivos derivados: al generar se borran; con --check solo se avisa.
for (const o of orphans) {
    if (check) problems.push(`sobra ${path.relative(root, o)} (su original ya no necesita esa variante)`);
    else fs.rmSync(o);
}

if (!check) console.log(`variantes: ${made} creadas, ${kept} ya estaban${orphans.length ? `, ${orphans.length} sobrantes borradas` : ''}. Ahorro frente a mandar el original: ${(saved / 1048576).toFixed(1)} MB.`);
if (problems.length) {
    console.error(`\n${problems.length} problema(s):\n` + problems.map((x) => '  - ' + x).join('\n'));
    process.exit(1);
}
if (check) console.log(`ok: ${imgs.size} imágenes, ${kept} variantes, datos y disco coinciden.`);
