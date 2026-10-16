// Biblioteca de gustos: libros, música, videos, películas, playlists.
//
// CÓMO CARGAR LAS TUYAS: agregá una entrada al final de `raw` (o reemplazá una).
//   kind    'libro' | 'album' | 'video' | 'pelicula' | 'playlist' | 'galeria'
//   author  autor / artista / canal
//   title   título
//   year    año (texto)
//   url     link para "Abrir recurso" (YouTube, Spotify, Goodreads, etc.)
//   desc    (opcional) descripción breve, una o dos frases: qué es el ítem. Si existe, el clic abre una hoja con la ficha y el botón
//           "Abrir recurso"; si falta, el clic va directo al link. Solo hechos del ítem (sale de la ficha del libro, del canal, etc.).
//   cover   (opcional) '/images/library/<archivo>.webp'. Si falta, se genera una carta con el tipo y el título.
// Las entradas con placeholder: true muestran la etiqueta EJEMPLO en pantalla y un texto de prueba en la ficha.

export const kinds = {
    libro: { label: 'Libros', singular: 'Libro', accent: '#e6c229' },
    album: { label: 'Álbumes', singular: 'Álbum', accent: '#ff4d8d' },
    video: { label: 'Videos', singular: 'Video', accent: '#3d7bff' },
    pelicula: { label: 'Películas y documentales', singular: 'Película', accent: '#ff6b3d' },
    playlist: { label: 'Playlists', singular: 'Playlist', accent: '#2fd68f' },
    galeria: { label: 'Galerías', singular: 'Galería', accent: '#b07cff' },
};

const raw = [
    { kind: 'video', author: 'saving connie', title: 'Saving Connie', year: '', url: 'https://www.youtube.com/@savingconnie', cover: '/images/library/01.webp', desc: 'Canal de YouTube de Saving Connie, productor. Sube remixes y tapes en formato CONNIE TV, con visuales.' },
    { kind: 'video', author: 'saving connie', title: "Frank Ocean but it's House Music", year: '2026', url: 'https://youtu.be/YMXdOMhxoqA', cover: '/images/library/02.webp', desc: 'Episodio 42 de CONNIE TV. Saving Connie remezcla en house temas de Blonde, de Frank Ocean. Dirigido y editado por Jett Dumont.' },
    { kind: 'video', author: 'saving connie', title: 'CONNIE TV, episodio 13', year: '2023', url: 'https://youtu.be/5dd-njubIsY', cover: '/images/library/03.webp', desc: 'Episodio 13 de CONNIE TV: tape lofi con visuales. Mezcla temas de Kendrick Lamar y Baby Keem, Jack Harlow y Kodak Black, entre otros.' },
    { kind: 'video', author: 'Jesse Nyberg', title: 'Jesse Nyberg', year: '', url: 'https://www.youtube.com/@JesseNyberg', cover: '/images/library/04.webp', desc: 'Canal de Jesse Nyberg, diseñador gráfico freelance de Los Ángeles. Enseña y charla sobre diseño gráfico y trabajo freelance.' },
    { kind: 'video', author: 'Jesse Nyberg', title: 'How to actually become a graphic designer', year: '2023', url: 'https://www.youtube.com/watch?v=UPJht-QBQ_0', cover: '/images/library/05.webp', desc: 'Charla de Jesse Nyberg a estudiantes de último año de diseño gráfico de su universidad, CSU Chico, sobre cómo llegó a ser diseñador.' },
    { kind: 'video', author: 'Jesse Nyberg', title: 'How I improved my design work over the last 10 years', year: '2025', url: 'https://www.youtube.com/watch?v=bZ8a4LEKFaw', cover: '/images/library/06.webp', desc: 'Jesse Nyberg repasa su diseño favorito de cada año, desde su primer trabajo para un cliente en 2013 hasta una pieza de 2025.' },
    { kind: 'video', author: 'HÖR Berlin', title: 'Live From Earth Klub, horsegiirL', year: '2022', url: 'https://www.youtube.com/live/ngCR1aZZo_A', cover: '/images/library/07.webp', desc: 'Set en vivo de horsegiirL para HÖR Berlin, transmitido el 14 de abril de 2022.' },
    { kind: 'galeria', author: "Boys Don't Cry: Digital Gallery", title: 'Google Fotos', year: '', url: 'https://photos.google.com/share/AF1QipPZZ_SkigAN87J2DwPb0zaRUvSjsAKwhSDC77T3wsHhqiO_a8N8LPAMbGzEcKLE4g?key=TlpXaENyemtmY2llTzFkcVd2cUMyZGJ0dm9kVVhn', cover: '/images/library/08.webp', desc: "Álbum compartido de Google Fotos con la galería digital de Boys Don't Cry." },
    { kind: 'libro', author: 'Rick Rubin', title: 'The Creative Act: A Way of Being', year: '2023', url: 'https://openlibrary.org/books/OL46638712M/The_Creative_Act_A_Way_of_Being', cover: '/images/library/09.webp', desc: 'Libro de Rick Rubin sobre el trabajo creativo como una forma de vivir. 432 páginas.' },
    { kind: 'libro', author: 'Austin Kleon', title: 'Steal Like an Artist', year: '2012', url: 'https://openlibrary.org/books/OL28363066M/Steal_Like_An_Artist', cover: '/images/library/10.webp', desc: 'Libro corto de Austin Kleon con diez ideas sobre influencias y creatividad.' },
    { kind: 'video', author: 'Converse', title: 'All Star Series: Tyler Talk, Paris', year: '2022', url: 'https://youtu.be/Z90f1-zWg0c', cover: '/images/library/11.webp', desc: 'Charla de Converse en París con Tyler, the Creator, dentro del All Star Series de 2022. Conversa con Bimma Williams y jóvenes creativos de la comunidad All Star.' },
    { kind: 'video', author: 'Art Support', title: 'Pharrell, Advice on How To Be Creative', year: '2022', url: 'https://youtu.be/ONQk1jzcxWI', cover: '/images/library/12.webp', desc: 'Video de Art Support con Pharrell Williams hablando de cómo ser creativo, ser uno mismo y manejar el fracaso.' },
    { kind: 'album', author: 'Frank Ocean', title: 'Blonde', year: '2016', url: 'https://open.spotify.com/intl-es/album/3mH6qwIy9crq0I9YQbOuDf', cover: '/images/library/13.webp', desc: 'Segundo disco de estudio de Frank Ocean. Saving Connie lo remezcla en house en la entrada 02.' },
    { kind: 'album', author: 'Daft Punk', title: 'Random Access Memories', year: '2013', url: 'https://open.spotify.com/intl-es/album/4m2880jivSbbyEGAKfITCa', cover: '/images/library/14.webp', desc: 'Último disco de estudio de Daft Punk. Lo grabaron con músicos de estudio y colaboraciones de Nile Rodgers, Giorgio Moroder y Pharrell, entre otros.' },
    { kind: 'album', author: 'Aphex Twin', title: 'Selected Ambient Works 85-92', year: '1992', url: 'https://open.spotify.com/intl-es/album/7aNclGRxTysfh6z0d8671k', cover: '/images/library/15.webp', desc: 'El primer disco de Aphex Twin. Ambient techno con piezas compuestas entre 1985 y 1992.' },
    { kind: 'album', author: 'Paul McCartney', title: 'RAM', year: '1971', url: 'https://open.spotify.com/intl-es/album/4ZLVPyXVXeMbnxyhxvsF7m', cover: '/images/library/16.webp', desc: 'Segundo disco solista de Paul McCartney, grabado junto a Linda McCartney.' },
    { kind: 'album', author: 'The Strokes', title: 'The New Abnormal', year: '2020', url: 'https://open.spotify.com/intl-es/album/2xkZV2Hl1Omi8rk2D7t5lN', cover: '/images/library/17.webp', desc: 'Sexto disco de The Strokes, producido por Rick Rubin.' },
    { kind: 'album', author: 'Tyler, The Creator', title: 'IGOR', year: '2019', url: 'https://open.spotify.com/intl-es/album/5zi7WsKlIiUXv09tbGLKsE', cover: '/images/library/18.webp', desc: 'Disco de Tyler, the Creator. Lo escribió, arregló y produjo él solo.' },
];

export const library = raw.map((e, i) => ({
    ...e,
    index: String(i + 1).padStart(2, '0'),
    slug: `${e.kind}-${i + 1}`,
    accent: kinds[e.kind].accent,
}));
