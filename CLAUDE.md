# CLAUDE.md — contexto del proyecto

Portfolio personal de Máximo (diseñador gráfico). Vite + JS vanilla + Three.js. Ver `README.md` para estructura y comandos.
El usuario habla español rioplatense: responder en español.

## Qué se construyó y por qué

- Referencias: **CRL** (crl-2026.webflow.io) para estructura (home estático "Index", biblioteca con Rueda/Lista, About), **Doron Supply** (doronsupply.com) para la estética (negro, tipografía TASA Orbiter) y **dither** como lenguaje visual.
- El **portfolio anterior (V2)**, repo `MaxMazzuchin/portfolio-web`, se usa SOLO como fuente de imágenes, textos y del layout de galería por proyecto. El diseño del V3 debe diferenciarse del V2 (por eso no hay títulos con paréntesis tipo `(PROYECTO)` salvo `(MZZ.DSG)`, que el usuario pidió explícitamente en el home).
- Lo que el usuario dijo que le gusta y NO hay que romper: las **transiciones de dither entre páginas**, los movimientos y la rueda de cartas.

## Reglas de diseño acordadas

1. Dither **solo** en: transiciones (cortina GL), título del home, el **fondo animado del home** (pedido explícito del usuario, `ditherField` en `core/dither.js`, suave y reacciona al cursor) y detalles chicos (cursor, barras `data-dbar`, que se animan). No poner dither en fondos de otras páginas ni en títulos de páginas.
2. Fondo negro `#000` al 100% en oscuro. Modo claro disponible con toggle.
3. Tipografía (en prueba, se cambia solo en `tokens.css` + `partials/head.html` + `core/cards.js`): títulos = **Inter Tight** 500–800 (tipo Helvetica Bold, `--font`); texto y labels = **Roboto Mono** 100–700 + cursivas (`--font-text`), jugando con la familia (300 para párrafos, 500 labels, 600–700 subtítulos); números = Space Mono. Los links del menú usan la misma fuente que el logo. Historial: TASA Orbiter + VT323 → Workbench + Courier Prime → actual. Syro (Aphex Twin) y Decima Mono quedaron pendientes: hacen falta los archivos de fuente (licencia).
4. Galería de cada proyecto: **portada → columna única → grilla de 2 columnas**, igual que el V2, usando los conteos del V2 (`verticalImgCount`/`masonryImgCount`), no todos los archivos de la carpeta.
5. Las imágenes NO se agrandan en hover. Click abre el visor (`core/lightbox.js`): ←/→ y zoom en desktop; lista vertical en mobile.
6. En Trabajos/Biblioteca la lista NO muestra la imagen siguiendo al cursor: la portada de la vista Lista va en un slot fijo abajo a la derecha. Se mantienen **Rueda y Lista** en las dos páginas, con Rueda por defecto.
8. Proyecto individual (desktop): columna izquierda fija (sticky, ~30% del ancho) con número, título, descripción y datos; la galería baja a la derecha. En mobile la info va arriba y se va con el scroll (no queda pegada).
7. Acentos de color sutiles y por proyecto (`data/accents.js`): solo en números, contadores, subrayados y barras. El resto monocromático.

## Notas técnicas que ahorran tiempo

- El canvas WebGL (`.gl`) está **debajo** del DOM; el DOM debe ser transparente donde se quiere ver GL. Por eso las letras gigantes de fondo (`.ghost`) se mueven a una capa `.ghost-layer` hija de `<body>` con `z-index:-1` (`main.js`), si no taparían el texto GL.
- Texto/imágenes marcados con `data-gl-text` / `data-gl-img` los dibuja `gl/items.js` siguiendo el rect del DOM cada frame; el DOM queda invisible pero presente (SEO/accesibilidad). `data-gl-text` se usa solo en el hero del home.
- Los textos GL necesitan la fuente cargada antes de pintar: `gl.build()` espera `document.fonts.load()`.
- `src/data/projects.js` es generado: no editar a mano. Las vistas usan `src/data/work.js` (V2 + `extra-projects.js` + `cases.js`). Contexto y resultado de cada proyecto están en `cases.js` (breves, en la voz de Max: sin tono de IA, sin rayas largas, sin tríadas ni "no es solo X"); son borrador a partir de las descripciones del V2. Lo que diga `[CONFIRMAR]` no se muestra. Proyectos nuevos: `scripts/add-project.mjs` (imágenes, también `--append`) y `scripts/add-video.mjs` (videos). El orden está en `ORDER` de `work.js`; `touchdesigner` del V2 se reemplazó por `animacion` (HIDDEN en `work.js` y SKIP en `gen-data.mjs`). Los originales pesados van a `originales/` (gitignored).
- **Contigiani Briñón** (`src/brand/`): su página NO usa las láminas del manual, la galería se arma en código (`views/project.js` carga `brand/contigiani.js` bajo demanda; mapa `manuals`). `cb-logo.js` tiene los trazados reales del logo (SVG original del cliente), `cb-build.js` las timelines GSAP (construcción con guías, trazo → relleno → rótulo letra por letra) y `contigiani.css` el layout (1u = 1px de una lámina de 2000px; en mobile se reordena). Ojo: GSAP redondea `stroke-dashoffset` a enteros, por eso los trazos usan `pathLength="100"`. Solo las fotos de propiedades son imagen (`images/projects/contigiani-brinon/fotos/`, recortadas con `scripts/cb-photos.mjs`). En dev, `?cbt=2.1` deja la construcción del logo congelada en ese segundo.
- En dev, `window.__gl` expone el objeto GL para depurar desde la consola.
- Probar siempre mobile (390×844): las letras gigantes y los `white-space:nowrap` pueden ensanchar el viewport.
- Windows/PowerShell 5.1: `Set-Content -Encoding utf8` agrega BOM y un BOM dentro de `partials/head.html` rompe el `<head>`. Editar con las herramientas Edit/Write o escribir con `[IO.File]::WriteAllText(path, text, (New-Object Text.UTF8Encoding $false))`. Además `R`, `Rp` etc. son alias de PowerShell: no usarlos de nombre de función.
- SEO: `vite.config.js` inyecta og/twitter/canonical y genera `sitemap.xml`/`robots.txt` usando la URL del sitio (`URL` de Netlify o `SITE_URL`). `public/og.png` es la imagen para compartir.
- Para capturas rápidas sin navegador conectado: `chrome.exe --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --window-size=1440,900 --virtual-time-budget=20000 --screenshot=...` contra `npm run dev`.

## Flujo de trabajo

- Después de cada tanda de cambios: `npm run build` debe pasar, hacer commit y `git push` (el repo es privado: `portfolio-v3`).
- Los mensajes de commit terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Ojo: desde la sesión de Claude Code no hay credenciales de GitHub ni `gh`; el `git push` lo hace el usuario (o configura un token).
