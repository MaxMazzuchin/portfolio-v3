import { setAccent } from '../core/accent.js';

/** 404: static markup, just the page title and a neutral accent. */
export function mountNotFound() {
    document.title = 'Página no encontrada | Máximo Mazzuchin';
    setAccent(null);
    return () => {};
}
