// Full-screen dither wipe. uProgress 0 = clear, 1 = fully covered.
// Threshold = Bayer cell blended with a vertical sweep, so it reads as a dissolving curtain.
uniform vec3 uColor;
uniform float uProgress, uCell, uDir;
varying vec2 vUv;

void main() {
    vec2 c = floor(gl_FragCoord.xy / uCell);
    float sweep = mix(vUv.y, 1.0 - vUv.y, uDir);
    float thresh = mix(bayer8(c), sweep, 0.55);
    if (uProgress <= thresh) discard;
    gl_FragColor = vec4(uColor, 1.0);
}
