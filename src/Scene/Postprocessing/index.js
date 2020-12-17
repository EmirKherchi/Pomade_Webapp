import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";

export default class PostProcessing {
  constructor({ renderer, scene, camera }) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.passes = {};
    this.composers = {};

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.rgbPass = new ShaderPass(RGBShiftShader);
    this.rgbPass.uniforms["amount"].value = 0.003125;
    // rgbPass.uniforms["amount"].value = 0.0;

    this.composer.addPass(this.rgbPass);
  }
  render() {
    this.composer.render();
  }
  dispose() {
    this.composer.reset();
  }
  handleResize(sizes) {
    this.composer.setSize(sizes.viewport.width, sizes.viewport.height);
  }
}
