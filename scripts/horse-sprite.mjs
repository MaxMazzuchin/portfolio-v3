// Convierte el video del caballo (trazo blanco sobre negro, ciclo de galope) en una tira de cuadros con transparencia:
// public/images/home/caballo.webp. El brillo del video pasa a ser el alfa y el color es blanco; en el home la tira se usa
// como máscara (CSS mask) pintada con el color del texto, así el trazo cambia solo con el tema y no hace falta cargar un <video>.
//
//   node scripts/horse-sprite.mjs [video]     por defecto originales/caballo.mp4
//
// Imprime la cantidad de cuadros y el tamaño de cada uno: tienen que coincidir con --horse-frames y la proporción de
// .ghost-horse en base.css.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const src = process.argv[2] || 'originales/caballo.mp4';
const out = 'public/images/home/caballo.webp';
const W = 640; // ancho de cada cuadro

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caballo-'));
execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', src, '-vf', `fps=6,scale=${W}:-2`, path.join(tmp, 'f%02d.png')]);
const files = fs.readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();

const first = await sharp(path.join(tmp, files[0])).metadata();
const H = first.height;
const sheet = Buffer.alloc(W * files.length * H * 4, 255); // RGB en blanco; el alfa se completa abajo
for (let i = 0; i < files.length; i++) {
    const { data } = await sharp(path.join(tmp, files[i])).greyscale().raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) sheet[((y * W * files.length) + i * W + x) * 4 + 3] = data[y * W + x];
    }
}

fs.mkdirSync(path.dirname(out), { recursive: true });
await sharp(sheet, { raw: { width: W * files.length, height: H, channels: 4 } }).webp({ quality: 80, alphaQuality: 90 }).toFile(out);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${out}: ${files.length} cuadros de ${W}x${H} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
