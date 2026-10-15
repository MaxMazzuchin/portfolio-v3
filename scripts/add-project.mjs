// Suma un proyecto nuevo (que no está en el V2) al portfolio.
//
// Uso:  node scripts/add-project.mjs <slug> <carpeta-con-imagenes> [--title "TÍTULO"] [--type "Tipo"] [--grid N]
//
// - Ordena los archivos por nombre (natural: 2 antes que 10). El primero es la portada.
// - Los últimos N (--grid) van a la grilla de 2 columnas; el resto a la columna única.
// - Convierte todo a .webp (máx. 1600 px de ancho) en public/images/projects/<slug>/.
// - Agrega la entrada a src/data/extra-projects.js. Después completá descripción y caso en cases.js.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { webpSize } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(`--${name}`);
    if (i < 0) return undefined;
    return args.splice(i, 2)[1];
};
const title = flag('title');
const type = flag('type');
const gridCount = Number(flag('grid') || 0);
const [slug, dir] = args;

if (!slug || !dir || !/^[a-z0-9-]+$/.test(slug)) {
    console.error('Uso: node scripts/add-project.mjs <slug-en-minusculas> <carpeta> [--title "TÍTULO"] [--type "Tipo"] [--grid N]');
    process.exit(1);
}

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/images/projects', slug);
const dataFile = path.join(root, 'src/data/extra-projects.js');

const { extras } = await import(pathToFileURL(dataFile).href);
const { projects: v2 } = await import(pathToFileURL(path.join(root, 'src/data/projects.js')).href);
if ([...v2, ...extras].some((p) => p.slug === slug)) {
    console.error(`Ya existe un proyecto con el slug "${slug}".`);
    process.exit(1);
}

const files = fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (files.length < 2) {
    console.error('Hacen falta al menos 2 imágenes (portada + una).');
    process.exit(1);
}
if (gridCount > files.length - 1) {
    console.error(`--grid ${gridCount} es más que las imágenes disponibles (${files.length - 1} sin la portada).`);
    process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const columnCount = files.length - 1 - gridCount;
const names = files.map((_, i) => (i === 0 ? 'cover.webp' : i <= columnCount ? `image-${i}.webp` : `grid-${i - columnCount}.webp`));

for (const [i, f] of files.entries()) {
    await sharp(path.join(dir, f)).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outDir, names[i]));
}

const img = (file) => {
    const [w, h] = webpSize(path.join(outDir, file));
    return { src: `/images/projects/${slug}/${file}`, w, h };
};
const sections = [];
if (columnCount) sections.push({ kind: 'column', images: names.slice(1, 1 + columnCount).map(img) });
if (gridCount) sections.push({ kind: 'grid', images: names.slice(1 + columnCount).map(img) });

const entry = {
    slug,
    title: title || slug.replace(/-/g, ' ').toUpperCase(),
    type: type || 'Diseño gráfico',
    description: '[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.',
    cover: img(names[0]),
    sections,
};

const header = fs.readFileSync(dataFile, 'utf8').split('export const extras')[0];
fs.writeFileSync(dataFile, `${header}export const extras = ${JSON.stringify([...extras, entry], null, 4)};\n`);

console.log(`✓ ${slug}: portada + ${columnCount} en columna + ${gridCount} en grilla → public/images/projects/${slug}/`);
console.log('Siguiente: completá la descripción en extra-projects.js, el caso en cases.js y un color en accents.js.');
