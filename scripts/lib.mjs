// Utilidades compartidas por gen-data.mjs y add-project.mjs.
import fs from 'node:fs';

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
