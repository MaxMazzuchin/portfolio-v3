// Caballo de la transición: cuadro uFrame de la grilla (scripts/horse-sprite.mjs) pintado en 1 bit con Bayer 8x8.
// El alfa del sprite es el "brillo" del trazo; uReveal (0..1) lo hace aparecer / desaparecer con el mismo patrón.
uniform sampler2D uTex;
uniform vec3 uColor;
uniform vec2 uGrid;
uniform float uCell, uReveal, uFrame;
varying vec2 vUv;

void main() {
    vec2 cell = vec2(mod(uFrame, uGrid.x), floor(uFrame / uGrid.x));
    float a = texture2D(uTex, (cell + vUv) / uGrid).a;
    if (a * uReveal <= bayer8(floor(gl_FragCoord.xy / uCell))) discard;
    gl_FragColor = vec4(uColor, 1.0);
}
