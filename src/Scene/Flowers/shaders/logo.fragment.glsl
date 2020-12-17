precision mediump float;

uniform sampler2D map;
uniform float shift;
uniform float reverse;
uniform float lightStep;
uniform float inverse;
uniform vec2 resolution;
varying vec2 vUv;
varying float diff;

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
  

  vec2 limit = uv;
  limit.x *= diff;
  limit.x += (1.0 - diff) * 0.5;
  
  limit -= vec2(0.5);
  limit = rotate2d(PI * 0.30825) * limit;
  limit += vec2(0.5);

  float cutout = step(limit.y, 0.6275);
  float realcutout = mix(cutout, 1.0 - cutout, reverse);

  if (realcutout < 0.5) {
    discard;
  }
  float b = step(limit.y, 0.4) * (1.0 - step(limit.y, 0.2));
  float d = step(limit.y, 0.6275) * (1.0 - step(limit.y, 0.60625 - lightStep));
  float clip = 1.0 - b;
  float realclip = (mix(clip, 1.0 - clip, shift));

  vec2 tUv = vUv;
  tUv.x += 0.3625 * d;
  // tUv.y += -0.167 * d;
  vec4 texel = texture2D(map, tUv);
  float alpha = mix(0.0, texel.a * realclip, realcutout);
  // float alpha = color.a;
  
  if (alpha < 0.001) {
    discard;
  }
	gl_FragColor = vec4(vec3(1.0 - inverse), alpha);
}
