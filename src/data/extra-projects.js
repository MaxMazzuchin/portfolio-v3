// Proyectos que NO vienen del V2. Se editan a mano (o los agrega `node scripts/add-project.mjs`).
// Mismo formato que projects.js. Van después de los del V2 y el número (index) se calcula solo.
//
// sections: [{ kind: 'column' | 'grid', images: [{src,w,h}] } | { kind: 'videos', videos: [{src,w,h} | src] }]
// En los videos, w/h permiten reservar la proporción real (vertical u horizontal); sin ellos se asume 16:9.
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
export const extras = [
    {
        "slug": "curu",
        "title": "CURU",
        "type": "Arte de tapa / Motion",
        "description": "[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.",
        "cover": {
            "src": "/images/projects/curu/cover.webp",
            "w": 1600,
            "h": 1600
        },
        "sections": [
            {
                "kind": "videos",
                "videos": [
                    {
                        "src": "/videos/curu/video-1.mp4",
                        "w": 1080,
                        "h": 1920
                    }
                ]
            }
        ]
    },
    {
        "slug": "taylor-swift",
        "title": "TAYLOR SWIFT",
        "type": "Video / Motion",
        "description": "[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.",
        "cover": {
            "src": "/images/projects/taylor-swift/cover.webp",
            "w": 1280,
            "h": 720
        },
        "sections": [
            {
                "kind": "videos",
                "videos": [
                    {
                        "src": "/videos/taylor-swift/video-1.mp4",
                        "w": 1280,
                        "h": 720
                    },
                    {
                        "src": "/videos/taylor-swift/video-2.mp4",
                        "w": 1280,
                        "h": 720
                    },
                    {
                        "src": "/videos/taylor-swift/video-3.mp4",
                        "w": 1280,
                        "h": 720
                    },
                    {
                        "src": "/videos/taylor-swift/video-4.mp4",
                        "w": 1080,
                        "h": 1920
                    }
                ]
            }
        ]
    },
    {
        "slug": "animacion",
        "title": "ANIMACIÓN / VIDEO",
        "type": "Motion / Video",
        "description": "[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.",
        "cover": {
            "src": "/images/projects/animacion/cover.webp",
            "w": 627,
            "h": 627
        },
        "sections": [
            {
                "kind": "videos",
                "videos": [
                    {
                        "src": "/videos/animacion/video-1.mp4",
                        "w": 3840,
                        "h": 2160
                    },
                    {
                        "src": "/videos/animacion/video-2.mp4",
                        "w": 1280,
                        "h": 720
                    },
                    {
                        "src": "/videos/animacion/video-3.mp4",
                        "w": 960,
                        "h": 720
                    },
                    {
                        "src": "/videos/animacion/video-4.mp4",
                        "w": 1920,
                        "h": 1080
                    },
                    {
                        "src": "/videos/animacion/video-5.mp4",
                        "w": 960,
                        "h": 720
                    },
                    {
                        "src": "/videos/animacion/video-6.mp4",
                        "w": 1280,
                        "h": 1280
                    },
                    {
                        "src": "/videos/animacion/video-7.mp4",
                        "w": 1280,
                        "h": 1280
                    },
                    {
                        "src": "/videos/animacion/video-8.mp4",
                        "w": 1160,
                        "h": 1160
                    },
                    {
                        "src": "/videos/animacion/video-9.mp4",
                        "w": 1080,
                        "h": 1440
                    }
                ]
            }
        ]
    },
    {
        "slug": "gracias",
        "title": "GRACIAS",
        "type": "Exploración visual / Personal",
        "description": "[CONFIRMAR] Una o dos frases: qué es el proyecto y cuál fue el enfoque.",
        "cover": {
            "src": "/images/projects/gracias/cover.webp",
            "w": 1080,
            "h": 1440
        },
        "sections": [
            {
                "kind": "grid",
                "images": [
                    {
                        "src": "/images/projects/gracias/grid-1.webp",
                        "w": 1080,
                        "h": 1440
                    },
                    {
                        "src": "/images/projects/gracias/grid-2.webp",
                        "w": 1080,
                        "h": 1440
                    },
                    {
                        "src": "/images/projects/gracias/grid-3.webp",
                        "w": 1080,
                        "h": 1440
                    },
                    {
                        "src": "/images/projects/gracias/grid-4.webp",
                        "w": 1080,
                        "h": 1440
                    }
                ]
            }
        ]
    }
];

// Piezas que se suman a la grilla de un proyecto que viene del V2 (clave = slug).
export const additions = {
    "exp-grafica": [
        {
            "src": "/images/projects/exp-grafica/grid-44.webp",
            "w": 1080,
            "h": 1440
        },
        {
            "src": "/images/projects/exp-grafica/grid-45.webp",
            "w": 1080,
            "h": 1440
        },
        {
            "src": "/images/projects/exp-grafica/grid-46.webp",
            "w": 1080,
            "h": 1440
        },
        {
            "src": "/images/projects/exp-grafica/grid-47.webp",
            "w": 1080,
            "h": 1440
        },
        {
            "src": "/images/projects/exp-grafica/grid-48.webp",
            "w": 1600,
            "h": 2133
        },
        {
            "src": "/images/projects/exp-grafica/grid-49.webp",
            "w": 1600,
            "h": 2263
        }
    ]
};
