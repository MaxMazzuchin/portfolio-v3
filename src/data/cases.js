// Datos de cada proyecto (clave = slug). SE EDITA A MANO.
//
// context   qué es el proyecto y qué hice (breve). Sale arriba a la izquierda, debajo del título.
// result    cómo quedó, en general. Sale justo después de la portada.
// year, client, role, tools   van a la ficha. Lo que diga [CONFIRMAR] o esté vacío NO se muestra.
//
// Borrador escrito a partir de las descripciones del V2 y de personalidad.md. Corregilo con tus palabras.
const C = '[CONFIRMAR]';

export const cases = {
    'album-artwork': {
        year: C, client: C, role: 'Dirección de arte, diseño', tools: [C],
        context: 'Recopilación de portadas de discos que hice para artistas de música. Cada una la resolví desde la tipografía, con mucho contraste y sin ilustrar la música de forma literal.',
        result: 'Portadas que se reconocen rápido en una pantalla chica y que también funcionan impresas en gran formato.',
    },

    'pone-atencion': {
        year: C, client: 'Sin Datos', role: 'Dirección de arte, diseño', tools: [C],
        context: 'Arte y sistema visual para el segundo álbum de Sin Datos. Trabajé con técnicas mixtas: trazos hechos a mano y elementos orgánicos dentro de la composición.',
        result: 'Una portada con textura propia, lejos de lo rígido del diseño digital, y un sistema que se extiende al resto del lanzamiento.',
    },

    'sin-datos': {
        year: C, client: 'Sin Datos', role: 'Diseño gráfico', tools: [C],
        context: 'Piezas para la comunicación de Sin Datos, una banda de rock emergente de Argentina: flyers para los shows y contenido para redes.',
        result: 'Flyers y posteos que se ven como parte de la misma banda, show tras show.',
    },

    'i-life': {
        year: C, client: 'I-Life', role: 'Diseño de estampas, dirección de arte', tools: [C],
        context: 'Once11 es una cápsula de estampas para I-Life, una marca de ropa deportiva con más de diez años en el mercado. Hice las gráficas y la dirección de arte, con referencias urbanas del barrio de Once.',
        result: 'Una cápsula de estética streetwear que actualiza la imagen de la marca para un público más joven, sin dejar de lado su origen.',
    },

    outframe: {
        year: C, client: 'Estudiante universitaria (España)', role: 'Diseño, maquetación', tools: [C],
        context: 'Publicación sobre el fotógrafo Chema Madoz, hecha para una estudiante universitaria de España. Definí la identidad visual (tipografías y paleta) y la maquetación completa.',
        result: 'Una publicación con jerarquías claras y una estética cuidada de principio a fin.',
    },

    'exp-grafica': {
        year: C, client: 'Personal', role: 'Diseño', tools: [C],
        context: 'Serie personal en curso. Cada pieza es una excusa para probar formas, tipografías y composiciones nuevas.',
        result: 'Un archivo abierto de experimentos, con una base técnica que mantiene todo legible.',
    },

    '100-posters': {
        year: C, client: 'Personal', role: 'Diseño', tools: [C],
        context: '100 pósters distintos diseñados en 24 horas. Lo difícil era no repetirme, así que trabajé con sistemas de diseño ágiles y decisiones tipográficas rápidas.',
        result: 'Cien piezas, ninguna igual a la otra, hechas en un día.',
    },

    d2x: {
        year: C, client: 'D2X', role: 'Diseño, maquetación', tools: [C],
        context: 'Publicación sobre D2X, artista emergente de Chicago, a partir de una entrevista exclusiva. Armé la estructura y el diseño completo de la pieza.',
        result: 'Una pieza que refleja el discurso y la identidad del artista.',
    },

    nyro: {
        year: C, client: 'Nyro', role: 'Dirección de arte, identidad de marca', tools: [C],
        context: 'Identidad de marca para Nyro, una empresa de analytics que ayuda a tomar decisiones con datos. Le di forma visual al concepto del equipo y evité los clichés del rubro.',
        result: 'Una identidad que se distingue de la competencia y comunica lo que el equipo quería decir.',
    },

    touchdesigner: {
        year: C, client: 'Personal', role: 'Motion design', tools: ['TouchDesigner'],
        context: 'Piezas generativas y en vivo hechas en TouchDesigner: loops, sistemas reactivos y salidas para pantalla.',
        result: 'Motion claro, con ritmo y sin adornos de más.',
    },
};
