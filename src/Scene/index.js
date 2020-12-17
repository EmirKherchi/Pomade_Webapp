import {
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  sRGBEncoding
  // Color
} from "three";

import { Power2 as Ease } from "gsap";
// import PostProcessing from "@/Scene/Postprocessing/index";

export const API = {
  gamma: 2.2,
  color: 0x000000,
  // clearColor: 0x0000ff,
  pixelRatio: Math.min(window.devicePixelRatio, 2.0),
  camera: {
    position: new Vector3(0, 0, 2.5)
  },
  mouse: {
    position: new Vector2(0, 0),
    target: new Vector2(0, 0)
  }
};

const extents = new Vector2(0.0);
export default class App {
  constructor({ $el }) {
    this.components = {};
    this.sizes = {
      extents,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      110,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.01,
      50
    );

    this.camera.layers.enable(3);
    this.camera.position.copy(API.camera.position);

    var canvas = $el;
    this.renderer = new WebGLRenderer({
      canvas: canvas,
      alpha: false,
      stencil: false,
      depth: false,
      powerPreference: "high-performance",
      antialias: false
    });
    this.renderer.gammaFactor = API.gamma;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setPixelRatio(API.pixelRatio);
    this.renderer.setClearColor(API.clearColor);

    this.y = this.handleMousemove.bind(this);
    window.addEventListener("mousemove", this.y, { passive: true });
  }
  handleMousemove(e) {
    API.mouse.position.x = (e.pageX / this.sizes.viewport.width) * 2 - 1;
    API.mouse.position.y = -(e.pageY / this.sizes.viewport.height) * 2 + 1;
  }
  getExtents(distance = this.camera.position.z) {
    this.sizes.extents.y =
      Math.tan(((this.camera.fov * Math.PI) / 180) * 0.5) * distance * 2;
    this.sizes.extents.x = this.sizes.extents.y * this.camera.aspect;
    this.sizes.extents.d =
      Math.sqrt(
        Math.pow(this.sizes.extents.x, 2) + Math.pow(this.sizes.extents.y, 2)
      ) * 0.5;
  }
  lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }
  render() {
    const lx = Ease.easeIn(1.0 - Math.abs(API.mouse.position.x));
    const ly = Ease.easeIn(1.0 - Math.abs(API.mouse.position.y));
    API.mouse.target.x = this.lerp(
      API.mouse.target.x,
      API.mouse.position.x,
      0.01 + lx * 0.18
    );
    API.mouse.target.y = this.lerp(
      API.mouse.target.y,
      API.mouse.position.y,
      0.01 + ly * 0.18
    );
    this.renderer.render(this.scene, this.camera);
    // this.postprocessing.render();
  }
  handleResize() {
    this.sizes.viewport.width = window.innerWidth;
    this.sizes.viewport.height = window.innerHeight;
    this.sizes.viewport.halfWidth = this.sizes.viewport.width * 0.5;
    this.sizes.viewport.halfHeight = this.sizes.viewport.height * 0.5;
    this.camera.aspect = this.sizes.viewport.width / this.sizes.viewport.height;
    this.camera.updateProjectionMatrix();
    this.getExtents();
    this.renderer.setSize(
      this.sizes.viewport.width,
      this.sizes.viewport.height
    );
    // this.postprocessing.handleResize(this.sizes);
    return this.sizes;
  }
  dispose() {
    window.cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
  }
}
