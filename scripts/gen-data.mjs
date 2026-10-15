// Genera src/data/projects.js a partir del `projectsData` de portfolio-web (V2).
//
// Uso:  node scripts/gen-data.mjs <ruta/a/portfolio-web>
//
// Reproduce el layout del V2: portada → columna única (image-1..N) → grilla de 2 columnas (grid-1..M).
// Usa los CONTEOS del V2 (verticalImgCount / masonryImgCount), no todos los archivos de la carpeta:
// algunas carpetas tienen archivos de más que el V2 nunca mostró. Falla si falta algún archivo.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { webpSize } from './lib.mjs';

const [, , v2Dir] = process.argv;
if (!v2Dir) {
    console.error('Falta la ruta a portfolio-web. Uso: node scripts/gen-data.mjs <ruta>');
    process.exit(1);
}
const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');

const ctx = vm.createContext({ document: { addEventListener() {} } });
vm.runInContext(fs.readFileSync(path.join(v2Dir, 'script.js'), 'utf8'), ctx);
const data = vm.runInContext('projectsData', ctx);

function img(slug, file) {
    const abs = path.join(pub, 'images/projects', slug, file);
    if (!fs.existsSync(abs)) throw new Error(`Falta ${abs}`);
    const [w, h] = webpSize(abs);
    return { src: `/images/projects/${slug}/${file}`, w, h };
}

const range = (n, fn) => Array.from({ length: n || 0 }, (_, i) => fn(i + 1));

const projects = data.map((p, i) => {
    const base = {
        index: String(i + 1).padStart(2, '0'),
        slug: p.slug,
        title: p.title,
        type: p.type,
        description: p.description,
    };

    // Proyecto de video (TouchDesigner): portada + videos, uno a la vez.
    if (Array.isArray(p.galleryItems)) {
        const vids = [p.coverImage, ...p.galleryItems].map((u) => `/videos/${p.slug}/${path.basename(u)}`);
        for (const v of vids) {
            if (!fs.existsSync(path.join(pub, v))) throw new Error(`Falta video ${v}`);
        }
        return {
            ...base,
            cover: img(p.slug, 'cover.webp'),
            sections: [{ kind: 'videos', videos: vids }],
        };
    }

    const sections = [];
    if (p.verticalImgCount) sections.push({ kind: 'column', images: range(p.verticalImgCount, (n) => img(p.slug, `image-${n}.webp`)) });
    if (p.masonryImgCount) sections.push({ kind: 'grid', images: range(p.masonryImgCount, (n) => img(p.slug, `grid-${n}.webp`)) });
    return { ...base, cover: img(p.slug, 'cover.webp'), sections };
});

const out = path.join(root, 'src/data/projects.js');
fs.writeFileSync(
    out,
    `// GENERADO por scripts/gen-data.mjs desde portfolio-web (V2). No editar a mano: volver a correr el script.\n` +
    `// sections: [{ kind: 'column' | 'grid', images: [{src,w,h}] } | { kind: 'videos', videos: [src] }]\n` +
    `export const projects = ${JSON.stringify(projects, null, 1)};\n\n` +
    `export const bySlug = (slug) => projects.find((p) => p.slug === slug);\n`,
);

for (const p of projects) {
    const n = p.sections.map((s) => `${s.kind}:${(s.images || s.videos).length}`).join(' + ');
    console.log(`${p.index} ${p.slug.padEnd(15)} cover + ${n || '—'}`);
}
