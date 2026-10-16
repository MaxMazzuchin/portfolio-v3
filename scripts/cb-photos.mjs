// Recorta las fotos de propiedades de las láminas del manual de Contigiani Briñón (zonas sin texto ni logo).
// El manual ahora se arma en código; solo las fotos siguen siendo imagen. Si hay originales, reemplazar los .webp de /fotos.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const dir = 'public/images/projects/contigiani-brinon';
mkdirSync(`${dir}/fotos`, { recursive: true });
const crops = [
    ['grid-7', 'casa-h', { left: 560, top: 122, width: 1178, height: 513 }],
    ['grid-8', 'casa-v', { left: 0, top: 160, width: 1080, height: 700 }],
    ['grid-10', 'pileta-v', { left: 0, top: 0, width: 1080, height: 1180 }],
];
for (const [src, out, region] of crops) {
    await sharp(`${dir}/${src}.webp`).extract(region).webp({ quality: 82 }).toFile(`${dir}/fotos/${out}.webp`);
    console.log(out, region.width, 'x', region.height);
}
