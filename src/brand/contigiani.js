import './contigiani.css';
import gsap from 'gsap';
import { logoSVG } from './cb-logo.js';
import { heroTimeline, miniTimeline } from './cb-build.js';
import { enterTimeline, onceInView, loadFonts as loadFontsFrom, reduced } from './motion.js';

// Manual de marca de Contigiani Briñón armado con HTML/SVG/CSS (sin láminas exportadas).
// Solo las fotos de las propiedades son imagen (public/images/projects/contigiani-brinon/fotos).
const FOTO = '/images/projects/contigiani-brinon/fotos';

export const pieces = 9;

const I = {
    bed: '<path d="M3 19V7M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6M6.5 12h.01"/>',
    bath: '<path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2zM5 12V6a2.5 2.5 0 0 1 5 0M7 21l1-3M17 21l-1-3"/>',
    area: '<rect x="4" y="4" width="16" height="16" stroke-dasharray="3 3"/>',
    pin: '<path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    building: '<path d="M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3"/>',
    crane: '<path d="M12 21V4M5 4h14M5 4v4M17 4v7M10 21h4M9 8h6"/>',
    chart: '<path d="M4 20V4M4 20h16M7 16l4-4 3 3 5-6"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M15 14c3 0 6 1.5 6 5"/>',
};
const icon = (n, cls = '') => `<svg class="cb-i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const head = (where) => `<p class="cb-sl-head" data-in>Manual de marca<br>//${where}</p>`;
const deco = (cls) => `<div class="cb-deco ${cls}" aria-hidden="true">${logoSVG({ layout: 'icon', tag: false })}</div>`;

const COLORS = [
    ['Deep Navy', '#1559e6', '21, 89, 230', '87, 65, 0, 0', 'navy'],
    ['Signal Red', '#FF0D0D', '255, 13, 13', '0, 95, 95, 0', 'red'],
    ['Carbon Black', '#0A0A0A', '10, 10, 10', '0, 0, 0, 96', 'black'],
    ['Chalk White', '#F2F2F2', '242, 242, 242', '0, 0, 0, 5', 'white'],
];

const SAMPLES = [
    ['Montserrat Extra Bold', 'x'],
    ['Montserrat Semi Bold', 's'],
    ['Montserrat Regular', 'r'],
];

// Fila: fondo, color del vertical, del horizontal y del ícono.
const VARIANTS = [
    ['navy', '#fff', '#0a0a0a', '#fff'],
    ['red', '#fff', '#fff', '#fff'],
    ['black', '#fff', '#1559e6', '#fff'],
    ['white', '#1559e6', '#1559e6', '#1559e6'],
];

const postH = () => `
    <div class="cb-post cb-post--h">
        <div class="ph-photo" style="background-image:url(${FOTO}/casa-h.webp)">
            <div class="ph-badge">${logoSVG({ layout: 'v', cls: 'cb-mini' })}</div>
        </div>
        <div class="ph-info">
            <div class="ph-main">
                <p class="ph-kicker"><i></i>CASA EN VENTA</p>
                <p class="ph-price">USD $900.000</p>
                <p class="ph-loc">${icon('pin')}CHACRAS DE LA VILLA, VILLA ALLENDE</p>
                <ul class="ph-stats">
                    <li>${icon('bed')}<b>4</b> DORMITORIOS</li><li>${icon('bath')}<b>4</b> BAÑOS</li><li>${icon('area')}<b>320 M²</b> CUBIERTOS</li>
                </ul>
            </div>
            <div class="ph-side"><p class="ph-tag">DISEÑO, CONFORT<br>Y EXCLUSIVIDAD.</p><i></i><p>Propiedad única con arquitectura de vanguardia, amplios espacios y detalles de máxima calidad.</p></div>
        </div>
    </div>`;

const postV = (kind) => kind === 'house' ? `
    <div class="cb-post cb-post--v">
        <div class="pv-photo" style="background-image:url(${FOTO}/casa-v.webp)"></div>
        <div class="pv-logo">${logoSVG({ layout: 'h', cls: 'cb-mini' })}</div>
        <div class="pv-text">
            <p class="pv-price"><span>USD $900.000</span></p>
            <p class="pv-big">CASA EN VENTA</p>
            <p class="pv-loc">CHACRAS DE LA VILLA, VILLA ALLENDE</p>
            <ul class="pv-stats"><li>${icon('bed')}5 DORMITORIOS</li><li>${icon('bath')}5 BAÑOS</li><li>${icon('area')}2054 M2</li></ul>
        </div>
    </div>` : `
    <div class="cb-post cb-post--v">
        <div class="pv-photo pv-photo--full" style="background-image:url(${FOTO}/pileta-v.webp)"></div>
        <div class="pv-foot">${logoSVG({ layout: 'h', cls: 'cb-mini' })}</div>
    </div>`;

const igTile = (n) => [
    `<div class="ig-t ig-t--w"><b>Invertí en <em>Córdoba</em></b><i></i><small>Dirección experta, visión de futuro.</small></div>`,
    `<div class="ig-t ig-t--p" style="background-image:url(${FOTO}/casa-h.webp)"></div>`,
    `<div class="ig-t ig-t--w"><b>Creamos proyectos <em>que perduran</em></b><i></i><small>Calidad, diseño y visión a largo plazo.</small></div>`,
    `<div class="ig-t ig-t--b"><b>Invertí hoy, asegurá tu futuro.</b><i></i></div>`,
    `<div class="ig-t ig-t--p" style="background-image:url(${FOTO}/casa-v.webp)"></div>`,
    `<div class="ig-t ig-t--b"><b>Desarrollos que impulsan comunidades.</b><i></i></div>`,
][n];

export function manualHTML() {
    return `
<div class="cb-manual cb-pending">

<section class="cb-hero" data-sec="hero" aria-label="Construcción del logo">
    <p class="cb-hero-top mono">Manual de marca // La marca</p>
    <div class="cb-hero-logo">${logoSVG({ layout: 'v', withGuides: true })}</div>
    <p class="cb-hero-bot mono"><span>Construcción del logo</span><button class="cb-replay" type="button" data-cursor-item data-cursor="Repetir">↻ Repetir</button></p>
</section>

<section class="cb-slide cb-anat" data-sec="anat">
    ${deco('cb-deco--l')}
    ${head('La marca')}
    <div class="cb-side">
        <h3 class="cb-title" data-in>Anatomía</h3>
        <p class="cb-copy" data-in>El logo está compuesto por tres partes que trabajan en conjunto. Su disposición no es arbitraria: el orden vertical jerarquiza primero lo visual, luego la identidad y finalmente el rubro.</p>
    </div>
    <div class="cb-anat-logo">${logoSVG({ layout: 'v' })}</div>
    <i class="cb-line" style="left:calc(var(--u)*1258);top:calc(var(--u)*374);width:calc(var(--u)*217)"></i>
    <i class="cb-line" style="left:calc(var(--u)*1258);top:calc(var(--u)*899);width:calc(var(--u)*217)"></i>
    <i class="cb-line cb-line--m" style="left:calc(var(--u)*450);top:calc(var(--u)*749);width:calc(var(--u)*290)"></i>
    <div class="cb-call" style="left:calc(var(--u)*1500);top:calc(var(--u)*290)" data-in><h4>Ícono del edificio</h4><p>Reinterpretación del edificio original, más simple y directo</p></div>
    <div class="cb-call" style="left:calc(var(--u)*88);top:calc(var(--u)*670)" data-in><h4>Monograma CB</h4><p>Letras de "Contigiani Briñón" unificadas en un solo signo</p></div>
    <div class="cb-call" style="left:calc(var(--u)*1500);top:calc(var(--u)*825)" data-in><h4>Descriptor de Rubro</h4><p>Bienes raíces, el sector en el que opera la empresa</p></div>
</section>

<section class="cb-slide cb-pal" data-sec="pal">
    ${head('La marca')}
    <div class="cb-side">
        <h3 class="cb-title cb-title--i" data-in>Paleta de color</h3>
        <p class="cb-copy" data-in>La paleta de colores se construye sobre el contraste y la solidez. El negro y el blanco definen la base de la identidad: autoridad, claridad y precisión. El azul incorpora profundidad institucional, mientras que el rojo actúa como color de acento para destacar información clave. Se trata de una paleta pensada para el mundo inmobiliario: sobria sin ser fría, directa sin ser genérica.</p>
    </div>
    <div class="cb-bands">
        ${COLORS.map(([n, hex, rgb, cmyk, k]) => `
        <button class="cb-band cb-band--${k}" type="button" data-hex="${hex}" data-cursor-item data-cursor="Copiar HEX" aria-label="Copiar ${n} ${hex}">
            <span class="cb-band-name">${n}</span>
            <span class="cb-band-data"><span><small>HEX</small>${hex}</span><span><small>RGB</small>${rgb}</span><span><small>CMYK</small>${cmyk}</span></span>
            <span class="cb-band-ok" aria-live="polite"></span>
        </button>`).join('')}
    </div>
</section>

<section class="cb-slide cb-typ" data-sec="typ">
    ${deco('cb-deco--r')}
    ${head('La marca')}
    <div class="cb-side">
        <h3 class="cb-title cb-title--i" data-in>Tipografía</h3>
        <h4 class="cb-sub" data-in>Montserrat</h4>
        <p class="cb-copy" data-in>La tipografía oficial de la marca es Montserrat, utilizada en tres pesos distintos según la jerarquía del contenido. Su geometría limpia y su legibilidad en cualquier tamaño la hacen ideal tanto para aplicaciones digitales como impresas. Regular para cuerpo de texto, Semi Bold para subtítulos y destacados, Extra Bold para titulares y elementos de alto impacto.</p>
    </div>
    <div class="cb-samples">
        ${SAMPLES.map(([n, k]) => `
        <div class="cb-sample cb-sample--${k}">
            <p class="cb-sample-n"><span class="cb-ln">${n}</span></p>
            <p class="cb-sample-t"><span class="cb-ln">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span><span class="cb-ln">abcdefghijklmnopqrstuvwxyz</span><span class="cb-ln">0123456789#+¡¿?*</span></p>
        </div>`).join('')}
    </div>
</section>

<section class="cb-slide cb-var" data-sec="var">
    ${deco('cb-deco--l')}
    ${head('Usos y variantes')}
    <div class="cb-side">
        <h3 class="cb-title cb-title--i" data-in>Variaciones de color</h3>
        <p class="cb-copy" data-in>Las versiones de color permiten adaptar la marca a distintos contextos y soportes manteniendo coherencia visual. El logo puede aplicarse en negro sobre fondo blanco, en blanco sobre fondo negro, o incorporando el Deep Navy y el Signal Red según la pieza. La combinación de colores siempre debe garantizar contraste suficiente para asegurar legibilidad.</p>
    </div>
    <div class="cb-rows">
        ${VARIANTS.map(([bg, v, h, ic]) => `
        <div class="cb-row cb-row--${bg}" data-in>
            <div class="cb-cell" style="color:${v}">${logoSVG({ layout: 'v' })}</div>
            <div class="cb-cell" style="color:${h}">${logoSVG({ layout: 'h' })}</div>
            <div class="cb-cell" style="color:${ic}">${logoSVG({ layout: 'icon' })}</div>
        </div>`).join('')}
    </div>
</section>

<section class="cb-slide cb-app cb-stat" data-sec="stat">
    ${head('Aplicaciones')}
    <h3 class="cb-title cb-title--i cb-app-title" data-in>Papelería</h3>
    <p class="cb-app-note" data-in>Usos ilustrativos</p>
    <div class="cb-stat-card cb-stat-card--f" data-in><div class="cb-card cb-card--f">${logoSVG({ layout: 'v' })}<i></i></div></div>
    <div class="cb-stat-card cb-stat-card--b" data-in>
        <div class="cb-card cb-card--b">
            <div class="cb-card-who"><b>MARTÍN CONTIGIANI</b><span>DIRECTOR COMERCIAL</span><i></i></div>
            <ul>
                <li>${icon('phone')}+54 11 1234 5678</li><li>${icon('mail')}martin@cbbienesraices.com</li>
                <li>${icon('globe')}www.cbbienesraices.com</li><li>${icon('pin')}Av. del Libertador 498, Piso 10<br>C1001ABR, Buenos Aires, Argentina</li>
            </ul><em></em>
            <i></i>
        </div>
    </div>
    <div class="cb-stat-sheet" data-in>
        <div class="cb-sheet">
            <div class="cb-sheet-head">
                <div class="cb-sheet-logo">${logoSVG({ layout: 'icon' })}</div>
                <p><b>CONTIGIANI<br>BRIÑÓN</b><span>BIENES RAÍCES</span></p>
                <div class="cb-sheet-rule"><i></i><small>DESARROLLAMOS<br>FUTURO</small></div>
            </div>
            ${deco('cb-sheet-wm')}
            <div class="cb-sheet-foot"><i></i><p>${icon('pin')}Av. del Libertador 498, Piso 10 · C1001ABR, Argentina</p><p>${icon('phone')}+54 11 1234 5678</p><p>${icon('mail')}info@cbbienesraices.com</p><p>${icon('globe')}www.cbbienesraices.com</p></div>
        </div>
    </div>
</section>

<section class="cb-slide cb-app cb-sign" data-sec="sign" style="--bg:url(${FOTO}/casa-h.webp)">
    <div class="cb-sign-bg"></div>
    ${head('Aplicaciones')}
    <h3 class="cb-title cb-title--i cb-app-title cb-on-photo" data-in>Cartelería</h3>
    <p class="cb-app-note cb-on-photo" data-in>Usos ilustrativos</p>
    <div class="cb-sign-wrap" data-in>
        <div class="cb-sign-3d">
            <i class="cb-post-l"></i><i class="cb-post-r"></i><i class="cb-post-bar"></i>
            <div class="cb-board">
                <div class="cb-board-top">
                    <div class="cb-board-logo">${logoSVG({ layout: 'v', tag: false })}</div>
                    <p><b>CONTIGIANI<br>BRIÑÓN</b><span>BIENES RAÍCES</span></p>
                </div>
                <i class="cb-board-rule"></i>
                <p class="cb-board-big">EN VENTA</p>
                <p class="cb-board-sub">CASA PREMIUM <u></u> VALLE ESCONDIDO</p>
                <p class="cb-board-tel">${icon('phone')}351 769 0010</p>
                <p class="cb-board-web">contigianibrinon.com.ar</p>
            </div>
        </div>
    </div>
</section>

<section class="cb-slide cb-app cb-posts" data-sec="posts">
    ${head('Aplicaciones')}
    <h3 class="cb-title cb-title--i cb-app-title" data-in>Digital</h3>
    <p class="cb-app-note" data-in>Usos ilustrativos</p>
    <div class="cb-posts-h" data-in>${postH()}</div>
    <div class="cb-posts-v cb-posts-v--a" data-in>${postV('house')}</div>
    <div class="cb-posts-v cb-posts-v--b" data-in>${postV('pool')}</div>
</section>

<section class="cb-slide cb-app cb-ig" data-sec="ig">
    ${head('Aplicaciones')}
    <h3 class="cb-title cb-title--i cb-app-title" data-in>Digital</h3>
    <p class="cb-app-note" data-in>Usos ilustrativos</p>
    <div class="cb-phone-wrap" data-in>
        <div class="cb-phone">
            <div class="cb-screen"><div class="ig-in">
                <p class="ig-bar"><span>‹</span> Contigiani Briñón Bienes Raices <span>⋯</span></p>
                <div class="ig-top">
                    <div class="ig-av">${logoSVG({ layout: 'icon' })}</div>
                    <p><b>337</b>publicaciones</p><p><b>1.286</b>seguidores</p><p><b>164</b>seguidos</p>
                </div>
                <div class="ig-bio"><b>Contigiani Briñón Bienes Raices</b><span>Bienes raíces</span>Desarrollos - Inversiones - Experiencia<br>Creamos valor. Conectamos oportunidades.<br>${icon('pin')}Córdoba, Argentina<br><a>contigianibrinon.com</a></div>
                <div class="ig-btns"><i>Seguir</i><i class="g">Mensaje</i></div>
                <div class="ig-hl">${[['building', 'Desarrollos'], ['crane', 'Proyectos'], ['chart', 'Inversiones'], ['people', 'Nosotros']].map(([ic, n]) => `<p><span>${icon(ic)}</span>${n}</p>`).join('')}</div>
                <div class="ig-grid">${[0, 1, 2, 3, 4, 5].map(igTile).join('')}</div>
            </div></div>
        </div>
    </div>
</section>

</div>`;
}

// ---------------------------------------------------------------------------------------------------------

const loadFonts = () => loadFontsFrom(
    'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,800;1,600&display=swap',
    ['400 1em Montserrat', '600 1em Montserrat', '800 1em Montserrat', 'italic 600 1em Montserrat'],
    'BIENES RAÍCES',
);

/** Conecta el manual ya insertado en `root`: carga la tipografía, deja todo en su estado inicial y anima al entrar en pantalla. */
export async function mountManual(root) {
    const m = root.querySelector('.cb-manual');
    const cleanups = [];
    const tls = [];
    let alive = true;

    // Copiar HEX (funciona aunque no haya animaciones).
    const onClick = async (e) => {
        const b = e.target.closest('.cb-band');
        if (!b) return;
        try { await navigator.clipboard.writeText(b.dataset.hex); } catch { /* sin permiso: no pasa nada */ }
        const ok = b.querySelector('.cb-band-ok');
        ok.textContent = 'Copiado';
        gsap.fromTo(ok, { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.9, delay: 0.6, ease: 'power2.in' });
    };
    m.addEventListener('click', onClick);
    cleanups.push(() => m.removeEventListener('click', onClick));

    await loadFonts();
    if (!alive) return () => {};
    if (reduced) { m.classList.remove('cb-pending'); return () => m.removeEventListener('click', onClick); }
    m.classList.add('is-anim');

    const sec = (k) => m.querySelector(`[data-sec="${k}"]`);
    const when = [];
    const add = (tl) => { tls.push(tl); return tl; };

    // 1 · Construcción del logo
    const hero = sec('hero');
    const heroTl = add(heroTimeline(hero.querySelector('svg')));
    const seek = import.meta.env.DEV ? new URLSearchParams(location.search).get('cbt') : null; // solo en dev: ?cbt=2.1 deja el hero en ese segundo
    if (seek !== null) heroTl.time(Number(seek)); else when.push([hero, () => heroTl.play()]);
    const replay = () => heroTl.restart();
    hero.querySelector('.cb-replay').addEventListener('click', replay);

    // 2 · Anatomía: cada parte se enciende mientras se dibuja su línea
    const anat = sec('anat');
    const anatTl = add(enterTimeline(anat));
    const al = anat.querySelector('.cb-anat-logo');
    const parts = [al.querySelector('.cb-icon'), al.querySelector('.cb-mono'), al.querySelector('.cb-tag')];
    const lines = [...anat.querySelectorAll('.cb-line')]; // ícono, rubro, monograma
    gsap.set(parts, { opacity: 0.14 });
    gsap.set(lines, { '--p': 0 });
    anatTl.to(parts[0], { opacity: 1, duration: 0.6 }, 0.5).to(lines[0], { '--p': 1, duration: 0.9, ease: 'power2.inOut' }, 0.5)
        .to(parts[1], { opacity: 1, duration: 0.6 }, 1.1).to(lines[2], { '--p': 1, duration: 0.9, ease: 'power2.inOut' }, 1.1)
        .to(parts[2], { opacity: 1, duration: 0.6 }, 1.7).to(lines[1], { '--p': 1, duration: 0.9, ease: 'power2.inOut' }, 1.7);
    when.push([anat, () => anatTl.play()]);

    // 3 · Paleta: bandas que entran deslizando
    const pal = sec('pal');
    const palTl = add(enterTimeline(pal));
    const bands = [...pal.querySelectorAll('.cb-band')];
    gsap.set(bands, { xPercent: 30, opacity: 0 });
    palTl.to(bands, { xPercent: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.3);
    when.push([pal, () => palTl.play()]);

    // 4 · Tipografía: cada línea se descubre con un barrido; el ícono de fondo se dibuja
    const typ = sec('typ');
    const typTl = add(enterTimeline(typ));
    const lns = [...typ.querySelectorAll('.cb-ln')];
    const decoP = [...typ.querySelectorAll('.cb-deco .cb-p')];
    gsap.set(lns, { clipPath: 'inset(-10% 100% -10% 0)' });
    gsap.set(decoP, { strokeDasharray: '100 200', strokeDashoffset: 100 });
    typTl.to(lns, { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.9, stagger: 0.09, ease: 'power3.inOut' }, 0.3)
        .to(decoP, { strokeDashoffset: 0, duration: 2.2, stagger: 0.12, ease: 'power2.inOut' }, 0.2);
    when.push([typ, () => typTl.play()]);

    // 5 · Variaciones: filas en cascada, cada logo se construye
    const vr = sec('var');
    const varTl = add(enterTimeline(vr, { y: 0, stagger: 0.14 }));
    const minis = [...vr.querySelectorAll('.cb-cell svg')].map((s, i) => add(miniTimeline(s, 0.25 + i * 0.07)));
    const vdeco = [...vr.querySelectorAll('.cb-deco .cb-p')];
    gsap.set(vdeco, { strokeDasharray: '100 200', strokeDashoffset: 100 });
    varTl.to(vdeco, { strokeDashoffset: 0, duration: 2, stagger: 0.1, ease: 'power2.inOut' }, 0.2);
    when.push([vr, () => { varTl.play(); minis.forEach((t) => t.play()); }]);

    // 6–9 · Aplicaciones: las piezas entran en cascada y sus logos se construyen
    for (const k of ['stat', 'sign', 'posts', 'ig']) {
        const s = sec(k);
        const t = add(enterTimeline(s, { stagger: 0.16, duration: 1 }));
        const logos = [...s.querySelectorAll('.cb-logo')].filter((l) => !l.closest('.cb-deco'));
        const mt = logos.map((l, i) => add(miniTimeline(l, 0.5 + i * 0.08)));
        when.push([s, () => { t.play(); mt.forEach((x) => x.play()); }]);
    }

    m.classList.remove('cb-pending');
    cleanups.push(onceInView(when, { threshold: 0.3 }));

    return () => {
        alive = false;
        cleanups.forEach((fn) => fn());
        hero.querySelector('.cb-replay')?.removeEventListener('click', replay);
        tls.forEach((t) => t.kill());
    };
}
