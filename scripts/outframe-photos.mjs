// Recorta las fotos de Chema Madoz de las láminas de Outframe (zonas sin texto) para armar la maquetación en código.
// Si hay fotos originales, reemplazar los .webp de /fotos sin tocar código.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const dir = 'public/images/projects/outframe';
mkdirSync(`${dir}/fotos`, { recursive: true });
const S = 1.2; // las láminas miden 2400 px y las medidas de abajo salen de verlas a 2000
const r = (l, t, w, h) => ({ left: Math.round(l * S), top: Math.round(t * S), width: Math.round(w * S), height: Math.round(h * S) });
const crops = [
    ['image-1', 'retrato', r(135, 108, 1730, 607)],
    ['image-2', 'platos', r(640, 300, 460, 620)],
    ['image-2', 'piedras', r(1540, 480, 330, 715)],
    ['image-3', 'lampara', r(246, 232, 251, 710)],
    ['image-3', 'piramides', r(660, 700, 1140, 500)],
    ['image-4', 'arbol', r(340, 170, 260, 280)],
    ['image-4', 'cipres', r(1220, 170, 230, 420)],
    ['image-5', 'manos', r(123, 95, 1757, 1240)],
    ['image-6', 'avion', r(123, 95, 1757, 1240)],
];
for (const [src, out, region] of crops) {
    await sharp(`${dir}/${src}.webp`).extract(region).webp({ quality: 82 }).toFile(`${dir}/fotos/${out}.webp`);
    console.log(out, region.width, 'x', region.height);
}
// La cara que asoma dentro de las letras de la portada: recorte del retrato, más contraste.
await sharp(`${dir}/image-1.webp`).extract(r(1090, 108, 250, 322)).resize({ width: 1000 }).greyscale().normalise().linear(1.5, -70).webp({ quality: 85 }).toFile(`${dir}/fotos/cara.webp`);
console.log('cara');

// Relleno de las letras de la portada: la zona de las letras de la tapa original (2552 px), con todo lo que no es foto
// (vidrio gris claro) pintado de rojo. Así al apoyarlo dentro de letras nuevas solo se ve la foto de Madoz sobre rojo.
{
    const src = 'C:/Users/Máximo/Downloads/PORTFOLIO/outframe/OUTFRAME - Revista_page-0001.jpg';
    const k = 2552 / 1100;
    const region = { left: Math.round(200 * k), top: Math.round(240 * k), width: Math.round(700 * k), height: Math.round(970 * k) };
    const { data, info } = await sharp(src).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const RED = [227, 48, 42];
    const smooth = (v) => Math.min(1, Math.max(0, v));
    for (let i = 0; i < data.length; i += 3) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const lum = (r + g + b) / 3;
        const redness = smooth((r - Math.max(g, b) - 28) / 40);
        const dark = smooth((80 - lum) / 28);
        const keep = Math.max(redness, dark);
        data[i] = Math.round(r * keep + RED[0] * (1 - keep));
        data[i + 1] = Math.round(g * keep + RED[1] * (1 - keep));
        data[i + 2] = Math.round(b * keep + RED[2] * (1 - keep));
    }
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).resize({ width: 1400 }).webp({ quality: 86 }).toFile(`${dir}/fotos/letras-foto.webp`);
    console.log('letras-foto', info.width, 'x', info.height);
}
