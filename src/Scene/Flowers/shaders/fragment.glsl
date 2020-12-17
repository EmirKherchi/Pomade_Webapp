precision mediump float;
uniform sampler2D map;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(map, vUv);
  if (color.a < 0.001) {
    discard;
  }
	gl_FragColor = color;
}
