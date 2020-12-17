import gsap from "gsap";
import {
  RawShaderMaterial,
  PlaneBufferGeometry,
  Mesh,
  Group,
  Vector2,
  Uniform
} from "three";

import TestFragment from "./shaders/test.fragment.glsl";
import TestVertex from "./shaders/test.vertex.glsl";

import { API } from "@/Scene/index";

export default class Flowers {
  constructor({ scene, loader }) {
    this.pristine = true;
    this.scene = scene;
    // this.createText();

    const geometry = new PlaneBufferGeometry(8, 4.0, 1.0);
    const material = new RawShaderMaterial({
      uniforms: {
        texture: {
          type: "t",
          value: loader.loadTexture("/assets/textures/main-text.png")
        },
        progress: new Uniform(0),
        resolution: new Uniform(
          new Vector2(
            window.innerWidth * API.pixelRatio,
            window.innerHeight * API.pixelRatio
          )
        )
      },
      vertexShader: TestVertex,
      fragmentShader: TestFragment,
      transparent: true,
      depthTest: false
    });
    this.text = new Mesh(geometry, material);
    this.text.layers.set(0);
    this.text.position.y = -10;
    this.text.renderOrder = 2;
    this.anchor = new Group();
    this.anchor.add(this.text);
    this.scene.add(this.anchor);
    this.followers = [];
  }
  reset() {
    this.followers = [];
    this.text.position.y = -1 * this.sizes.extents.y;
  }
  follow({ from, to, progress = false, ease = "circ.out" }) {
    const helper = {
      y: 0
    };
    this.followers.push(from);
    const idx = this.followers.length - 1;
    const tl = new gsap.timeline({
      onUpdate: () => {
        this.followers[idx] = helper.y;
        if (progress) {
          // console.log(this.text.material.uniforms.progress.value);
          this.text.material.uniforms.progress.value =
            tl.progress() * 1.625 * 0.625;
        }
      }
    }).fromTo(
      helper,
      {
        y: from
      },
      {
        y: to,
        ease
      },
      "a"
    );
    return tl;
  }
  render() {
    this.text.position.y =
      this.followers.reduce((a, b) => a + b, 0) * this.sizes.extents.y;
    this.text.rotation.y = API.mouse.target.x * Math.PI * 0.00625 * 1.5;
    this.text.rotation.x = API.mouse.target.y * -Math.PI * 0.00625;
  }
  handleResize(sizes) {
    this.sizes = sizes;
    if (this.pristine) {
      this.text.position.y = this.sizes.extents.y;
    }
    const width = sizes.viewport.width;
    const height = sizes.viewport.height;
    this.text.material.uniforms.resolution.value = [
      width * API.pixelRatio,
      height * API.pixelRatio
    ];
    this.pristine = false;
    if (width >= 768 && width < 1260) {
      this.text.position.x = sizes.extents.x * 0.1;
    } else {
      this.text.position.x = 0.0;
    }
    if (width < 768) {
      const s = this.sizes.extents.x / 8 - 0.03125;
      this.text.scale.x = s;
      this.text.scale.y = s;
    } else {
      this.text.scale.x = 1.0;
      this.text.scale.y = 1.0;
    }
  }
  dispose() {}
}
