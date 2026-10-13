// Display type rendered from a 2D-canvas coverage texture, filled with an ordered dither.
uniform sampler2D uTex;
uniform vec3 uFg;
uniform vec2 uMouse;
uniform float uTime, uCell, uReveal;
varying vec2 vUv;

void main() {
    float a = texture2D(uTex, vUv).a;
    if (a < 0.02) discard;

    vec2 c = floor(gl_FragCoord.xy / uCell);
    float flow = 0.5 + 0.5 * sin(vUv.x * 7.0 + uTime * 0.4) * sin(vUv.y * 4.0 - uTime * 0.3);
    float v = a * mix(0.5, 1.0, flow * 0.55 + (1.0 - vUv.y) * 0.45);

    // The cursor solidifies the type in a small spot (~70 css px), not a big cloud.
    float m = distance(gl_FragCoord.xy, uMouse);
    v = mix(v, a, (1.0 - smoothstep(0.0, 70.0 * uCell / 3.0, m)) * 0.95);

    v *= uReveal;
    if (v <= bayer8(c)) discard;
    gl_FragColor = vec4(uFg, 1.0);
}
