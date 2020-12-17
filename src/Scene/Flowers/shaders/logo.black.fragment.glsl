precision mediump float;

uniform sampler2D map;
uniform float offset;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
  vec4 texel = texture2D(map, vUv);
  vec4 color = vec4(1.0);
  float grexel = uv.y + tan(-mix(0.5125, 0.25, offset)) * uv.x;
  float clip = step(grexel, mix(-0.625, 1.0, offset));

  
  // float alpha = texel.a;
  // // float alpha = color.a;
  
  // if (alpha < 0.001) {
  //   discard;
  // }
	gl_FragColor = vec4(vec3(0.0), texel.a * clip);
}
