// Utilidades compartidas por gen-data.mjs, add-project.mjs, add-video.mjs y shrink-videos.mjs.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { variantWidths, variantSrc } from '../src/core/srcset.js';

/** [ancho, alto] de un .webp leyendo solo el encabezado. */
export function webpSize(file) {
    const fd = fs.openSync(file, 'r');
    const b = Buffer.alloc(40);
    fs.readSync(fd, b, 0, 40, 0);
    fs.closeSync(fd);
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (kind === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
    if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    throw new Error(`No es un webp válido: ${file}`);
}

/** Crea al lado de un .webp sus variantes livianas (-800, -1200, -1600 según su ancho; la regla vive en src/core/srcset.js). */
export async function writeVariants(file) {
    const [w] = webpSize(file);
    for (const v of variantWidths(w)) {
        await sharp(file).resize({ width: v, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(variantSrc(file, v));
    }
}

/** Corre ffmpeg (el de ffmpeg-static) y devuelve { status, stderr }. */
export const runFfmpeg = (args) => spawnSync(ffmpeg, args, { encoding: 'utf8', maxBuffer: 1 << 26 });

/** [ancho, alto] y duración (s) de un video, leídos del encabezado que imprime ffmpeg. */
export function videoInfo(file) {
    const err = runFfmpeg(['-hide_banner', '-i', file]).stderr;
    const v = err.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
    const d = err.match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (!v) throw new Error(`No pude leer las medidas de ${file}`);
    return { w: Number(v[1]), h: Number(v[2]), seconds: d ? Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]) : 0 };
}

/**
 * Portada de un video (webp de 800 px de ancho). No toma un fotograma fijo: muchos loops arrancan casi negros y la portada
 * quedaría vacía. Saca cinco y se queda con el de más contenido (mayor entropía).
 */
export async function makePoster(videoFile, outWebp) {
    const { seconds } = videoInfo(videoFile);
    const stops = [0.5, 0.15, 0.35, 0.55, 0.75].map((f, i) => (i === 0 ? 0.5 : Math.max(0.1, seconds * f)));
    let best = null;
    for (const [i, t] of stops.entries()) {
        const png = `${outWebp}.${i}.png`;
        const r = runFfmpeg(['-y', '-hide_banner', '-loglevel', 'error', '-ss', t.toFixed(2), '-i', videoFile, '-frames:v', '1', png]);
        if (r.status !== 0 || !fs.existsSync(png)) continue;
        const { entropy } = await sharp(png).stats();
        if (!best || entropy > best.entropy) { if (best) fs.rmSync(best.png); best = { png, entropy }; } else fs.rmSync(png);
    }
    if (!best) throw new Error(`No pude sacar un fotograma de ${videoFile}`);
    await sharp(best.png).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(outWebp);
    fs.rmSync(best.png);
}
