precision lowp float;
uniform float offset;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
  float texel = uv.y + tan(-mix(0.5125, 0.25, offset)) * uv.x;
  float clip = step(texel, mix(-0.625, 1.0, offset));

	gl_FragColor = vec4(vec3(1.0 - clip), 1.0);
}
