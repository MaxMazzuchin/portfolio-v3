// Proyectos que NO vienen del V2. Se editan a mano (o los agrega `node scripts/add-project.mjs`).
// Mismo formato que projects.js. Van después de los del V2 y el número (index) se calcula solo.
//
// sections: [{ kind: 'column' | 'grid', images: [{src,w,h}] } | { kind: 'videos', videos: [src] }]
//
// Plantilla:
// {
//     slug: 'mi-proyecto',
//     title: 'MI PROYECTO',
//     type: 'Identidad visual / Dirección de arte',
//     description: 'Una o dos frases: qué es y cuál fue el enfoque.',
//     cover: { src: '/images/projects/mi-proyecto/cover.webp', w: 1080, h: 1350 },
//     sections: [
//         { kind: 'column', images: [{ src: '/images/projects/mi-proyecto/image-1.webp', w: 1080, h: 1350 }] },
//     ],
// },
// Después: caso de estudio en cases.js (misma clave = slug) y color en accents.js.
export const extras = [];
