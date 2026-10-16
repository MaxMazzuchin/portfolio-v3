// Convierte el video del caballo (trazo blanco sobre negro, ciclo de galope) en una grilla de cuadros con transparencia:
// public/images/transition/caballo.webp, 5 columnas y el resto filas (una tira de 6400 px de ancho no entra en la textura
// máxima de varios celulares). El brillo del video pasa a ser el alfa; el shader de la cortina (gl/shaders/horse.frag) lo
// pinta con dither.
//
//   node scripts/horse-sprite.mjs [video]     por defecto originales/caballo.mp4
//
// Imprime la cantidad de cuadros y su tamaño: tienen que coincidir con HORSE en gl/index.js.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const src = process.argv[2] || 'originales/caballo.mp4';
const out = 'public/images/transition/caballo.webp';
const W = 640; // ancho de cada cuadro
const COLS = 5;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caballo-'));
execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', src, '-vf', `fps=6,scale=${W}:-2`, path.join(tmp, 'f%02d.png')]);
const files = fs.readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();

const H = (await sharp(path.join(tmp, files[0])).metadata()).height;
const rows = Math.ceil(files.length / COLS);
const SW = W * COLS;
const sheet = Buffer.alloc(SW * H * rows * 4, 255); // RGB en blanco; el alfa se completa abajo
for (let i = 0; i < files.length; i++) {
    const { data } = await sharp(path.join(tmp, files[i])).greyscale().raw().toBuffer({ resolveWithObject: true });
    const ox = (i % COLS) * W;
    const oy = Math.floor(i / COLS) * H;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) sheet[(((oy + y) * SW) + ox + x) * 4 + 3] = data[y * W + x];
    }
}

fs.mkdirSync(path.dirname(out), { recursive: true });
await sharp(sheet, { raw: { width: SW, height: H * rows, channels: 4 } }).webp({ quality: 80, alphaQuality: 90 }).toFile(out);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${out}: ${files.length} cuadros de ${W}x${H}, ${COLS} columnas x ${rows} filas (${Math.round(fs.statSync(out).size / 1024)} KB)`);
