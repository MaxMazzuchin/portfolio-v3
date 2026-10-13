// Biblioteca de gustos: libros, música, videos, películas, playlists.
//
// CÓMO CARGAR LAS TUYAS: reemplazá las entradas de ejemplo (placeholder: true) por las reales.
//   kind    'libro' | 'album' | 'video' | 'pelicula' | 'playlist'
//   author  autor / artista / canal
//   title   título
//   year    año (texto)
//   url     link para "Abrir recurso" (YouTube, Spotify, Goodreads, etc.)
//   cover   (opcional) '/images/library/<archivo>.webp'. Si falta, se genera una carta con el tipo y el título.
// Las entradas con placeholder: true muestran la etiqueta EJEMPLO en pantalla; al borrar esa línea desaparece.

export const kinds = {
    libro: { label: 'Libros', singular: 'Libro', accent: '#e6c229' },
    album: { label: 'Álbumes', singular: 'Álbum', accent: '#ff4d8d' },
    video: { label: 'Videos', singular: 'Video', accent: '#3d7bff' },
    pelicula: { label: 'Películas y documentales', singular: 'Película', accent: '#ff6b3d' },
    playlist: { label: 'Playlists', singular: 'Playlist', accent: '#2fd68f' },
};

const raw = [
    { kind: 'libro', author: 'Autor/a de ejemplo', title: 'Un libro que me cambió la cabeza', year: '2012', url: '', placeholder: true },
    { kind: 'album', author: 'Artista de ejemplo', title: 'Un disco que escucho en loop', year: '2001', url: '', placeholder: true },
    { kind: 'video', author: 'Canal de ejemplo', title: 'Una charla que vuelvo a ver', year: '2023', url: '', placeholder: true },
    { kind: 'pelicula', author: 'Director/a de ejemplo', title: 'Una película para ver de noche', year: '1999', url: '', placeholder: true },
    { kind: 'playlist', author: 'Máximo', title: 'Lo que suena mientras diseño', year: '2026', url: '', placeholder: true },
    { kind: 'libro', author: 'Otro/a autor/a de ejemplo', title: 'Otro libro para releer', year: '2019', url: '', placeholder: true },
];

export const library = raw.map((e, i) => ({
    ...e,
    index: String(i + 1).padStart(2, '0'),
    slug: `${e.kind}-${i + 1}`,
    accent: kinds[e.kind].accent,
}));
