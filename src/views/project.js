import { projects, bySlug } from '../data/projects.js';
import { accentOf } from '../data/accents.js';
import { openLightbox } from '../core/lightbox.js';
import { setAccent } from '../core/accent.js';

const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Renders the project named by ?p=<slug>. The gallery follows the V2 structure, per project:
 * cover → single column (column) → two-column grid (grid) → videos, whichever the project has.
 */
export function mountProject(view) {
    const slug = new URLSearchParams(location.search).get('p');
    const p = bySlug(slug) || projects[0];
    const at = projects.indexOf(p);
    const next = projects[(at + 1) % projects.length];
    const prev = projects[(at - 1 + projects.length) % projects.length];

    // Every image, in page order: this is what the lightbox walks through.
    const shots = [p.cover];
    let n = 0;
    const fig = (s, cls) => {
        const i = n++;
        // The cover is the first thing on screen: load it right away; the rest wait until they get close.
        const load = i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
        return `<figure class="${cls}" style="--ar:${s.w}/${s.h}" data-cursor-item data-cursor="Ampliar" data-open="${i}">
            <img data-gl-img src="${s.src}" alt="${esc(p.title)} — ${i + 1}" width="${s.w}" height="${s.h}" ${load} decoding="async">
        </figure>`;
    };

    const cover = fig(p.cover, 'g-cover');
    const sections = p.sections.map((sec) => {
        if (sec.kind === 'videos') {
            return `<div class="g-videos">${sec.videos.map((v, i) => `
                <video data-src="${v}" controls playsinline loop muted preload="none" aria-label="${esc(p.title)} — video ${i + 1}"></video>`).join('')}</div>`;
        }
        sec.images.forEach((s) => shots.push(s));
        return `<div class="${sec.kind === 'grid' ? 'g-grid' : 'g-column'}">${sec.images.map((s) => fig(s, 'g-item')).join('')}</div>`;
    }).join('');

    const pieces = shots.length + p.sections.filter((s) => s.kind === 'videos').reduce((a, s) => a + s.videos.length, 0);

    document.title = `${p.title} — ${p.type} | Máximo Mazzuchin`;
    setAccent(accentOf(p.slug));

    view.innerHTML = `
        <div class="p-layout">
            <aside class="p-side">
                <p class="mono p-meta"><span><span class="num">${p.index}</span> / ${pad(projects.length)}</span><span>${esc(p.type)}</span></p>
                <h1 class="p-title">${esc(p.title)}</h1>
                <div class="dbar" data-dbar></div>
                <p class="p-desc" data-reveal>${esc(p.description)}</p>
                <dl class="p-facts mono">
                    <div><dt>Proyecto</dt><dd>${p.index}</dd></div>
                    <div><dt>Tipo</dt><dd>${esc(p.type)}</dd></div>
                    <div><dt>Piezas</dt><dd>${pad(pieces)}</dd></div>
                </dl>
                <nav class="p-pager mono" aria-label="Otros proyectos">
                    <a href="/proyecto.html?p=${prev.slug}" data-cursor-item data-cursor="Anterior"><span>←</span> <span class="num">${prev.index}</span> <span class="p-pager-name">${esc(prev.title)}</span></a>
                    <a href="/proyecto.html?p=${next.slug}" data-cursor-item data-cursor="Siguiente"><span class="p-pager-name">${esc(next.title)}</span> <span class="num">${next.index}</span> <span>→</span></a>
                </nav>
            </aside>
            <section class="p-gallery">${cover}${sections}</section>
        </div>
        <a class="p-next" href="/proyecto.html?p=${next.slug}" data-cursor-item data-cursor="Siguiente">
            <span class="mono p-next-label"><span>Siguiente — ${next.index}</span><span>↗</span></span>
            <span class="p-next-title">${esc(next.title)}</span>
        </a>`;

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
        view.removeEventListener('click', onClick);
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
        io.disconnect();
    };
}
