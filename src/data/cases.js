// Caso de estudio de cada proyecto (clave = slug). SE EDITA A MANO.
//
// BORRADOR: los textos salen de las descripciones del V2; revisalos y corregilos con tus palabras.
// Todo lo que diga [CONFIRMAR] (o quede vacío) NO se muestra en el sitio hasta que lo completes.
//
// year      año (string)            client  cliente / para quién
// role      tu rol                  tools   herramientas (array de strings)
// context   de dónde sale el trabajo     challenge   qué había que resolver
// process   pasos: { title, text, after }  → "after" = cuántas imágenes de la galería se ven antes del paso
// result    cómo terminó
const C = '[CONFIRMAR]';

export const cases = {
    'album-artwork': {
        year: C, client: C, role: 'Dirección de arte, diseño', tools: [C],
        context: 'Una recopilación de arte de tapa hecho para distintos artistas. Cada tapa es una pieza chica que tiene que decir mucho en poco espacio.',
        challenge: 'Construir una narrativa visual sin caer en la representación literal de la música, y que la tapa aguante igual en una pantalla de celular que impresa en gran formato.',
        process: [
            { title: 'Enfoque tipográfico', text: 'En vez de ilustrar, apoyé cada tapa en la tipografía: la letra como imagen principal y el texto como forma, no solo como información.', after: 2 },
            { title: 'Alto contraste', text: 'Trabajé con contrastes fuertes de escala, color y peso para que la pieza se lea de lejos y se reconozca en un feed lleno de imágenes.', after: 6 },
        ],
        result: 'Un conjunto de tapas con voz propia, que funcionan en digital y en formato físico grande sin perder fuerza.',
    },

    'pone-atencion': {
        year: C, client: 'Sin Datos', role: 'Dirección de arte, diseño', tools: [C],
        context: 'Arte y sistema visual para el segundo álbum de Sin Datos, banda de rock argentina.',
        challenge: 'Darle al disco una identidad propia, distinta a lo prolijo y rígido de lo digital, y que el mismo lenguaje se pudiera extender a todo el lanzamiento.',
        process: [
            { title: 'Concepto analógico', text: 'Partí de lo analógico como idea central: lo hecho a mano, con imperfecciones, frente a la rigidez de la pantalla.', after: 1 },
            { title: 'Mixed media', text: 'Armé las composiciones con trazos manuales y elementos orgánicos integrados directamente en la imagen, mezclando técnicas en lugar de resolver todo en digital.', after: 3 },
        ],
        result: 'Un arte con carácter propio que rompe la frialdad digital y le da al lanzamiento una identidad reconocible.',
    },

    'sin-datos': {
        year: C, client: 'Sin Datos', role: 'Diseño gráfico, comunicación digital', tools: [C],
        context: 'Sin Datos es una banda de rock emergente argentina que necesitaba comunicar shows y novedades de forma constante.',
        challenge: 'Producir piezas seguido, para flyers y redes, sin que cada una se viera como un archivo suelto: tenían que sentirse parte de la misma banda.',
        process: [
            { title: 'Flyers de shows', text: 'Diseñé flyers promocionales para cada fecha, cuidando que la información clave se leyera rápido.', after: 4 },
            { title: 'Contenido para redes', text: 'Armé las piezas para redes sociales sobre la misma base visual, para que el perfil se vea como un conjunto.', after: 9 },
        ],
        result: 'Una comunicación digital coherente a lo largo de los shows y los lanzamientos de la banda.',
    },

    'i-life': {
        year: C, client: 'I-Life', role: 'Diseño de estampas, dirección de arte', tools: [C],
        context: 'Once11 es una cápsula de estampas y gráficas para I-Life, una marca de ropa deportiva con más de 10 años en el mercado.',
        challenge: 'Modernizar la imagen de la marca para conectar con un público más joven, sin abandonar los valores con los que nació.',
        process: [
            { title: 'Referencias del barrio', text: 'Tomé como punto de partida el barrio de Once y su estética urbana para darle un origen real a las gráficas.', after: 2 },
            { title: 'Streetwear', text: 'Llevé esas referencias a un lenguaje streetwear, pensado para estampas que funcionen sobre la prenda.', after: 7 },
        ],
        result: 'Una cápsula que actualiza la imagen de I-Life y se acerca a un público más joven manteniendo su identidad.',
    },

    outframe: {
        year: C, client: 'Estudiante universitaria (España)', role: 'Diseño editorial', tools: [C],
        context: 'Proyecto editorial sobre el fotógrafo Chema Madoz, realizado para una estudiante universitaria en España.',
        challenge: 'Hacer una publicación con identidad completa, con una estructura clara que acompañe las imágenes sin competir con ellas.',
        process: [
            { title: 'Identidad visual', text: 'Definí las tipografías y la paleta de la publicación antes de maquetar.', after: 1 },
            { title: 'Maquetación', text: 'Armé la estructura editorial con jerarquías claras para guiar la lectura página a página.', after: 4 },
        ],
        result: 'Una publicación con jerarquías claras y un nivel estético profesional.',
    },

    'exp-grafica': {
        year: C, client: 'Personal', role: 'Diseño, exploración visual', tools: [C],
        context: 'Un laboratorio visual en curso: no hay un encargo, la serie crece a medida que aparecen ideas.',
        challenge: 'Expandir el vocabulario gráfico más allá de las soluciones predecibles sin perder claridad.',
        process: [
            { title: 'Cada pieza, una excusa', text: 'Cada pieza parte de algo puntual para probar: una forma, una textura, una tipografía, una manera de componer.', after: 4 },
            { title: 'Base técnica', text: 'Lo disruptivo se apoya en una base técnica sólida, para que lo experimental no se pierda en el ruido.', after: 14 },
        ],
        result: 'Una serie abierta que funciona como archivo de pruebas y alimenta el resto de los trabajos.',
    },

    '100-posters': {
        year: C, client: 'Personal', role: 'Diseño', tools: [C],
        context: 'Un ejercicio de resistencia creativa: 100 piezas únicas diseñadas en 24 horas.',
        challenge: 'No solo el volumen: lo difícil era no repetirse, sin sacrificar impacto visual.',
        process: [
            { title: 'Sistemas ágiles', text: 'Armé sistemas de diseño rápidos que me dejaran producir sin arrancar de cero cada vez.', after: 6 },
            { title: 'Decisiones tipográficas veloces', text: 'Resolví la tipografía con decisiones rápidas y claras, y usé la variación entre piezas para evitar repetirme.', after: 30 },
        ],
        result: '100 posters únicos hechos en un día, que muestran qué tan lejos se puede llevar un sistema bien pensado.',
    },

    d2x: {
        year: C, client: 'D2X', role: 'Diseño editorial', tools: [C],
        context: 'Publicación editorial para D2X, artista emergente de Chicago, construida a partir de una entrevista exclusiva.',
        challenge: 'Estructurar y diseñar la pieza completa de modo que reflejara su discurso y su identidad.',
        process: [
            { title: 'Estructura', text: 'Ordené la entrevista en una estructura editorial que respeta el ritmo de lo que dice.', after: 0 },
        ],
        result: 'Una publicación coherente y de carácter documental.',
    },

    nyro: {
        year: C, client: 'Nyro', role: 'Dirección de arte, identidad de marca', tools: [C],
        context: 'Nyro es una empresa de analytics orientada a la toma de decisiones basada en datos.',
        challenge: 'Darle forma visual al concepto del equipo sin caer en los clichés visuales de la competencia.',
        process: [
            { title: 'Concepto del equipo', text: 'Partí de la idea que ya tenía el equipo y la traduje a un lenguaje visual propio.', after: 1 },
            { title: 'Alejarse del cliché', text: 'Evité los recursos típicos del sector para que la marca se distinga de la competencia.', after: 4 },
        ],
        result: 'Una identidad de marca para Nyro que se aleja de lo esperable en analytics.',
    },

    touchdesigner: {
        year: C, client: 'Personal', role: 'Motion design', tools: ['TouchDesigner'],
        context: 'Piezas generativas y en vivo hechas en TouchDesigner: loops, sistemas reactivos y salidas para pantalla.',
        challenge: 'Lograr un motion claro, con ritmo, sin adornos de más.',
        process: [
            { title: 'Sistemas generativos', text: 'Construyo cada pieza como un sistema (loops y reactivos) y no como una animación cerrada.', after: 2 },
        ],
        result: 'Un conjunto de piezas de estética directa, listas para pantalla.',
    },
};
