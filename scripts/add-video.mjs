// Comprime videos para la web y los deja en public/videos/<slug>/video-N.mp4.
//
// Uso:  node scripts/add-video.mjs <slug> <video> [<video> ...] [--cover N]
//
// - H.264 + AAC, +faststart (arranca a reproducir sin bajar todo), lado mayor <= 1280 px (<= 1080 en vertical).
// - Los archivos de menos de 2 MB se copian tal cual (no vale la pena recomprimirlos).
// - La numeración sigue la de los videos que ya haya en la carpeta.
// - Cada video deja al lado su portada, video-N-poster.webp (el fotograma con más contenido). Para achicar los que ya
//   están publicados y pesan mucho: node scripts/shrink-videos.mjs.
// - --cover N: saca un fotograma (a 1 s) del N-ésimo video de la lista y lo guarda como
//   public/images/projects/<slug>/cover.webp. Sirve para proyectos que son solo video.
// Imprime las entradas { src, w, h } para pegar en src/data/extra-projects.js.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { makePoster, writeVariants } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(`--${name}`);
    return i < 0 ? undefined : args.splice(i, 2)[1];
};
const coverN = flag('cover');
const [slug, ...inputs] = args;

if (!slug || !/^[a-z0-9-]+$/.test(slug) || inputs.length === 0) {
    console.error('Uso: node scripts/add-video.mjs <slug-en-minusculas> <video> [<video> ...] [--cover N]');
    process.exit(1);
}
for (const f of inputs) {
    if (!fs.existsSync(f)) { console.error(`No existe: ${f}`); process.exit(1); }
}

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/videos', slug);
fs.mkdirSync(outDir, { recursive: true });
let n = fs.readdirSync(outDir).filter((f) => /^video-\d+\.mp4$/.test(f)).length;

const run = (a) => spawnSync(ffmpeg, a, { encoding: 'utf8', maxBuffer: 1 << 26 });
const sizeOf = (file) => {
    const m = run(['-hide_banner', '-i', file]).stderr.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
    if (!m) throw new Error(`No pude leer las medidas de ${file}`);
    return [Number(m[1]), Number(m[2])];
};

const entries = [];
for (const [i, input] of inputs.entries()) {
    n += 1;
    const name = `video-${n}.mp4`;
    const out = path.join(outDir, name);
    const before = fs.statSync(input).size;

    if (before < 2 * 1024 * 1024) {
        fs.copyFileSync(input, out);
    } else {
        const r = run([
            '-y', '-hide_banner', '-loglevel', 'error', '-i', input,
            '-vf', "scale=w='if(gt(iw,ih),min(iw,1280),min(iw,1080))':h=-2",
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out,
        ]);
        if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
    }

    const [w, h] = sizeOf(out);
    entries.push({ src: `/videos/${slug}/${name}`, w, h });
    await makePoster(out, out.replace(/\.mp4$/, '-poster.webp')); // la usa el <video> como poster mientras baja
    const mb = (s) => (s / 1024 / 1024).toFixed(1);
    console.log(`✓ ${path.basename(input)} → ${name}  ${w}x${h}  ${mb(before)} MB → ${mb(fs.statSync(out).size)} MB`);

    if (coverN && Number(coverN) === i + 1) {
        const dir = path.join(root, 'public/images/projects', slug);
        fs.mkdirSync(dir, { recursive: true });
        const png = path.join(dir, '_cover.png');
        const f = run(['-y', '-hide_banner', '-loglevel', 'error', '-ss', '1', '-i', out, '-frames:v', '1', png]);
        if (f.status !== 0 || !fs.existsSync(png)) { console.error(f.stderr); process.exit(1); }
        await sharp(png).webp({ quality: 82 }).toFile(path.join(dir, 'cover.webp'));
        await writeVariants(path.join(dir, 'cover.webp'));
        fs.rmSync(png);
        console.log(`✓ cover → public/images/projects/${slug}/cover.webp`);
    }
}

console.log('\n' + JSON.stringify(entries, null, 4));
