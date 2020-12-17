import { RawShaderMaterial } from "three";
import vertexShader from "./shaders/refraction.vertex.glsl";
import fragmentShader from "./shaders/refraction.fragment.glsl";

export default class RefractionMaterial {
  constructor(options) {
    const item = {
      uniforms: {
        envMap: { value: options.envMap },
        resolution: { value: options.resolution },
        accentuation: { value: 0.0 },
        lightStep: { value: 0.9 },
        offset: { value: 0.0 },
        rgbshift: { value: 1.0 }
      },
      transparent: true,
      depthTest: false,
      vertexShader,
      fragmentShader
    }
    return new RawShaderMaterial(item);
  }
}
