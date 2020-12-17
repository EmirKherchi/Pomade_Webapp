#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform float opacity;
uniform vec3 color;
uniform sampler2D texture;
varying vec2 vUv;
varying vec2 vMouse;
float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}
void main() {
  vec3 sample = 1.0 - texture2D(texture, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0) * opacity;
  gl_FragColor = vec4(color, alpha);
  if (alpha < 0.001) discard;
}
