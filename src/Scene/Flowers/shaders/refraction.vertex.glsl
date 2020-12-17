precision mediump float;
attribute float lightIncidence;

attribute vec2 uv;
attribute vec3 normal;
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform vec3 cameraPosition;

varying float ligthIndice;
varying vec2 vUv;
varying vec3 worldNormal;
varying vec3 viewDirection;

void main() {
  vUv = uv;
  ligthIndice = lightIncidence;
	vec4 worldPosition = modelMatrix * vec4( position, 1.0);
	worldNormal = normalize( modelViewMatrix * vec4(normal, 0.)).xyz;
	viewDirection = normalize(worldPosition.xyz - cameraPosition);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
