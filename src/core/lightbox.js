import gsap from 'gsap';
import { scroll } from './scroll.js';

const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/**
 * Full-screen image viewer.
 *  - Desktop: one image at a time. ← / → (or the buttons, or a horizontal swipe) move between
 *    pieces, click toggles a 2.4x zoom that pans with the pointer, Esc closes.
 *  - Mobile / touch: a vertical list, one piece per screen, scroll up / down to move through them.
 */
export function openLightbox({ images, index = 0, title = '' }) {
    const opener = document.activeElement;
    const mobile = matchMedia('(max-width: 800px), (pointer: coarse)').matches;
    const N = images.length;
    let i = Math.min(Math.max(index, 0), N - 1);

    const root = document.createElement('div');
    root.className = `lb ${mobile ? 'lb--list' : 'lb--single'}`;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', `Visor de imágenes — ${title}`);
    root.innerHTML = `
        <div class="lb-top mono">
            <span class="lb-title">${esc(title)}</span>
            <span class="lb-count"><b data-lb-n>${pad(i + 1)}</b> / ${pad(N)}</span>
            <button class="lb-close" type="button" aria-label="Cerrar visor">Cerrar ✕</button>
        </div>
        ${mobile
            ? `<div class="lb-scroll">${images.map((s, k) => `<div class="lb-slide"><img src="${s.src}" alt="${esc(title)} — ${k + 1}" decoding="async" ${Math.abs(k - i) > 1 ? 'loading="lazy"' : ''}></div>`).join('')}</div>`
            : `<div class="lb-stage"><img class="lb-img" alt=""></div>
               <button class="lb-nav lb-prev mono" type="button" aria-label="Anterior">←</button>
               <button class="lb-nav lb-next mono" type="button" aria-label="Siguiente">→</button>
               <p class="lb-hint mono">← → navegar · click para zoom · esc cerrar</p>`}
    `;
    document.body.appendChild(root);

    // lock page scroll
    scroll.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const nEl = root.querySelector('[data-lb-n]');
    const closeBtn = root.querySelector('.lb-close');
    const cleanups = [];

    /* ---------------- mobile: vertical list ---------------- */
    if (mobile) {
        const list = root.querySelector('.lb-scroll');
        list.scrollTop = i * list.clientHeight;
        const slides = [...list.children];
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting && e.intersectionRatio > 0.6) {
                    i = slides.indexOf(e.target);
                    nEl.textContent = pad(i + 1);
                }
            }
        }, { root: list, threshold: [0.6] });
        slides.forEach((s) => io.observe(s));
        cleanups.push(() => io.disconnect());
    }

    /* ---------------- desktop: single image ---------------- */
    if (!mobile) {
        const img = root.querySelector('.lb-img');
        const stage = root.querySelector('.lb-stage');
        let zoomed = false;
        let busy = false;

        const preload = (k) => { const m = new Image(); m.src = images[(k + N) % N].src; };

        const setZoom = (on, e) => {
            zoomed = on;
            root.classList.toggle('is-zoomed', on);
            if (on && e) pan(e);
            gsap.to(img, { scale: on ? 2.4 : 1, duration: 0.45, ease: 'power3.out' });
        };
        const pan = (e) => {
            const r = stage.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
        };

        const show = (k, dir = 0) => {
            i = (k + N) % N;
            nEl.textContent = pad(i + 1);
            if (zoomed) setZoom(false);
            img.alt = `${title} — ${i + 1}`;
            img.src = images[i].src;
            img.style.transformOrigin = '50% 50%';
            gsap.fromTo(img, { opacity: 0, x: dir * 48 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' });
            preload(i + 1);
            preload(i - 1);
        };
        const go = (d) => {
            if (busy) return;
            busy = true;
            setTimeout(() => { busy = false; }, 260);
            show(i + d, d);
        };

        show(i, 0);

        root.querySelector('.lb-prev').addEventListener('click', () => go(-1));
        root.querySelector('.lb-next').addEventListener('click', () => go(1));
        img.addEventListener('click', (e) => setZoom(!zoomed, e));
        stage.addEventListener('pointermove', (e) => { if (zoomed) pan(e); });
        stage.addEventListener('click', (e) => { if (e.target === stage) { if (zoomed) setZoom(false); else go(1); } });

        // horizontal swipe (touch laptops / tablets in landscape)
        let sx = null;
        stage.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') sx = e.clientX; });
        stage.addEventListener('pointerup', (e) => {
            if (sx === null) return;
            const dx = e.clientX - sx;
            sx = null;
            if (Math.abs(dx) > 50 && !zoomed) go(dx < 0 ? 1 : -1);
        });

        // wheel / trackpad moves between pieces when not zoomed
        const onWheel = (e) => {
            if (zoomed) return;
            e.preventDefault();
            if (Math.abs(e.deltaY) + Math.abs(e.deltaX) > 24) go((e.deltaY || e.deltaX) > 0 ? 1 : -1);
        };
        root.addEventListener('wheel', onWheel, { passive: false });

        const onKey = (e) => {
            if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
            else if (e.key === '+' || e.key === '=') setZoom(true);
            else if (e.key === '-') setZoom(false);
        };
        document.addEventListener('keydown', onKey);
        cleanups.push(() => document.removeEventListener('keydown', onKey));
    }

    /* ---------------- close ---------------- */
    let closed = false;
    const close = () => {
        if (closed) return;
        closed = true;
        cleanups.forEach((fn) => fn());
        document.removeEventListener('keydown', onEsc);
        gsap.to(root, {
            opacity: 0, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
                root.remove();
                document.documentElement.style.overflow = prevOverflow;
                scroll.start();
                opener?.focus?.({ preventScroll: true });
            },
        });
    };
    const onEsc = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onEsc);
    closeBtn.addEventListener('click', close);

    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    closeBtn.focus({ preventScroll: true });
    return close;
}
