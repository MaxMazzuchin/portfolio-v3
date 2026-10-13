import { gl } from '../gl/index.js';

const root = document.documentElement;
const LABELS = { dark: 'Oscuro', light: 'Claro' };

function paint(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-label]').forEach((el) => { el.textContent = LABELS[theme]; });
    if (gl.ok) gl.syncColors();
}

export function initTheme() {
    paint(root.dataset.theme === 'light' ? 'light' : 'dark');

    document.querySelector('.theme-toggle')?.addEventListener('click', async () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
        await gl.cover();          // dither wipe in the old foreground colour…
        paint(next);               // …flip underneath…
        await gl.uncover();        // …and dissolve away.
    });
}
