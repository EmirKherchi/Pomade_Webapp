<template>
  <div class="canvas-holder">
    <canvas ref="canvas" />
  </div>
</template>
<script>
import Resize from "@/mixins/Resize/index.js";

import gsap from "gsap";
import Scene from "@/Scene/index";
import Flowers from "@/Scene/Flowers/index";
import Board from "@/Scene/Board/index";
import Text from "@/Scene/Text/index";
import Menu from "@/Scene/Menu/index";
import Loader from "@/Scene/Loader.js";

export default {
  name: "Scene",
  mixins: [Resize],
  mounted() {
    // var canvas = this.$refs.canvas;
    // var gl = canvas.getContext("webgl");
    // gl.getExtension("OES_standard_derivatives");

    this.lastPos = 0;
    this.loader = new Loader();
    this.app = new Scene({
      $el: this.$refs.canvas
    });
    this.app.camera.layers.disable(0);
    this.flowers = new Flowers({
      scene: this.app.scene,
      loader: this.loader,
      renderer: this.app.renderer,
      camera: this.app.camera
    });

    this.text = new Text({
      scene: this.app.scene,
      loader: this.loader
    });

    this.board = new Board({
      scene: this.app.scene,
      loader: this.loader
    });

    this.menu = new Menu({
      scene: this.app.scene
    });

    gsap.ticker.add(this.handleRender);

    this.onResized(this.resize.width, this.resize.height);

    // this.loader.manager.onLoad = () => {
    //   this.tl = new gsap.timeline();
    //   this.tl.add(this.flowers.enter());
    // };
  },
  beforeDestroy() {
    gsap.ticker.remove(this.handleRender);
    this.app.dispose();
  },
  methods: {
    handleRender(t) {
      this.flowers.detla = Math.min(
        Math.abs((this.flowers.groupLeftOffsetY - this.lastPos) / 0.1),
        1.0
      );
      this.lastPos = this.flowers.groupLeftOffsetY;
      this.text.render(t);
      this.flowers.render(t);
      this.board.render(t);
      this.menu.render(t);
      this.app.render(t);
    },
    onResized() {
      const sizes = this.app.handleResize();
      this.flowers.handleResize(sizes);
      this.text.handleResize(sizes);
      this.board.handleResize(sizes);
      this.menu.handleResize(sizes);
    }
  }
};
</script>

<style lang="scss" scoped>
.canvas-holder {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f9f7f5;
  z-index: -1;
  canvas {
    display: block;
    width: 100%;
    height: 120%;
  }
}
</style>
