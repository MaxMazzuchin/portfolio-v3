/** Sets the --accent CSS variable (counters, rules, underlines). null = back to the text colour. */
export function setAccent(hex) {
    document.documentElement.style.setProperty('--accent', hex || 'var(--fg)');
}
