// Suma imágenes al portfolio. Dos modos:
//
// 1) Proyecto nuevo (que no está en el V2):
//    node scripts/add-project.mjs <slug> <carpeta-con-imagenes> [--title "TÍTULO"] [--type "Tipo"] [--grid N]
//    - Ordena los archivos por nombre (natural: 2 antes que 10). El primero es la portada.
//    - Los últimos N (--grid) van a la grilla de 2 columnas; el resto a la columna única.
//    - Agrega la entrada a extras en src/data/extra-projects.js. Después completá descripción y caso en cases.js.
//
// 2) Sumar piezas a un proyecto que ya existe (en la grilla):
//    node scripts/add-project.mjs --append <slug> <imagen> [<imagen> ...]
//    - Respeta el orden en que pasás los archivos. Numera grid-N siguiendo los que ya haya.
//    - Las agrega a additions en src/data/extra-projects.js.
//
// Las imágenes se convierten a .webp (máx. 1600 px de ancho) en public/images/projects/<slug>/.
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
const bool = (name) => {
    const i = args.indexOf(`--${name}`);
    if (i < 0) return false;
    args.splice(i, 1);
    return true;
};

const append = bool('append');
const title = flag('title');
const type = flag('type');
const gridCount = Number(flag('grid') || 0);

const root = path.resolve(import.meta.dirname, '..');
const dataFile = path.join(root, 'src/data/extra-projects.js');
const { extras, additions = {} } = await import(pathToFileURL(dataFile).href);
const { projects: v2 } = await import(pathToFileURL(path.join(root, 'src/data/projects.js')).href);

const usage = () => {
    console.error('Uso:\n  node scripts/add-project.mjs <slug> <carpeta> [--title "TÍTULO"] [--type "Tipo"] [--grid N]\n  node scripts/add-project.mjs --append <slug> <imagen> [<imagen> ...]');
    process.exit(1);
};

const toWebp = (from, to) => sharp(from).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(to);

const entryFor = (slug, file) => {
    const [w, h] = webpSize(path.join(root, 'public/images/projects', slug, file));
    return { src: `/images/projects/${slug}/${file}`, w, h };
};

const save = (nextExtras, nextAdditions) => {
    const header = fs.readFileSync(dataFile, 'utf8').split('export const extras')[0];
    fs.writeFileSync(
        dataFile,
        `${header}export const extras = ${JSON.stringify(nextExtras, null, 4)};\n\n` +
        `// Piezas que se suman a la grilla de un proyecto que viene del V2 (clave = slug).\n` +
        `export const additions = ${JSON.stringify(nextAdditions, null, 4)};\n`,
    );
};

if (append) {
    const [slug, ...files] = args;
    if (!slug || files.length === 0) usage();
    if (![...v2, ...extras].some((p) => p.slug === slug)) {
        console.error(`No existe el proyecto "${slug}".`);
        process.exit(1);
    }
    for (const f of files) {
        if (!fs.existsSync(f)) { console.error(`No existe: ${f}`); process.exit(1); }
    }

    const outDir = path.join(root, 'public/images/projects', slug);
    fs.mkdirSync(outDir, { recursive: true });
    // Siguiente número libre: sigue a los grid-N que ya existan en disco.
    let n = fs.readdirSync(outDir).filter((f) => /^grid-\d+\.webp$/.test(f)).length;
    const added = [];
    for (const f of files) {
        n += 1;
        const name = `grid-${n}.webp`;
        await toWebp(f, path.join(outDir, name));
        added.push(entryFor(slug, name));
        console.log(`✓ ${path.basename(f)} → ${name}`);
    }
    save(extras, { ...additions, [slug]: [...(additions[slug] || []), ...added] });
    console.log(`\n${slug}: +${added.length} piezas en la grilla.`);
    process.exit(0);
}

const [slug, dir] = args;
if (!slug || !dir || !/^[a-z0-9-]+$/.test(slug)) usage();

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

const outDir = path.join(root, 'public/images/projects', slug);
fs.mkdirSync(outDir, { recursive: true });
const columnCount = files.length - 1 - gridCount;
const names = files.map((_, i) => (i === 0 ? 'cover.webp' : i <= columnCount ? `image-${i}.webp` : `grid-${i - columnCount}.webp`));

for (const [i, f] of files.entries()) await toWebp(path.join(dir, f), path.join(outDir, names[i]));

const sections = [];
if (columnCount) sections.push({ kind: 'column', images: names.slice(1, 1 + columnCount).map((f) => entryFor(slug, f)) });
if (gridCount) sections.push({ kind: 'grid', images: names.slice(1 + columnCount).map((f) => entryFor(slug, f)) });

save([...extras, {
    slug,
    title: title || slug.replace(/-/g, ' ').toUpperCase(),
    type: type || 'Diseño gráfico',
    description: '[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.',
    cover: entryFor(slug, names[0]),
    sections,
}], additions);

console.log(`✓ ${slug}: portada + ${columnCount} en columna + ${gridCount} en grilla → public/images/projects/${slug}/`);
console.log('Siguiente: completá la descripción en extra-projects.js, el caso en cases.js y un color en accents.js.');
