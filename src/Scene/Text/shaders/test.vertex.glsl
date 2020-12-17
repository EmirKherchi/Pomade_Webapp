precision mediump float;
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform vec2 resolution;

varying vec2 vUv;
varying float diff;

#define rat 4.0

void main() {
  vUv = uv;

  diff = resolution.x / resolution.y / rat;
  
  vUv = uv;
  vec4 pos = projectionMatrix * modelViewMatrix * position;
	gl_Position = pos;
}