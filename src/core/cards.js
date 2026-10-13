/**
 * Generated cover for library entries that don't have a real image yet: a flat dark card with the
 * kind, author and title in pixel type. Returns a data URL usable by both <img> and the WebGL loader.
 */
export async function generatedCover({ kindLabel, author, title, accent }) {
    try { await document.fonts.load('40px "Roboto Mono"'); await document.fonts.load('700 54px "Inter Tight"'); } catch { /* fall back to system fonts */ }

    const W = 640;
    const H = 800;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');

    g.fillStyle = '#0b0b0b';
    g.fillRect(0, 0, W, H);
    g.fillStyle = accent;
    g.fillRect(0, 0, W, 14);

    g.fillStyle = '#8a8a84';
    g.font = '40px "Roboto Mono", monospace';
    g.textBaseline = 'top';
    g.fillText(kindLabel.toUpperCase(), 40, 48);

    const wrap = (text, font, maxW) => {
        g.font = font;
        const out = [];
        let line = '';
        for (const word of text.split(/\s+/)) {
            const t = line ? `${line} ${word}` : word;
            if (line && g.measureText(t).width > maxW) { out.push(line); line = word; } else line = t;
        }
        out.push(line);
        return out;
    };

    g.fillStyle = '#f1f1ee';
    let y = H - 40;
    const tFont = '700 54px "Inter Tight", Helvetica, Arial, sans-serif';
    const tLines = wrap(title, tFont, W - 80).slice(0, 4);
    g.font = tFont;
    g.textBaseline = 'alphabetic';
    tLines.reverse().forEach((l) => { g.fillText(l, 40, y); y -= 58; });

    g.fillStyle = accent;
    g.font = '36px "Roboto Mono", monospace';
    wrap(author, '36px "Roboto Mono", monospace', W - 80).slice(0, 2).reverse().forEach((l) => { y -= 6; g.fillText(l.toUpperCase(), 40, y); y -= 36; });

    return c.toDataURL('image/webp', 0.9);
}


