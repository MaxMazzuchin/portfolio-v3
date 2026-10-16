import { projects, bySlug, known } from '../data/work.js';
import { accentOf } from '../data/accents.js';
import { openLightbox } from '../core/lightbox.js';
import { setAccent } from '../core/accent.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Proyectos cuya galería es un manual armado en código (HTML/SVG animado) en lugar de imágenes. Se cargan bajo demanda.
const manuals = {
    'contigiani-brinon': { load: () => import('../brand/contigiani.js'), pieces: 9 },
    nyro: { load: () => import('../brand/nyro.js'), pieces: 8 },
};

const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Renders the project named by ?p=<slug>. The gallery follows the V2 structure, per project:
 * cover → single column (column) → two-column grid (grid) → videos, whichever the project has.
 * If the project has a case (data/cases.js): its context is the lead in the side column and its
 * result goes right after the cover.
 */
export function mountProject(view) {
    const slug = new URLSearchParams(location.search).get('p');
    const p = bySlug(slug) || projects[0];
    const c = p.case;
    const at = projects.indexOf(p);
    const next = projects[(at + 1) % projects.length];
    const prev = projects[(at - 1 + projects.length) % projects.length];

    // Every image, in page order: this is what the lightbox walks through.
    const equal = p.layout === 'equal';
    const shots = [];
    let n = 0;
    const fig = (s, cls) => {
        const i = n++;
        // The first piece is the first thing on screen: load it right away; the rest wait until they get close.
        const load = i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
        return `<figure class="${cls}" style="--ar:${s.w}/${s.h}" data-cursor-item data-cursor="Ampliar" data-open="${i}">
            <img data-gl-img src="${s.src}" alt="${esc(p.title)} — ${i + 1}" width="${s.w}" height="${s.h}" ${load} decoding="async">
        </figure>`;
    };

    // A video is a path (V2) or { src, w, h }: with w/h the box keeps the real proportion (vertical or wide).
    // A section with loop: true plays as a silent loop with no controls (short edits, animations).
    const videos = (sec) => `<div class="g-videos">${sec.videos.map((v, i) => {
        const src = typeof v === 'string' ? v : v.src;
        const ar = typeof v === 'string' ? '' : ` style="--ar:${v.w}/${v.h};--r:${(v.w / v.h).toFixed(4)}"`;
        return `<video class="g-video"${ar} data-src="${src}" ${sec.loop ? '' : 'controls '}playsinline loop muted preload="none" aria-label="${esc(p.title)} — video ${i + 1}"></video>`;
    }).join('')}</div>`;

    const manual = manuals[p.slug];
    let cover = '';
    let sections;
    if (manual) {
        // La galería la arma el manual (más abajo, cuando termina de cargar); acá queda el lugar reservado.
        sections = '<div class="cb-slot" data-manual></div>';
    } else if (equal) {
        // No hero: every piece goes in one grid at the same size. The cover only feeds the wheel/list,
        // and joins the grid unless it is already one of its pieces.
        const imgs = p.sections.filter((sec) => sec.kind !== 'videos').flatMap((sec) => sec.images);
        // A video-only project has no pieces to show as images: its cover stays out and the gallery starts with the video.
        const all = !imgs.length ? [] : imgs.some((x) => x.src === p.cover.src) ? imgs : [p.cover, ...imgs];
        all.forEach((x) => shots.push(x));
        sections = (all.length ? `<div class="g-grid g-equal">${all.map((x) => fig(x, 'g-item')).join('')}</div>` : '')
            + p.sections.filter((sec) => sec.kind === 'videos').map(videos).join('');
    } else {
        shots.push(p.cover);
        cover = fig(p.cover, 'g-cover');
        sections = p.sections.map((sec) => {
            if (sec.kind === 'videos') return videos(sec);
            sec.images.forEach((x) => shots.push(x));
            return `<div class="${sec.kind === 'grid' ? 'g-grid' : 'g-column'}">${sec.images.map((x) => fig(x, 'g-item')).join('')}</div>`;
        }).join('');
    }

    const pieces = manual ? manual.pieces : shots.length + p.sections.filter((s) => s.kind === 'videos').reduce((a, s) => a + s.videos.length, 0);

    // Lead: the case's context if there is one, otherwise the project description. Hidden while it is a placeholder.
    const lead = c && known(c.context) ? c.context : p.description;
    const result = c && known(c.result) ? `
        <article class="p-chapter" data-reveal>
            <p class="mono p-chapter-n">Resultado</p>
            <p class="p-chapter-p">${esc(c.result)}</p>
        </article>` : '';

    // Side column facts: only what is confirmed.
    const facts = [
        ['Proyecto', p.index],
        c && known(c.year) && ['Año', c.year],
        c && known(c.client) && ['Cliente', c.client],
        c && known(c.role) && ['Rol', c.role],
        c && known(c.tools) && ['Herramientas', c.tools.filter(known).join(', ')],
        ['Tipo', p.type],
        ['Piezas', pad(pieces)],
    ].filter(Boolean);

    document.title = `${p.title} — ${p.type} | Máximo Mazzuchin`;
    setAccent(accentOf(p.slug));

    view.innerHTML = `
        <div class="p-layout">
            <aside class="p-side">
                <p class="mono p-meta"><span><span class="num">${p.index}</span> / ${pad(projects.length)}</span><span>${esc(p.type)}</span></p>
                <h1 class="p-title">${esc(p.title)}</h1>
                <div class="dbar" data-dbar></div>
                ${known(lead) ? `<p class="p-desc" data-reveal>${esc(lead)}</p>` : ''}
                <dl class="p-facts mono">
                    ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
                </dl>
                <nav class="p-pager mono" aria-label="Otros proyectos">
                    <a href="/proyecto.html?p=${prev.slug}" data-cursor-item data-cursor="Anterior"><span>←</span> <span class="num">${prev.index}</span> <span class="p-pager-name">${esc(prev.title)}</span></a>
                    <a href="/proyecto.html?p=${next.slug}" data-cursor-item data-cursor="Siguiente"><span class="p-pager-name">${esc(next.title)}</span> <span class="num">${next.index}</span> <span>→</span></a>
                </nav>
            </aside>
            <section class="p-gallery">${cover}${manual ? sections + result : result + sections}</section>
        </div>
        <a class="p-next" href="/proyecto.html?p=${next.slug}" data-cursor-item data-cursor="Siguiente">
            <span class="mono p-next-label"><span>Siguiente — ${next.index}</span><span>↗</span></span>
            <span class="p-next-title">${esc(next.title)}</span>
        </a>`;

    let gone = false;
    let manualCleanup = null;
    const slot = view.querySelector('[data-manual]');
    if (slot) {
        manual.load().then(async (mod) => {
            if (gone) return;
            slot.outerHTML = mod.manualHTML();
            manualCleanup = await mod.mountManual(view.querySelector('.p-gallery'));
            if (gone) manualCleanup();
            ScrollTrigger.refresh();
        });
    }

    const onClick = (e) => {
        const t = e.target.closest('[data-open]');
        if (!t) return;
        openLightbox({ images: shots, index: Number(t.dataset.open), title: p.title });
    };
    view.addEventListener('click', onClick);

    // The dither rule in the side column doubles as a scroll progress bar (--p goes 0 → 1 down the page).
    const side = view.querySelector('.p-side');
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        side.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : '0');
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();

    // Videos: only the ones near the viewport hold a src, so browsing never downloads them all.
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            const v = e.target;
            if (e.isIntersecting) {
                if (!v.getAttribute('src')) { v.src = v.dataset.src; v.play?.().catch(() => {}); }
            } else if (v.getAttribute('src')) {
                v.pause();
                v.removeAttribute('src');
                v.load();
            }
        }
    }, { rootMargin: '300px 0px' });
    view.querySelectorAll('video[data-src]').forEach((v) => io.observe(v));

    return () => {
        gone = true;
        manualCleanup?.();
        view.removeEventListener('click', onClick);
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
        io.disconnect();
    };
}
