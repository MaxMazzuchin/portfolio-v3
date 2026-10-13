import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scroll = {
    lenis: null,
    velocity: 0,
    y: 0,

    init() {
        if (reduced) {
            addEventListener('scroll', () => { scroll.y = window.scrollY; }, { passive: true });
            return;
        }
        const lenis = (this.lenis = new Lenis({ lerp: 0.1, smoothWheel: true }));
        lenis.on('scroll', () => {
            scroll.y = lenis.scroll;
            ScrollTrigger.update();
        });
        gsap.ticker.add((t) => {
            lenis.raf(t * 1000);
            scroll.velocity = lenis.velocity;
        });
        gsap.ticker.lagSmoothing(0);
    },

    /** target: number (px) or element/selector. */
    to(target, opts = {}) {
        if (this.lenis) return this.lenis.scrollTo(target, opts);
        if (typeof target === 'number') return window.scrollTo(0, target);
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        el?.scrollIntoView();
    },

    stop() { this.lenis?.stop(); },
    start() { this.lenis?.start(); },

    top() {
        if (this.lenis) this.lenis.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        this.y = 0;
    },
};
