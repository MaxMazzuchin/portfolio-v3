import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = import.meta.dirname;

/** URL pública del sitio: la pone Netlify (URL) o se define a mano con SITE_URL. Sin URL no se generan tags absolutos. */
const SITE = (process.env.SITE_URL || process.env.URL || '').replace(/\/+$/, '');
const NAME = 'Máximo Mazzuchin';

/** Inyecta src/partials/<name>.html donde las páginas ponen <!--shell:<name>-->, así head/header/footer viven en un solo lugar. */
function shellPartials() {
    return {
        name: 'shell-partials',
        transformIndexHtml: {
            order: 'pre',
            handler: (html) => html.replace(/<!--shell:(\w+)-->/g, (_, name) => readFileSync(resolve(root, `src/partials/${name}.html`), 'utf8')),
        },
    };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Rutas públicas de cada página (el home es "/"). */
const routeOf = (file) => (file === 'index.html' ? '/' : `/${file}`);

/** og / twitter / canonical por página, a partir de su <title> y <meta description>; sitemap.xml y robots.txt al compilar. */
function seo() {
    return {
        name: 'seo',
        transformIndexHtml: {
            order: 'post',
            handler(html, ctx) {
                const file = (ctx.path || '/index.html').replace(/^\//, '') || 'index.html';
                const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || NAME;
                const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
                const url = SITE ? SITE + routeOf(file) : '';
                const image = `${SITE}/og.png`;
                const tags = [
                    '<meta name="theme-color" content="#000000">',
                    `<meta property="og:type" content="website">`,
                    `<meta property="og:site_name" content="${NAME}">`,
                    `<meta property="og:locale" content="es_AR">`,
                    `<meta property="og:title" content="${esc(title)}">`,
                    `<meta property="og:description" content="${desc}">`,
                    `<meta property="og:image" content="${image}">`,
                    '<meta property="og:image:width" content="1200">',
                    '<meta property="og:image:height" content="630">',
                    '<meta name="twitter:card" content="summary_large_image">',
                    `<meta name="twitter:title" content="${esc(title)}">`,
                    `<meta name="twitter:description" content="${desc}">`,
                    `<meta name="twitter:image" content="${image}">`,
                ];
                // proyecto.html sirve todos los proyectos con ?p=: un canonical fijo los colapsaría en una sola URL.
                if (url && !['404.html', 'proyecto.html'].includes(file)) tags.push(`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`);
                if (file === '404.html') tags.push('<meta name="robots" content="noindex">');
                if (file === 'index.html') {
                    const person = {
                        '@context': 'https://schema.org', '@type': 'Person', name: NAME, jobTitle: 'Diseñador gráfico',
                        description: desc, sameAs: ['https://instagram.com/mzz.dsg'],
                        address: { '@type': 'PostalAddress', addressLocality: 'Córdoba', addressCountry: 'AR' },
                        ...(SITE && { url: SITE }),
                    };
                    tags.push(`<script type="application/ld+json">${JSON.stringify(person)}</script>`);
                }
                return html.replace('</head>', `    ${tags.join('\n    ')}\n</head>`);
            },
        },
        async generateBundle() {
            if (!SITE) return; // sin URL absoluta un sitemap no sirve
            const { projects } = await import(pathToFileURL(resolve(root, 'src/data/work.js')).href);
            const urls = [
                ...['index.html', 'trabajo.html', 'biblioteca.html', 'sobre-mi.html'].map(routeOf),
                ...projects.map((p) => `/proyecto.html?p=${p.slug}`),
            ];
            const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(SITE + u)}</loc></url>`).join('\n')}\n</urlset>\n`;
            this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
            this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` });
        },
    };
}

export default defineConfig({
    plugins: [shellPartials(), seo()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                trabajo: resolve(root, 'trabajo.html'),
                biblioteca: resolve(root, 'biblioteca.html'),
                sobremi: resolve(root, 'sobre-mi.html'),
                proyecto: resolve(root, 'proyecto.html'),
                notfound: resolve(root, '404.html'),
            },
            output: {
                // Three.js y GSAP/Lenis en chunks aparte: cachean entre deploys y bajan en paralelo con el código propio.
                manualChunks(id) {
                    if (id.includes('node_modules/three')) return 'three';
                    if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
                },
            },
        },
    },
});
