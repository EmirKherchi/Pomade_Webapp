precision mediump float;
attribute vec2 uv;
attribute vec4 position;
uniform float scale;
uniform vec2 resolution;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;
// varying vec2 responsive;
varying float diff;

#define rat 4.0

void main() {
  vUv = uv * scale - vec2((scale - 1.0) * 0.5);

  diff = resolution.x / resolution.y / rat;
  
  vec4 pos = projectionMatrix * modelViewMatrix * position;
	gl_Position = pos;
}