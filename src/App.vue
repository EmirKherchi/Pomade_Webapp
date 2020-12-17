<template>
  <div id="app">
    <Scene ref="scene" />
    <transition
      @enter="handleEnter"
      @leave="handleLeave"
      @:enter-cancelled="enterCancelled"
      @:leave-cancelled="leaveCancelled"
      :appear="true"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import Scene from "@/Scene/index.vue";

import gsap from "gsap";

export default {
  name: "App",
  components: {
    Scene
  },
  created() {
    this.offsetBoard = {
      y: 0,
      x: 0
    };
  },
  methods: {
    handleEnter(el, done) {
      this.enterTl?.kill();
      this.enterTl = new gsap.timeline({
        onComplete: done
      });

      if (this.$route.name === "Home") {
        this.$refs.scene.flowers.logoSmall.position.y = 0;
        this.$refs.scene.app.camera.layers.enable(0);
        this.$refs.scene.flowers.renderable = true;
        this.enterTl.add(this.$refs.scene.flowers.enter());
      } else {
        this.offsetBoard.x = 0;
        this.$refs.scene.flowers.blackLogo.position.x = 0;

        this.$refs.scene.flowers.blackLogo.position.y = this.$refs.scene.flowers.logoSmall.position.y;
        this.$refs.scene.app.camera.layers.enable(1);
        this.enterTl
          .set(
            el,
            {
              visibility: "hidden"
            },
            "a"
          )
          .to(
            this.offsetBoard,
            {
              duration: 1.5,
              y: 1.0,
              ease: "quint.inOut",
              onUpdate: () => {
                const { flowers, board, menu } = this.$refs.scene;
                board.backgroundMaterial.uniforms.offset.value = this.offsetBoard.y;
                menu.backgroundMaterial.uniforms.offset.value = this.offsetBoard.y;
                flowers.blackLogo.material.uniforms.offset.value = this.offsetBoard.y;
                const oy = Math.max(
                  flowers.logo.position.y + flowers.smallLogoY,
                  0.0
                );
                const fy =
                  oy +
                  (flowers.sizes.extents.y * 0.425 - oy) * this.offsetBoard.y;
                this.$refs.scene.flowers.blackLogo.position.y = fy;
                this.$refs.scene.flowers.logoSmall.position.y = fy;
              }
            },
            "a"
          )
          .to(
            this.offsetBoard,
            {
              x: 1,
              duration: 1,
              ease: "expo.out",
              onUpdate: () => {
                const { flowers, menu } = this.$refs.scene;
                flowers.blackLogo.position.x =
                  this.offsetBoard.x *
                    (-flowers.sizes.extents.x * 0.5 -
                      0.2 * 1.5 +
                      menu.x * 0.6) +
                  0.1 * this.offsetBoard.x;
                const ow = menu.lineWidth * (1.0 - 0.4 * this.offsetBoard.x);
                menu.line.scale.x = ow;
                menu.line.position.x =
                  menu.lineWidth * 0.5 +
                  menu.marginX -
                  menu.lineWidth * 0.4 * this.offsetBoard.x * 0.5;

                menu.burgerLines[0].position.x =
                  menu.x -
                  menu.burgerWidth * 0.5 -
                  menu.lineWidth * 0.4 * this.offsetBoard.x;
                menu.burgerLines[1].position.x =
                  menu.x -
                  menu.burgerWidth * 0.5 -
                  menu.lineWidth * 0.4 * this.offsetBoard.x;
              }
            },
            "b"
          )
          .set(el, { visibility: "visible" }, "b")
          .from(
            el.querySelector(".board-container"),
            {
              duration: 1.0,
              ease: "quint.out",
              y: window.innerHeight
            },
            "c"
          )
          .to(
            el.querySelectorAll(".before"),
            {
              duration: 1,
              ease: "quint.inOut",
              x: "-100%"
            },
            "c"
          )
          .to(
            el.querySelectorAll(".after"),
            {
              duration: 1,
              ease: "quint.inOut",
              x: "100%"
            },
            "c"
          )
          .from(
            el.querySelectorAll(".details"),
            {
              duration: 0.3,
              ease: "linear",
              alpha: 0
            },
            "c+=.7"
          );
      }
    },
    enterCancelled() {},
    leaveCancelled() {},
    handleLeave(el, done) {
      this.leaveTl?.kill();
      this.leaveTl = new gsap.timeline({
        onComplete: () => {
          if (el.classList.contains("work-page")) {
            this.$refs.scene.app.camera.layers.disable(1);
          }
          done();
        }
      });
      if (el.classList.contains("home-page")) {
        this.$refs.scene.flowers.renderable = false;
        this.leaveTl.to(el, {
          alpha: 0
        });
      } else {
        this.leaveTl
          .to(
            el.querySelectorAll(".before, .after"),
            {
              duration: 1,
              ease: "quint.inOut",
              x: "0%"
            },
            "c"
          )
          .to(
            el.querySelectorAll(".details"),
            {
              duration: 0.3,
              ease: "linear",
              alpha: 0
            },
            "c+=.7"
          )
          .set(
            el,
            {
              autoAlpha: 0
            },
            "a"
          )
          .to(
            this.offsetBoard,
            {
              duration: 2.0,
              y: 0.0,
              x: 0.0,
              ease: "expo.out",
              onUpdate: () => {
                const { menu } = this.$refs.scene;
                this.$refs.scene.board.backgroundMaterial.uniforms.offset.value = this.offsetBoard.y;
                this.$refs.scene.menu.backgroundMaterial.uniforms.offset.value = this.offsetBoard.y;
                this.$refs.scene.flowers.blackLogo.material.uniforms.offset.value = this.offsetBoard.y;

                menu.line.scale.x =
                  menu.lineWidth * (1.0 - 0.4 * this.offsetBoard.x);
                menu.line.position.x =
                  menu.lineWidth * 0.5 +
                  menu.marginX -
                  menu.lineWidth * 0.4 * this.offsetBoard.x * 0.5;

                menu.burgerLines[0].position.x =
                  menu.x -
                  menu.burgerWidth * 0.5 -
                  menu.lineWidth * 0.4 * this.offsetBoard.x;
                menu.burgerLines[1].position.x =
                  menu.x -
                  menu.burgerWidth * 0.5 -
                  menu.lineWidth * 0.4 * this.offsetBoard.x;
              }
            },
            "d"
          );
      }
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "MADECanvas";
  src: url("/assets/fonts/MADECanvasLight.woff2") format("woff2"),
    url("/assets/fonts/MADECanvasLight.woff") format("woff");
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: "MADECanvas";
  src: url("/assets/fonts/MADECanvas.woff2") format("woff2"),
    url("/assets/fonts/MADECanvas.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "DIN";
  src: url("/assets/fonts/DINAlternate-Bold.woff2") format("woff2"),
    url("/assets/fonts/DINAlternate-Bold.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "DIN";
  src: url("/assets/fonts/DINCondensed-Bold.woff2") format("woff2"),
    url("/assets/fonts/DINCondensed-Bold.woff") format("woff");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "DIN", sans-serif;
  overflow: hidden;
}

.underline {
  overflow: hidden;
  position: relative;
  display: inline-block;
  cursor: pointer;
  &:before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateX(100%);
    margin-right: 1px;
    opacity: 0;
    background-color: #ffffff;
    transition: opacity 0s 0.3125s, transform 0.3125s;
    will-change: opacity, transform;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    margin-left: -1px;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #ffffff;
    transform: translateX(-100%);
    transition: opacity 0s 0.3125s, transform 0.3125s ease;
    will-change: opacity, transform;
  }
  &:hover,
  &.active,
  &.router-link-active,
  .underline-hoverable:hover & {
    &:before {
      opacity: 1;
      transform: translateX(0);
    }
    &:after {
      opacity: 0;
      transform: translateX(0%);
    }
  }
}
</style>
