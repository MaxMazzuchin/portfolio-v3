// Biblioteca de gustos: libros, música, videos, películas, playlists.
//
// CÓMO CARGAR LAS TUYAS: reemplazá las entradas de ejemplo (placeholder: true) por las reales.
//   kind    'libro' | 'album' | 'video' | 'pelicula' | 'playlist'
//   author  autor / artista / canal
//   title   título
//   year    año (texto)
//   url     link para "Abrir recurso" (YouTube, Spotify, Goodreads, etc.)
//   desc    (opcional) descripción breve (2-4 líneas). Si existe, el clic abre una hoja con la ficha y el botón "Abrir recurso";
//           si falta, el clic va directo al link. Las entradas de ejemplo usan un texto de prueba.
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
    { kind: 'video', author: 'Virgil Abloh', title: 'Insert Complicated Title Here', year: '2017', url: 'https://youtu.be/qie5VITX6eQ', cover: '/images/library/01.webp', placeholder: true },
    { kind: 'video', author: 'Zane Lowe', title: 'Inside Brian Eno\'s Studio', year: '2025', url: 'https://youtu.be/nR4JAonAR4g', cover: '/images/library/02.webp', placeholder: true },
    { kind: 'video', author: 'All Star Series', title: 'Tyler Talk, Los Angeles', year: '2022', url: 'https://youtu.be/eAQUeUzcbNY', cover: '/images/library/03.webp', placeholder: true },
    { kind: 'album', author: 'Aphex Twin', title: 'Selected Ambient Works 85-92', year: '1992', url: 'https://apollorecords.bandcamp.com/album/selected-ambient-works-85-92', cover: '/images/library/04.webp', placeholder: true },
    { kind: 'libro', author: 'Rick Rubin', title: 'The Creative Act: A Way of Being', year: '2019', url: 'https://www.amazon.com.au/Creative-ACT-Way-Being/dp/0593652886', cover: '/images/library/05.webp', placeholder: true },
    { kind: 'album', author: 'Nujabes', title: 'Modal Soul', year: '2005', url: 'https://youtu.be/2ZBgLzcRSiw', cover: '/images/library/06.webp', placeholder: true },
    { kind: 'pelicula', author: 'David Lynch', title: 'The Art Life', year: '2017', url: 'https://youtu.be/_-8szoS3Wr0', cover: '/images/library/07.webp', placeholder: true },
    { kind: 'libro', author: 'Austin Kleon', title: 'Steal Like an Artist', year: '2012', url: 'https://www.amazon.com.au/Steal-Like-Artist-Things-Creative/dp/0761169253', cover: '/images/library/08.webp', placeholder: true },
    { kind: 'video', author: 'Lofi Cinema', title: 'Stop Chasing Original Ideas', year: '2025', url: 'https://youtu.be/1hQLp2Cl49Q', cover: '/images/library/09.webp', placeholder: true },
    { kind: 'video', author: 'Kanye West', title: 'Charlie Rose Interview', year: '2005', url: 'https://youtu.be/kNbyZWcp5Pw', cover: '/images/library/10.webp', placeholder: true },
    { kind: 'video', author: 'Struthless', title: 'Self Sabotage In This Economy?', year: '2025', url: 'https://youtu.be/k2mi3lt37W8', cover: '/images/library/11.webp', placeholder: true },
    { kind: 'album', author: 'The Avalanches', title: 'Since I Left You', year: '2000', url: 'https://open.spotify.com/album/4cSWbSVL31WoIcSBaSqyit', cover: '/images/library/12.webp', placeholder: true },
    { kind: 'playlist', author: 'OMA', title: 'Chill Hip-Hop Instrumental Mix', year: '2024', url: 'https://youtu.be/fGuYM11qErk', cover: '/images/library/13.webp', placeholder: true },
    { kind: 'video', author: 'Lofi Cinema', title: 'Make Creative Work Feel Effortless', year: '2025', url: 'https://youtu.be/Zd-te30g5Sk', cover: '/images/library/14.webp', placeholder: true },
    { kind: 'video', author: 'Steven Kotler', title: 'How to Activate Flow', year: '2025', url: 'https://youtu.be/RZIn9tfeQ2I', cover: '/images/library/15.webp', placeholder: true },
    { kind: 'playlist', author: 'Cookin Soul', title: 'Whateva vol. 2', year: '2019', url: 'https://youtu.be/_ptACzS5e_Q', cover: '/images/library/16.webp', placeholder: true },
    { kind: 'album', author: 'Freddie Gibbs', title: 'Piñata', year: '2014', url: 'https://open.spotify.com/album/4Qvh33TMiFWZIOoSMcM4PM', cover: '/images/library/17.webp', placeholder: true },
    { kind: 'video', author: 'Abstract', title: 'The Art of Design, Temporada 2 ep. 6', year: '2019', url: 'https://www.dailymotion.com/video/x8kgp1c', cover: '/images/library/18.webp', placeholder: true },
    { kind: 'video', author: 'Le Captain Nemo', title: 'MF DOOM Special Dishes', year: '2025', url: 'https://youtu.be/Veq-gqyoi14', cover: '/images/library/19.webp', placeholder: true },
    { kind: 'video', author: 'Creative Minds', title: 'James Blake Creative Process Deep Dive', year: '2023', url: 'https://youtu.be/YV21Mv7q5No', cover: '/images/library/20.webp', placeholder: true },
];

export const library = raw.map((e, i) => ({
    ...e,
    index: String(i + 1).padStart(2, '0'),
    slug: `${e.kind}-${i + 1}`,
    accent: kinds[e.kind].accent,
}));
