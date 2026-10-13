import { setAccent } from '../core/accent.js';

/** Sobre mí is static markup (sobre-mi.html); this only sets the page state. */
export function mountAbout() {
    document.title = 'Sobre mí | Máximo Mazzuchin';
    setAccent('#c7f24b');
    return () => {};
}
