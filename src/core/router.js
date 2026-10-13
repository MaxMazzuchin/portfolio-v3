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

    const sameDoc = (a, b) => a.pathname === b.pathname && a.search === b.search;

    function scrollToHash(hash, immediate) {
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) scroll.to(el, immediate ? { immediate: true } : { duration: 1.4 });
    }

    async function go(href, { push = true } = {}) {
        if (busy) return;
        const url = new URL(href, location.href);

        if (sameDoc(url, location)) {
            if (url.hash) scrollToHash(url.hash, false);
            else scroll.to(0, { duration: 1.2 });
            return;
        }

        busy = true;
        gl.enableReveal(false);
        try {
            const [html] = await Promise.all([
                fetch(url.pathname + url.search).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }),
                gl.cover(),
            ]);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const next = doc.querySelector('[data-router-view]');

            view().innerHTML = next.innerHTML;
            view().dataset.page = next.dataset.page;
            document.title = doc.title;
            if (push) history.pushState({}, '', url.pathname + url.search + url.hash);

            scroll.top();
            await mount(view());
            scrollToHash(url.hash, true);

            gl.enableReveal(true);
            await gl.uncover();
        } catch (err) {
            console.error('[router] falling back to a full load', err);
            location.assign(url.href);
        } finally {
            busy = false;
        }
    }

    document.addEventListener('click', (e) => {
        const a = e.target.closest?.('a[href]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-router')) return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        e.preventDefault();
        go(url.href);
    });

    addEventListener('popstate', () => go(location.href, { push: false }));

    return { go };
}

export { reduced };
