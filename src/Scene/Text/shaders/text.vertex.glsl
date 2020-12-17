precision mediump float;
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 pos = projectionMatrix * modelViewMatrix * position;
	gl_Position = pos;
}