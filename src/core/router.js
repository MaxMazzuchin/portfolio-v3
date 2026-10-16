import { gl } from '../gl/index.js';
import { scroll, reduced } from './scroll.js';

/**
 * Minimal page router: intercepts same-origin links, runs the dither curtain,
 * swaps the contents of [data-router-view], and re-mounts.
 *   mount(view) -> void   called after every swap (and once on first load)
 */
export function initRouter({ mount }) {
    const view = () => document.querySelector('[data-router-view]');
    let busy = false;
    // Página que se está mostrando. En popstate `location` ya apunta al destino, así que no sirve para comparar.
    let current = location.pathname + location.search;

    const sameDoc = (a) => a.pathname + a.search === current;

    // HTML de cada página, pedido una sola vez (también al pasar el mouse por un link) para que la cortina no espere a la red.
    const pages = new Map();
    const load = (url) => {
        const key = url.pathname + url.search;
        if (!pages.has(key)) {
            pages.set(key, fetch(key).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
                .catch((err) => { pages.delete(key); throw err; }));
        }
        return pages.get(key);
    };

    // Link interno que maneja el router (misma condición para click y prefetch).
    const routable = (e) => {
        const a = e.target.closest?.('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-router')) return null;
        const url = new URL(a.href, location.href);
        return url.origin === location.origin ? url : null;
    };

    function scrollToHash(hash, immediate) {
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) scroll.to(el, immediate ? { immediate: true } : { duration: 1.4 });
    }

    // Después de cambiar de página el foco pasa a su título (o a la vista) y se anuncia el título nuevo, como haría una carga completa.
    function focusView() {
        const v = view();
        // El título puede estar oculto todavía (data-reveal arranca con visibility:hidden) y un elemento oculto no recibe foco: en ese caso, la vista.
        for (const target of [v.querySelector('h1'), v]) {
            if (!target) continue;
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            if (document.activeElement === target) break;
        }
        const live = document.querySelector('[data-announce]');
        if (live) live.textContent = document.title;
    }

    async function go(href, { push = true } = {}) {
        if (busy) return;
        const url = new URL(href, location.href);

        if (sameDoc(url)) {
            if (url.hash) scrollToHash(url.hash, false);
            else scroll.to(0, { duration: 1.2 });
            return;
        }

        // Entrar a un proyecto: cambio directo, sin animación. Entre secciones: cortina de dither.
        const toProject = url.pathname.startsWith('/proyecto');
        busy = true;
        gl.enableReveal(false);
        try {
            const [html] = await Promise.all([
                load(url),
                toProject ? null : gl.cover(),
            ]);
            pages.delete(url.pathname + url.search); // un prefetch sirve una sola vez, así no queda HTML viejo
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const next = doc.querySelector('[data-router-view]');

            view().innerHTML = next.innerHTML;
            view().dataset.page = next.dataset.page;
            document.title = doc.title;
            if (push) history.pushState({}, '', url.pathname + url.search + url.hash);
            current = url.pathname + url.search;

            scroll.top();
            await mount(view());
            focusView();
            scrollToHash(url.hash, true);

            gl.enableReveal(true);
            if (!toProject) await gl.uncover();
        } catch (err) {
            console.error('[router] falling back to a full load', err);
            location.assign(url.href);
        } finally {
            busy = false;
        }
    }

    document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const url = routable(e);
        if (!url) return;
        e.preventDefault();
        go(url.href);
    });

    document.addEventListener('pointerover', (e) => {
        const url = routable(e);
        if (url && !sameDoc(url)) load(url).catch(() => {});
    }, { passive: true });

    addEventListener('popstate', () => go(location.href, { push: false }));

    return { go };
}

export { reduced };
