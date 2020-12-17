precision mediump float;
uniform sampler2D texture;
uniform vec2 resolution;
uniform float progress;
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
  
  // float cutout = step(limit.y, 0.6825);
  float cutout = step(limit.y, 0.7);

  float clip = step(limit.y, mix(0.5, 0.3125, progress)) * (1.0 - step(limit.y, 0.2625));

  vec2 tUv = vUv;
  tUv.x += 0.05 * clip;
  tUv.y += 0.05 * clip;
  vec4 sample = texture2D(texture, tUv);
  float alpha = (sample.a - 0.3125 * clip) * cutout;

  if(alpha < 0.001) {
    discard;
  }

  gl_FragColor = vec4(sample.rgb, alpha);
}
