precision mediump float;

uniform sampler2D envMap;
uniform float offset;
uniform float rgbshift;
uniform float accentuation;
uniform float lightStep;
uniform vec2 resolution;

varying float ligthIndice;
varying vec2 vUv;
varying vec3 worldNormal;
varying vec3 viewDirection;

float gamma = 2.0;

float ior = 2.0;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 normal = worldNormal;
	vec3 refracted = refract(viewDirection, normal, 1.0/ior);
	vec2 ruv = (uv + refracted.xy) / 2.0  + 0.25;

  float shift = mix(0.0, 0.00625, rgbshift);
  float r = texture2D(envMap, ruv + vec2 (-shift * ruv.x, shift * ruv.y), 1.0).r;
  float g = texture2D(envMap, ruv                                     , 1.0).g;
  float b = texture2D(envMap, ruv + vec2 (shift * ruv.x, -shift * ruv.y), 1.0).b;
	vec3 color = vec3(r, g, b);
  
  float texel = uv.y + tan(-0.525) * uv.x;
  float clip = smoothstep(texel, texel + 0.005, mix(-0.625, 1.0, offset));
  
  color = mix(color, color * 1.625, smoothstep(lightStep, lightStep + 0.0125, vUv.y) * ligthIndice);

  if (clip < 0.001) {
    discard;
  }
	gl_FragColor = vec4(color, clip);
}