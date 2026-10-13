import { projects } from '../data/projects.js';
import { library, kinds } from '../data/library.js';
import { accentOf } from '../data/accents.js';
import { gl } from '../gl/index.js';
import { createWheel } from '../gl/wheel.js';
import { scroll } from '../core/scroll.js';
import { setAccent } from '../core/accent.js';
import { generatedCover } from '../core/cards.js';
import { mountDbars } from '../core/dbar.js';

const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const VIEW_KEY = 'col-view';

/** Each collection maps its data to the same item shape: { name, sub, meta, cover, accent, href|url, group }. */
const CONFIGS = {
    work: {
        title: 'Trabajos | Máximo Mazzuchin',
        openLabel: 'Ver proyecto ↗',
        items: () => projects.map((p) => ({
            key: p.slug, name: p.title, sub: p.type, meta: `${p.index} / ${pad(projects.length)}`,
            cover: p.cover.src, accent: accentOf(p.slug), href: `/proyecto.html?p=${p.slug}`, subLabel: p.type,
        })),
    },
    library: {
        title: 'Biblioteca | Máximo Mazzuchin',
        openLabel: 'Abrir recurso ↗',
        filters: true,
        items: () => library.map((e) => ({
            key: e.slug, name: e.author, sub: e.title, meta: e.year, group: e.kind, subLabel: kinds[e.kind].singular,
            cover: e.cover || null, accent: e.accent, url: e.url, placeholder: e.placeholder,
            gen: { kindLabel: kinds[e.kind].singular, author: e.author, title: e.title, accent: e.accent },
        })),
    },
};

/** Minimal stand-in for the WebGL wheel, so the list view still works without WebGL. */
function stubWheel(N, { onFrame, onActive, onOpen }) {
    let active = -1;
    const set = (i) => {
        const a = ((i % N) + N) % N;
        if (a !== active) { active = a; onActive?.(a); }
        onFrame?.(a, a);
    };
    const onKey = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') set(active + 1);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') set(active - 1);
        else if (e.key === 'Enter') onOpen?.(active);
    };
    let lastWheel = 0;
    const onWheel = (e) => {
        const now = performance.now();
        if (Math.abs(e.deltaY) < 4 || now - lastWheel < 140) return;
        lastWheel = now;
        set(active + (e.deltaY > 0 ? 1 : -1));
    };
    addEventListener('keydown', onKey);
    addEventListener('wheel', onWheel, { passive: true });
    set(0);
    return {
        goTo: set, go: (n) => set(active + n), setVisible() {}, get active() { return active; },
        dispose() { removeEventListener('keydown', onKey); removeEventListener('wheel', onWheel); },
    };
}

function collection(kind, view) {
    const cfg = CONFIGS[kind];
    document.title = cfg.title;

    const stage = view.querySelector('.col-stage');
    const listEl = view.querySelector('[data-c-list]');
    const indexEl = view.querySelector('[data-c-index]');
    const hit = view.querySelector('[data-c-hit]');
    const countEl = view.querySelector('[data-c-count]');
    const subEl = view.querySelector('[data-c-sub]');
    const openEl = view.querySelector('[data-c-open]');
    const filtersEl = view.querySelector('[data-c-filters]');
    const previewImg = view.querySelector('.c-preview img');
    const switchBtns = [...view.querySelectorAll('[data-view]')];

    let disposed = false;
    let wheel = null;
    let items = [];
    let filter = 'all';
    let mode = 'wheel';
    try { mode = localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'wheel'; } catch { /* storage unavailable */ }
    if (!gl.ok) mode = 'list';

    scroll.stop();
    let rowH = 120;
    const onResize = () => { const r = listEl.querySelector('.c-item'); if (r) rowH = r.offsetHeight || rowH; };
    addEventListener('resize', onResize);

    const applyMode = () => {
        stage.classList.toggle('is-list', mode === 'list');
        switchBtns.forEach((b) => b.classList.toggle('is-on', b.dataset.view === mode));
        wheel?.setVisible(mode === 'wheel');
    };

    function setOpen(item) {
        if (item.href) {
            openEl.href = item.href;
            openEl.removeAttribute('target');
            openEl.removeAttribute('rel');
            openEl.removeAttribute('aria-disabled');
            openEl.textContent = cfg.openLabel;
        } else if (item.url) {
            openEl.href = item.url;
            openEl.target = '_blank';
            openEl.rel = 'noopener';
            openEl.removeAttribute('aria-disabled');
            openEl.textContent = cfg.openLabel;
        } else {
            openEl.removeAttribute('href');
            openEl.setAttribute('aria-disabled', 'true');
            openEl.textContent = 'Sin link (ejemplo)';
        }
    }

    function render(next) {
        wheel?.dispose();
        if (gl.wheel === wheel) gl.wheel = null;
        items = next;
        const N = items.length;

        listEl.innerHTML = items.map((it, i) => `
            <div class="c-item" style="--fit:${Math.min(1, 14 / it.name.length).toFixed(3)}">
                <span class="c-num">${pad(i + 1)}</span>
                <span class="c-name">${esc(it.name)}<span class="c-sub2">${esc(it.sub)}${it.placeholder ? '<span class="c-tag">Ejemplo</span>' : ''}</span></span>
                <span class="c-meta">${esc(it.meta)}</span>
            </div>`).join('');
        const rows = [...listEl.children];

        indexEl.innerHTML = items.map((it, i) => `
            <button type="button" class="ci-row" data-i="${i}"><span class="num">${pad(i + 1)}</span><span>${esc(it.name)}</span><span>${esc(it.sub)}</span></button>`).join('');
        const idxRows = [...indexEl.children];
        onResize();

        const handlers = {
            onFrame(pos) {
                rows.forEach((row, k) => {
                    let d = k - pos;
                    d -= N * Math.round(d / N);
                    const ad = Math.abs(d);
                    row.style.opacity = ad < 1.6 ? String(Math.max(0, 1 - ad * 0.78)) : '0';
                    row.style.transform = `translateY(${d * rowH}px)`;
                });
            },
            onActive(i) {
                const it = items[i];
                countEl.textContent = `${pad(i + 1)} / ${pad(N)}`;
                subEl.textContent = it.subLabel || '';
                setOpen(it);
                setAccent(it.accent);
                previewImg.src = it.cover;
                idxRows.forEach((r, k) => r.classList.toggle('is-active', k === i));
                mountDbars(view);
            },
            onOpen(i) {
                const it = items[i];
                if (it && (it.href || it.url)) openEl.click();
            },
        };

        wheel = gl.ok
            ? createWheel(gl, { projects: items.map((it) => ({ cover: { src: it.cover } })), hit, ...handlers })
            : stubWheel(N, handlers);
        if (gl.ok) gl.wheel = wheel;
        applyMode();
    }

    function renderFilters() {
        if (!cfg.filters) return;
        const all = cfg.items();
        const present = Object.keys(kinds).filter((k) => all.some((i) => i.group === k));
        filtersEl.innerHTML = [`<button type="button" data-f="all" class="is-on">Todos<sup class="num">${all.length}</sup></button>`]
            .concat(present.map((k) => `<button type="button" data-f="${k}">${kinds[k].label}<sup class="num">${all.filter((i) => i.group === k).length}</sup></button>`))
            .join('');
    }

    const onClick = (e) => {
        const f = e.target.closest('[data-f]');
        if (f) {
            filter = f.dataset.f;
            filtersEl.querySelectorAll('[data-f]').forEach((b) => b.classList.toggle('is-on', b === f));
            render(allItems.filter((i) => filter === 'all' || i.group === filter));
            return;
        }
        const v = e.target.closest('[data-view]');
        if (v) {
            mode = v.dataset.view;
            try { localStorage.setItem(VIEW_KEY, mode); } catch { /* storage unavailable */ }
            applyMode();
            return;
        }
        const row = e.target.closest('.ci-row');
        if (row) {
            const i = Number(row.dataset.i);
            if (i === wheel.active) { if (items[i].href || items[i].url) openEl.click(); } else wheel.goTo(i);
        }
    };
    const onOver = (e) => {
        const row = e.target.closest('.ci-row');
        if (row && mode === 'list') wheel.goTo(Number(row.dataset.i));
    };
    view.addEventListener('click', onClick);
    view.addEventListener('pointerover', onOver);

    renderFilters();
    let allItems = [];
    // Library entries without a real cover get a generated card; resolve them all before the first render.
    Promise.all(cfg.items().map(async (it) => (it.cover ? it : { ...it, cover: await generatedCover(it.gen) })))
        .then((resolved) => {
            if (disposed) return;
            allItems = resolved;
            render(allItems);
        });

    return () => {
        disposed = true;
        removeEventListener('resize', onResize);
        view.removeEventListener('click', onClick);
        view.removeEventListener('pointerover', onOver);
        wheel?.dispose();
        if (gl.wheel === wheel) gl.wheel = null;
        scroll.start();
    };
}

export const mountWork = (view) => collection('work', view);
export const mountLibrary = (view) => collection('library', view);
