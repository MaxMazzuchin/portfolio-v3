/** Read a CSS custom property holding #rrggbb and return [r, g, b] in 0..1 (sRGB, no conversion). */
export function cssColor(name) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hex = raw.replace('#', '');
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const n = parseInt(full, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
