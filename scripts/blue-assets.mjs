// Prepara los assets de Blue Marketing a partir de la carpeta que entregó el cliente.
//
//   node scripts/blue-assets.mjs "<carpeta Blue Marketing>"
//
// Genera:
//   src/brand/blue-paths.js                          logo, olas y separadores como trazados SVG (GENERADO: no editar a mano)
//   public/images/projects/blue-marketing/cover.webp tapa 2400×1350 (fondo navy, logo y olas)
//   public/images/projects/blue-marketing/posts/     los 5 posts de resultados en .webp (1080 de ancho)
//   public/images/projects/blue-marketing/stickers/  los 15 stickers en SVG (se usan como <img>: cada uno trae sus clases de color)
//
// El logo y las olas salen del PDF de lineamientos (portada): son vectores exactos. El PDF usa y hacia arriba y cada forma
// lleva su propio `cm` (traslación), así que un punto (x, y) pasa a SVG como (tx + x, 1080 − ty − y).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import sharp from 'sharp';

const src = process.argv[2];
if (!src || !fs.existsSync(src)) { console.error('Uso: node scripts/blue-assets.mjs "<carpeta Blue Marketing>"'); process.exit(1); }
const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/images/projects/blue-marketing');
const find = (dir, re) => fs.readdirSync(path.join(src, dir)).find((f) => re.test(f));
const r2 = (n) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------- PDF → trazados
function pageStreams(pdfFile) {
    const buf = fs.readFileSync(pdfFile);
    const txt = buf.toString('latin1');
    const re = /(\d+) 0 obj\s*<<([\s\S]*?)>>\s*stream\r?\n/g;
    const out = [];
    let m;
    while ((m = re.exec(txt))) {
        const start = m.index + m[0].length;
        const raw = buf.subarray(start, txt.indexOf('endstream', start));
        if (!/FlateDecode/.test(m[2])) continue;
        try { out.push(zlib.inflateSync(raw).toString('latin1')); } catch { /* no es un stream de contenido */ }
    }
    return out;
}

/** Interpreta los operadores de trazado (q Q cm m l c v y h f f*) y devuelve las formas rellenas, ya en coordenadas SVG. */
function parseShapes(stream, pageH = 1080) {
    const shapes = [];
    const stack = [];
    let tx = 0, ty = 0, nums = [], d = '', cx = 0, cy = 0, hasPath = false, fill = null;
    const P = (x, y) => [r2(tx + x), r2(pageH - ty - y)];
    const pt = (x, y) => { const [a, b] = P(x, y); return `${a} ${b}`; };
    for (const tok of stream.split(/\s+/).filter(Boolean)) {
        if (/^-?[\d.]+$/.test(tok)) { nums.push(Number(tok)); continue; }
        switch (tok) {
            case 'q': stack.push([tx, ty]); break;
            case 'Q': [tx, ty] = stack.pop() || [0, 0]; break;
            case 'cm': { const [a, b, c, dd, e, f] = nums.slice(-6); if (a !== 1 || b !== 0 || c !== 0 || dd !== 1) throw new Error('cm con escala o rotación: no soportado'); tx += e; ty += f; break; }
            case 'scn': case 'sc': fill = nums.slice(-3).map((v) => Math.round(v * 255)); break;
            case 'm': d += `M${pt(nums[0], nums[1])}`; [cx, cy] = nums; hasPath = true; break;
            case 'l': d += `L${pt(nums[0], nums[1])}`; [cx, cy] = nums; break;
            case 'c': d += `C${pt(nums[0], nums[1])} ${pt(nums[2], nums[3])} ${pt(nums[4], nums[5])}`; [cx, cy] = nums.slice(4); break;
            case 'v': d += `C${pt(cx, cy)} ${pt(nums[0], nums[1])} ${pt(nums[2], nums[3])}`; [cx, cy] = nums.slice(2); break; // 1.er control = punto actual
            case 'y': d += `C${pt(nums[0], nums[1])} ${pt(nums[2], nums[3])} ${pt(nums[2], nums[3])}`; [cx, cy] = nums.slice(2); break; // 2.º control = destino
            case 'h': d += 'Z'; break;
            case 'f': case 'F': case 'f*':
                if (hasPath) shapes.push({ d, evenodd: tok === 'f*', fill });
                d = ''; hasPath = false; break;
            case 'n': d = ''; hasPath = false; break; // fin de trazado sin pintar (por ejemplo el recorte de la página)
            default: break; // re, W, gs, cs, etc.
        }
        nums = [];
    }
    return shapes;
}

/** Caja de un trazado absoluto M/L/C/Z, con las curvas muestreadas (los puntos de control solos la agrandarían). */
function bbox(d) {
    const pts = [];
    let cur = [0, 0];
    for (const [, op, args] of d.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
        const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
        if (op === 'M' || op === 'L') { cur = [n[0], n[1]]; pts.push(cur); }
        if (op === 'C') {
            const [p0, p1, p2, p3] = [cur, [n[0], n[1]], [n[2], n[3]], [n[4], n[5]]];
            for (let t = 0; t <= 1.0001; t += 0.05) {
                const u = 1 - t;
                pts.push([0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]));
            }
            cur = p3;
        }
    }
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

/** Mueve un trazado absoluto para que su caja arranque en (0,0). */
const shift = (d, dx, dy) => d.replace(/([MLC])([^MLCZ]*)/g, (_, op, args) => {
    const n = args.trim().split(/\s+/).map(Number);
    return op + n.map((v, i) => r2(v - (i % 2 ? dy : dx))).join(' ');
});

const pdf = path.join(src, 'Identidad, Logos y Fuentes', find('Identidad, Logos y Fuentes', /Lineamientos.*\.pdf$/));
const cover = pageStreams(pdf).find((s) => s.includes('0 0 0.294') && s.includes('cm'));
if (!cover) throw new Error('No encontré la portada del PDF');
const shapes = parseShapes(cover);
if (shapes.length !== 3) throw new Error(`La portada del PDF debería traer 3 formas (logo y dos olas) y trae ${shapes.length}`);
const [logoS, waveA, waveB] = shapes;
const lb = bbox(logoS.d);
const logo = { d: shift(logoS.d, lb.x, lb.y), w: r2(lb.w), h: r2(lb.h), x: r2(lb.x), y: r2(lb.y) };
console.log(`logo ${logo.w}×${logo.h} (en la tapa: ${logo.x}, ${logo.y}) · rellenos ${shapes.map((s) => s.fill?.join(',')).join(' | ')}`);

// ---------------------------------------------------------------- separadores (Clientes / Producción / Resultados)
const seps = [['clientes', 'CLIENTES'], ['producci', 'PRODUCCIÓN'], ['resultados', 'RESULTADOS']].map(([key, title]) => {
    const f = find('Iconos', new RegExp(`^${key}.*\\.svg$`, 'i'));
    const s = fs.readFileSync(path.join(src, 'Iconos', f), 'utf8');
    const t = s.match(/translate\(([\d.]+) ([\d.]+)\)/);
    const font = s.match(/\.cls-2\s*\{[^}]*font-size:\s*([\d.]+)px;[^}]*letter-spacing:\s*(-?[\d.]+)em/);
    const fills = [...s.matchAll(/<path class="cls-1" d="([^"]+)"/g)].map((m) => m[1]);
    const outline = s.match(/<path class="cls-4" d="([^"]+)"/)[1];
    if (fills.length !== 2 || !t || !font) throw new Error(`Separador ${f}: no pude leer su estructura`);
    return { title, x: Number(t[1]), y: Number(t[2]), size: Number(font[1]), ls: Number(font[2]), wave: fills[0], waveThin: fills[1], outline };
});

fs.writeFileSync(path.join(root, 'src/brand/blue-paths.js'),
    `// GENERADO por scripts/blue-assets.mjs a partir del PDF de lineamientos de Blue Marketing. No editar a mano.\n` +
    `// El logo y las olas son vectores exactos de la portada (lámina de 1920×1080): LOGO.x / LOGO.y dicen dónde estaba el logo en ella.\n` +
    `// El logo es un solo trazado cerrado que ya incluye las dos velas (se rellena con nonzero, no con evenodd).\n` +
    `export const SHEET = [1920, 1080];\n` +
    `export const LOGO = ${JSON.stringify(logo)};\n` +
    `export const WAVE_A = ${JSON.stringify(waveA.d)};\n` +
    `export const WAVE_B = ${JSON.stringify(waveB.d)};\n` +
    `// Separadores: lámina de 1200.39×1113.98; el texto va alineado a la izquierda en (x, y) con su propio cuerpo y espaciado.\n` +
    `export const SEP_SIZE = [1200.39, 1113.98];\n` +
    `export const SEPARATORS = ${JSON.stringify(seps, null, 1)};\n`);
console.log('✓ src/brand/blue-paths.js');

// ---------------------------------------------------------------- imágenes
fs.mkdirSync(path.join(outDir, 'posts'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'stickers'), { recursive: true });

// Tapa: la portada del PDF (fondo navy, logo y olas). Sin texto, porque librsvg no tiene Poppins.
const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="2400" height="1350"><rect width="1920" height="1080" fill="#00004B"/>` +
    `<g fill="#E7ECFF"><g transform="translate(${logo.x} ${logo.y})"><path d="${logo.d}"/></g><path d="${waveA.d}"/><path d="${waveB.d}"/></g></svg>`;
await sharp(Buffer.from(coverSvg)).webp({ quality: 88 }).toFile(path.join(outDir, 'cover.webp'));
console.log('✓ cover.webp');

const posts = fs.readdirSync(path.join(src, 'Posts')).filter((f) => /\.png$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const [i, f] of posts.entries()) {
    await sharp(path.join(src, 'Posts', f)).resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outDir, 'posts', `post-${i + 1}.webp`));
}
console.log(`✓ ${posts.length} posts`);

const stickers = fs.readdirSync(path.join(src, 'Stickers/SVG')).filter((f) => /\.svg$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const [i, f] of stickers.entries()) fs.copyFileSync(path.join(src, 'Stickers/SVG', f), path.join(outDir, 'stickers', `sticker-${i + 1}.svg`));
console.log(`✓ ${stickers.length} stickers`);

