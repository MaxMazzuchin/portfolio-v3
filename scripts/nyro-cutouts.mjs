// Recorta el fondo de las láminas originales de stickers y papelería de Nyro (quedan con transparencia).
// El fondo se detecta desde los bordes: un píxel es fondo si se parece al color de fondo de su fila y está conectado al borde.
import sharp from 'sharp';

const dir = 'public/images/projects/nyro';

async function cutout(src, out, { tol, crop } = {}) {
    let img = sharp(`${dir}/${src}`);
    if (crop) img = img.extract(crop);
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    // Color de fondo por fila: promedio de los extremos izquierdo y derecho.
    const bg = Array.from({ length: h }, (_, y) => {
        const c = [0, 0, 0];
        for (const x of [1, 2, 3, w - 4, w - 3, w - 2]) for (let k = 0; k < 3; k++) c[k] += data[(y * w + x) * 3 + k] / 6;
        return c;
    });
    const isBg = (x, y) => {
        const i = (y * w + x) * 3;
        const b = bg[y];
        return Math.abs(data[i] - b[0]) + Math.abs(data[i + 1] - b[1]) + Math.abs(data[i + 2] - b[2]) <= tol;
    };
    const seen = new Uint8Array(w * h);
    const stack = [];
    const push = (x, y) => { const k = y * w + x; if (!seen[k] && isBg(x, y)) { seen[k] = 1; stack.push(k); } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (stack.length) {
        const k = stack.pop();
        const x = k % w, y = (k / w) | 0;
        if (x > 0) push(x - 1, y);
        if (x < w - 1) push(x + 1, y);
        if (y > 0) push(x, y - 1);
        if (y < h - 1) push(x, y + 1);
    }
    const alpha = Buffer.alloc(w * h);
    for (let k = 0; k < w * h; k++) alpha[k] = seen[k] ? 0 : 255;
    // Borde suave: se achica 1 px y se desenfoca apenas, para que no quede el halo del fondo.
    const soft = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(1.1).linear(1.6, -80).toColourspace('b-w').raw().toBuffer();
    const rgba = Buffer.alloc(w * h * 4);
    for (let k = 0; k < w * h; k++) {
        rgba[k * 4] = data[k * 3]; rgba[k * 4 + 1] = data[k * 3 + 1]; rgba[k * 4 + 2] = data[k * 3 + 2]; rgba[k * 4 + 3] = soft[k];
    }
    await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).trim().webp({ quality: 92, alphaQuality: 95 }).toFile(`${dir}/${out}`);
    const m = await sharp(`${dir}/${out}`).metadata();
    console.log(out, m.width, 'x', m.height);
}

await cutout('image-2.webp', 'stickers.webp', { tol: 34 });
await cutout('image-3.webp', 'papeleria.webp', { tol: 46, crop: { left: 0, top: 50, width: 1024, height: 526 } });
