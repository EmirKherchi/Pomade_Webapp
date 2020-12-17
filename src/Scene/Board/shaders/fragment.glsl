precision lowp float;
uniform float offset;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
  vec4 color = vec4(1.0);
  float texel = uv.y + tan(-mix(0.5125, 0.25, offset)) * uv.x;
  float clip = step(texel, mix(-0.625, 1.0, offset));

  // if (color.a < 0.001) {
  //   discard;
  // }
	gl_FragColor = color * clip;
}
