// Variantes de ancho de las imágenes de proyecto.
//
// Al lado de cada <nombre>.webp (el original, que no se toca) hay <nombre>-800.webp y, si el original es más grande,
// -1200 y -1600. Cuáles existen se deduce del ancho `w` del original, así los datos (projects.js, extra-projects.js)
// no cambian y scripts/variants.mjs (que las genera) y el navegador (que las pide) aplican la misma regla.
// 800 sirve a un celular de 2× y a las cartas de la rueda; 1200 a un celular de 3× (390 px × 3 ≈ 1170) y a la columna de
// una pantalla de escritorio de 1×; 1600 a escritorio de alta densidad.
// Este archivo no toca el DOM: lo importan las vistas y también el script de Node.

export const VARIANTS = [800, 1200, 1600];

/** Anchos de variante que existen para un original de `w` px: solo si el original es claramente más grande (20 %). */
export const variantWidths = (w) => VARIANTS.filter((v) => w > v * 1.2);

/** /images/projects/x/cover.webp → /images/projects/x/cover-800.webp */
export const variantSrc = (src, v) => src.replace(/\.webp$/, `-${v}.webp`);

/** Atributo srcset de una imagen { src, w }. Vacío si no tiene variantes (el original ya es chico). */
export const srcsetOf = (s) => {
    const vs = variantWidths(s.w);
    return vs.length ? [...vs.map((v) => `${variantSrc(s.src, v)} ${v}w`), `${s.src} ${s.w}w`].join(', ') : '';
};

/** URL de la variante más chica que alcanza para `width` px de ancho; el original si no hay una así de grande. */
export const sized = (s, width) => {
    const v = variantWidths(s.w).find((x) => x >= width);
    return v ? variantSrc(s.src, v) : s.src;
};
