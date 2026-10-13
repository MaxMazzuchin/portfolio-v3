// Clean colour image, cover-fit, with a light scroll-velocity wave. No hover zoom.
// uBorder > 0 draws a flat frame of that many px (used by the wheel cards).
uniform sampler2D uTex;
uniform vec3 uBorderColor;
uniform vec2 uImg, uSize;
uniform float uReveal, uVel, uBorder, uAlpha;
varying vec2 vUv;

void main() {
    vec2 px = vUv * uSize;
    float edge = min(min(px.x, uSize.x - px.x), min(px.y, uSize.y - px.y));
    float a = uReveal * uAlpha;

    if (edge < uBorder) {
        gl_FragColor = vec4(uBorderColor, a);
        return;
    }

    vec2 inner = uSize - 2.0 * uBorder;
    vec2 iuv = (px - uBorder) / inner;
    vec2 s = inner / uImg;
    float k = max(s.x, s.y);
    vec2 uv = (iuv - 0.5) * (inner / (uImg * k));

    float z = 1.0 - 0.07 * (1.0 - uReveal);
    uv = uv * z + 0.5;
    uv.y += clamp(uVel, -60.0, 60.0) * 0.0005 * sin(vUv.x * 3.14159);

    vec4 col = texture2D(uTex, uv);
    gl_FragColor = vec4(col.rgb, col.a * a);
}
