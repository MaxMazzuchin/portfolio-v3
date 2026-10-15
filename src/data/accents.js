// Un acento por proyecto. Se usa de forma sutil (campo de dither, marcadores, contador);
// el resto del sitio se mantiene monocromático.
export const accents = {
    'album-artwork': '#ff6b3d',
    'pone-atencion': '#e6c229',
    'sin-datos': '#ff4d8d',
    'i-life': '#3d7bff',
    outframe: '#a78bfa',
    'exp-grafica': '#2fd68f',
    '100-posters': '#ff9f1c',
    d2x: '#4dd4ff',
    nyro: '#c7f24b',
    animacion: '#ff3d3d',
    curu: '#d9b38c',
    gracias: '#74c7ec',
    'asap-rocky-x-mazzu': '#ff7a2f',
};

export const accentOf = (slug) => accents[slug] || '#c7f24b';
