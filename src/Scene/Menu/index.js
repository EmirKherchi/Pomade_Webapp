import {
  PlaneBufferGeometry,
  RawShaderMaterial,
  Mesh,
  Uniform,
  Vector2,
  Group
} from "three";

import gsap from "gsap";
import { API } from "@/Scene/index";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default class Menu {
  constructor({ scene }) {
    this.scene = scene;
    this.setBoard();
  }
  setBoard() {
    this.group = new Group();

    this.backgroundMaterial = new RawShaderMaterial({
      transparent: true,
      uniforms: {
        offset: new Uniform(0.0),
        resolution: new Uniform(new Vector2(0.0, 0.0))
      },
      vertexShader,
      fragmentShader,
      depthTest: false
    });

    this.geometry = new PlaneBufferGeometry(1, 1, 1);
    this.line = new Mesh(this.geometry, this.backgroundMaterial);
    this.line.layers.set(3);
    this.group.add(this.line);
    this.group.layers.set(3);
    this.group.renderOrder = 6;

    this.burgerLines = [this.line.clone(), this.line.clone()];

    this.burgerLines[0].layers.set(3);
    this.burgerLines[1].layers.set(3);
    this.group.add(this.burgerLines[0]);
    this.group.add(this.burgerLines[1]);
    this.scene.add(this.group);
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
      duration: 2.0,
      y: 0.0,
      ease: "expo.out",
      onUpdate: () => {
        this.backgroundMaterial.uniforms.offset.value = helper.y;
      }
    });
    return tl;
  }
  render() {}
  handleResize(sizes) {
    this.sizes = sizes;
    this.group.position.x = -this.sizes.extents.x * 0.5;
    const width = sizes.viewport.width * API.pixelRatio;
    const height = sizes.viewport.height * API.pixelRatio;
    this.backgroundMaterial.uniforms.resolution.value = [width, height];
    this.marginX = (32 / width) * this.sizes.extents.width;
    const marginY = ((74 * 2) / width) * this.sizes.extents.width;
    const oY = ((85 * 2) / width) * this.sizes.extents.width;
    this.burgerWidth = ((18 * 2) / width) * this.sizes.extents.width;
    const lineHeihgt = (4 / width) * this.sizes.extents.width;

    this.lineWidth = this.sizes.extents.x * 0.1525 - this.marginX;
    this.line.scale.x = this.lineWidth;
    this.line.scale.y = lineHeihgt;
    this.line.position.x = this.lineWidth * 0.5 + this.marginX;
    this.line.position.y = -oY;
    this.x = this.lineWidth + this.marginX;
    const burgerLinesHeight = lineHeihgt * 1.5;
    this.burgerLines[0].scale.x = this.burgerWidth;
    this.burgerLines[1].scale.x = this.burgerWidth;
    this.burgerLines[0].scale.y = burgerLinesHeight;
    this.burgerLines[1].scale.y = burgerLinesHeight;
    this.burgerLines[0].position.y = marginY - oY;
    this.burgerLines[1].position.y = marginY + burgerLinesHeight * 2 - oY; 
    this.burgerLines[0].position.x = this.x - this.burgerWidth * 0.5;
    this.burgerLines[1].position.x = this.x - this.burgerWidth * 0.5;
  }
  dispose() {}
}
