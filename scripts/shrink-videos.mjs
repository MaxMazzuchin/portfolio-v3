// Achica los videos pesados de public/videos y les saca la portada (video-N-poster.webp, que el <video> usa como `poster`).
//
//   node scripts/shrink-videos.mjs            recodifica lo que pese más de 4 MB y hace las portadas que falten
//   node scripts/shrink-videos.mjs --posters  solo las portadas
//
// Es idempotente y no encadena pérdidas: antes de tocar un video se guarda una copia en originales/videos/<slug>/ (ignorada por
// git) y siempre se recodifica DESDE esa copia. Correrlo de nuevo da el mismo resultado.
// H.264 CRF 29, preset slow, +faststart; el audio, si el video lo tiene, se conserva (AAC 96k). Los cuadrados y verticales
// bajan a 1080 de lado mayor y los apaisados a 1920: la pieza más grande en pantalla mide ~800 px de alto.
// Lo que ya pesa menos de 4 MB no se toca. Con --force se recodifica todo de nuevo (por ejemplo después de cambiar el CRF).
import fs from 'node:fs';
import path from 'node:path';
import { runFfmpeg, videoInfo, makePoster } from './lib.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pubDir = path.join(root, 'public/videos');
const backDir = path.join(root, 'originales/videos');
const postersOnly = process.argv.includes('--posters');
const force = process.argv.includes('--force');

const THRESHOLD = 4 * 1024 * 1024;
const CRF = 29;
// Se dejan como están (ya vienen comprimidos con criterio propio): el flyer animado de Curu.
const SKIP = new Set(['curu/video-1.mp4']);
const mb = (n) => (n / 1048576).toFixed(1);

const videos = fs.readdirSync(pubDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => fs.readdirSync(path.join(pubDir, d.name)).filter((f) => /^video-\d+\.mp4$/.test(f)).map((f) => `${d.name}/${f}`))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let before = 0;
let after = 0;
for (const rel of videos) {
    const pub = path.join(pubDir, rel);
    const back = path.join(backDir, rel);
    const size0 = fs.statSync(pub).size;

    // Ya recodificado: hay copia de seguridad y el video publicado es más nuevo que ella.
    const done = fs.existsSync(back) && fs.statSync(pub).mtimeMs > fs.statSync(back).mtimeMs;
    if (!postersOnly && !SKIP.has(rel) && (force || !done) && (size0 > THRESHOLD || fs.existsSync(back))) {
        // La copia de seguridad es la fuente. Si no existe todavía, se guarda el archivo actual.
        if (!fs.existsSync(back)) { fs.mkdirSync(path.dirname(back), { recursive: true }); fs.copyFileSync(pub, back); }
        const { w, h } = videoInfo(back);
        const cap = w > h ? 1920 : 1080;
        const tmp = pub + '.tmp.mp4';
        const r = runFfmpeg([
            '-y', '-hide_banner', '-loglevel', 'error', '-i', back,
            '-vf', `scale=w='if(gt(iw,ih),min(iw,${cap}),min(iw,${Math.min(cap, 1080)}))':h=-2`,
            '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF), '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', tmp,
        ]);
        if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
        const small = fs.statSync(tmp).size;
        const source = fs.statSync(back).size;
        if (small < source) { fs.renameSync(tmp, pub); } else { fs.rmSync(tmp); fs.copyFileSync(back, pub); } // si no mejora, queda el original
        const now = videoInfo(pub);
        before += source;
        after += fs.statSync(pub).size;
        console.log(`✓ ${rel}  ${w}×${h} → ${now.w}×${now.h}  ${mb(source)} MB → ${mb(fs.statSync(pub).size)} MB`);
    }

    const poster = pub.replace(/\.mp4$/, '-poster.webp');
    if (!fs.existsSync(poster)) { await makePoster(pub, poster); console.log(`  portada ${rel.replace('.mp4', '-poster.webp')}  ${Math.round(fs.statSync(poster).size / 1024)} KB`); }
}
if (before) console.log(`\nvideos recodificados: ${mb(before)} MB → ${mb(after)} MB (−${(100 * (1 - after / before)).toFixed(0)} %)`);
