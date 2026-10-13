# portfolio-v3

Portfolio de Máximo Mazzuchin (diseñador gráfico, Córdoba, Argentina). Sitio estático con Vite + JS vanilla + Three.js.

## Empezar (desde cualquier computadora)

```bash
git clone https://github.com/<tu-usuario>/portfolio-v3.git
cd portfolio-v3
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/
```

Requiere Node 20+. No hay variables de entorno ni backend.

## Páginas

| Archivo | Ruta | Qué es |
|---|---|---|
| `index.html` | `/` | Home estático (estilo CRL "Index") |
| `trabajo.html` | `/trabajo.html` | Proyectos: vista **Rueda** o **Lista** |
| `biblioteca.html` | `/biblioteca.html` | Gustos (libros, música, videos…): misma vista Rueda/Lista + filtros |
| `sobre-mi.html` | `/sobre-mi.html` | Sobre mí |
| `proyecto.html` | `/proyecto.html?p=<slug>` | Proyecto individual: columna fija a la izquierda (~30%, con la barra dither como progreso de scroll y anterior/siguiente) y galería propia a la derecha |
| `404.html` | cualquier ruta inexistente | Página de error (Netlify la sirve sola) |

`head`, `header` y `footer` están en `src/partials/` y se inyectan en todas las páginas con un plugin de Vite (`vite.config.js`). Para cambiar el menú se edita un solo archivo.

## Cómo editar el contenido

- **Biblioteca (gustos):** `src/data/library.js`. Reemplazá las entradas `placeholder: true` por las tuyas. Portadas opcionales en `public/images/library/<archivo>.webp`; sin portada se genera una carta automática.
- **Proyectos:** `src/data/projects.js` es **generado**. Se regenera desde el portfolio anterior (V2, repo `MaxMazzuchin/portfolio-web`) con:
  ```bash
  node scripts/gen-data.mjs <ruta/a/portfolio-web>
  ```
  Las imágenes viven en `public/images/projects/<slug>/` (`cover.webp`, `image-N.webp` para columna única, `grid-N.webp` para grilla de 2 columnas) y los videos en `public/videos/`.
- **Colores de acento por proyecto:** `src/data/accents.js`.
- **Textos del home / sobre mí:** directamente en `index.html` y `sobre-mi.html`.

## Estructura de `src/`

```
main.js              arranque: scroll → WebGL → tema → cursor → menú → router
core/                router (transiciones), scroll (Lenis), tema, cursor dither, visor de imágenes (lightbox), dbar
gl/                  Three.js: renderer, texto dithered, imágenes, rueda de cartas, cortina de transición
gl/shaders/          GLSL (dither Bayer 8x8, texto, imagen, transición)
views/               una vista por página (home, collection = trabajos+biblioteca, about, project)
data/                projects.js (generado), library.js, accents.js
styles/              tokens.css (colores, tipografías), base.css
partials/            head / header / footer compartidos
```

## Decisiones de diseño (resumen)

- Oscuro por defecto con fondo `#000` puro; hay toggle claro/oscuro (se guarda en `localStorage`).
- Tipografías: Inter Tight (títulos, tipo Helvetica Bold), Roboto Mono (texto y labels, varios pesos y cursivas), Space Mono (números). Para cambiarlas: `--font` / `--font-text` en `tokens.css`, el `<link>` de `partials/head.html` y las fuentes escritas en `core/cards.js`.
- El dither queda **solo** en: transiciones entre páginas, el título `(MZZ.DSG)` del home, el fondo animado del home y detalles chicos (cursor, barras finas animadas).
- SEO / compartir: `vite.config.js` agrega og/twitter/canonical y genera `sitemap.xml` y `robots.txt`. Define la URL del sitio con la variable `SITE_URL` (en Netlify ya existe `URL`). La imagen para compartir es `public/og.png`.
- Respeta `prefers-reduced-motion` y funciona sin WebGL (texto e imágenes quedan como HTML normal).

## Deploy

Netlify (`netlify.toml`): `npm run build`, publica `dist/`.
