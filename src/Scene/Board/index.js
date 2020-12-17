import {
  PlaneBufferGeometry,
  RawShaderMaterial,
  // MeshBasicMaterial,
  Mesh,
  Uniform,
  Vector2
} from "three";

import gsap from "gsap";
import { API } from "@/Scene/index";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default class Board {
  constructor({ scene, loader, renderer, camera }) {
    this.loader = loader;
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.setBoard();
  }
  setBoard() {
    this.backgroundMaterial = new RawShaderMaterial({
      transparent: true,
      uniforms: {
        offset: new Uniform(0.0),
        resolution: new Uniform(new Vector2(0.0, 0.0))
      },
      vertexShader,
      fragmentShader
    });
    this.geometry = new PlaneBufferGeometry(20, 20, 1);
    this.bg = new Mesh(this.geometry, this.backgroundMaterial);
    this.bg.layers.set(1);
    this.bg.renderOrder = 3.0;
    this.scene.add(this.bg);
  }
  enter() {
    const helper = {
      y: this.backgroundMaterial.uniforms.offset.value
    };
    this.tl = new gsap.timeline();
    this.tl.to(helper, {
      duration: 2.0,
      y: 1.0,
      ease: "quint.inOut",
      onUpdate: () => {
        this.backgroundMaterial.uniforms.offset.value = helper.y;
      }
    });
  }
  leave() {
    const helper = {
      y: this.backgroundMaterial.uniforms.offset.value
    };
    const tl = new gsap.timeline();
    tl.to(helper, {
      duration: 2.,
      y: 0.0,
      ease: "expo.out",
      onUpdate: () => {
        this.backgroundMaterial.uniforms.offset.value = helper.y;
      }
    });
    return tl;
  }
  updateMaterial(y) {
    this.backgroundMaterial.uniforms.offset.value = y;
  }
  render() {}
  handleResize(sizes) {
    this.sizes = sizes;
    const width = sizes.viewport.width * API.pixelRatio;
    const height = sizes.viewport.height * API.pixelRatio;
    this.backgroundMaterial.uniforms.resolution.value = [width, height];
  }
  dispose() {}
}
