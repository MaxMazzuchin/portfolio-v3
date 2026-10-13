/** 8x8 Bayer threshold map, values in [0,1). Same recursion as the GLSL helper in gl/shaders/common.glsl. */
export const BAYER8 = (() => {
    let m = [[0, 2], [3, 1]];
    for (let n = 2; n < 8; n *= 2) {
        const next = Array.from({ length: n * 2 }, () => new Array(n * 2));
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                const v = m[y][x] * 4;
                next[y][x] = v;
                next[y][x + n] = v + 2;
                next[y + n][x] = v + 3;
                next[y + n][x + n] = v + 1;
            }
        }
        m = next;
    }
    return m.map((row) => row.map((v) => (v + 0.5) / 64));
})();

export const bayerAt = (x, y) => BAYER8[y & 7][x & 7];

/**
 * Fill a canvas with a left→right dithered fade of `color` (a thin accent rule). cell = px per dither cell.
 * With `t` (seconds) the dense band travels along the bar instead of staying at the left.
 */
export function ditherBar(canvas, color, cell = 3, t) {
    const w = Math.max(1, Math.round(canvas.clientWidth));
    const h = Math.max(1, Math.round(canvas.clientHeight));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const density = t === undefined
                ? 1 - x / cols // dense at the left, fades out to the right
                : 0.08 + 0.92 * (0.5 + 0.5 * Math.cos(Math.PI * 2 * (x / cols * 0.8 - t * 0.12)));
            if (density > bayerAt(x, y)) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
    }
}

/**
 * Slow drifting dither field (sum of three sines through the Bayer map) painted into `canvas` at `t` seconds.
 * `pointer` ({ x, y, r, k }, canvas px) adds a soft denser spot that follows the cursor.
 */
export function ditherField(canvas, color, t, cell = 8, maxDensity = 0.22, pointer = null) {
    const w = Math.max(1, Math.round(canvas.clientWidth));
    const h = Math.max(1, Math.round(canvas.clientHeight));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const v = Math.sin(x * 0.07 + t * 0.6) + Math.sin(y * 0.09 - t * 0.45) + Math.sin((x + y) * 0.04 + t * 0.3);
            let density = Math.max(0, (v / 3 + 0.5) * maxDensity);
            if (pointer && pointer.k > 0.01) {
                const d = Math.hypot((x + 0.5) * cell - pointer.x, (y + 0.5) * cell - pointer.y) / pointer.r;
                if (d < 1) density += (1 - d) * (1 - d) * 0.55 * pointer.k;
            }
            if (density > bayerAt(x, y)) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
    }
}

