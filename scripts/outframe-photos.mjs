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
