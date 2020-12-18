<template>
  <div class="home-page page">
    <div class="gabarit" ref="gabarit">
      <div class="logo-spacer" ref="firstChild" />
      <div class="headline">
        <span ref="headline">
          <span class="main">POMADE</span> EST UN STUDIO CRÉATIF SPÉCIALISÉ EN
          COMMUNICATION DIGITAL ET PHYSIQUE DANS LES DOMAINES DU LUXE, PREMIUM,
          CULTURE & CORPORATE.
        </span>
      </div>
      <div class="what-we-do" ref="what">
        <div class="list" ref="list">
          <div
            :key="i"
            v-for="(entry, i) in entries"
            :class="['entry', `entry-${i % 3}`]"
          >
            <h2 v-html="entry.title" />
            <div class="description" v-html="entry.description" />
          </div>
        </div>

        <Cta />
      </div>
    </div>
    <social-media class="home" />
    <navigator class="home" ref="navigator" />
  </div>
</template>

<script>
import gsap from "gsap";

import Parallax from "@/modules/Parallax/index";
import Scene from "@/modules/Parallax/Scene";

import SubView from "@/mixins/SubView";

import SocialMedia from "@/components/SocialMedia.vue";
import Navigator from "@/components/Navigator.vue";
import Cta from "@/components/CTA.vue";

export default {
  name: "Home",
  mixins: [SubView],
  components: {
    SocialMedia,
    Navigator,
    Cta
  },
  created() {
    this.parallax = new Parallax();
  },
  data() {
    return {
      entries: [
        {
          title: "EFFECTION BRANDING",
          description:
            "ANY BRAND'S MESSAGES ARE COMMUNICATED THROUGH DESIGN, AS THE DESIGN IS THE AMBASSADOR OF A BRAND'S IDENTITY."
        },
        {
          title: "WEB DESIGN + DEVELOPMENT",
          description:
            "CUSTOM AND ALWAYS FULLY RESPONSIVE WEBSITES AND DEIGITAL DESIGN, BY OUR AWARD WINNING TEAM."
        },
        {
          title: "ART DIRECTION",
          description:
            "WE BRING BRANDS TO LIFE THROUGH STRATEGIC POSITIONING, STUNNING CREATIVE DIRECTION AND COMPELLING TONE OF VOICE"
        },
        {
          title: "CONTENT CREATION",
          description:
            "ANY BRAND'S MESSAGES ARE COMMUNICATED THROUGH DESIGN, AS THE DESIGN IS THE AMBASSADOR OF A BRAND'S IDENTITY."
        },
        {
          title: "STRATEGIC MARKETING",
          description:
            "CUSTOM AND ALWAYS FULLY RESPONSIVE WEBSITES AND DEIGITAL DESIGN, BY OUR AWARD WINNING TEAM."
        }
      ]
    };
  },
  mounted() {
    this.$scene = this.$root.$children[0].$refs.scene;
    this.$scene.flowers.reset();
    this.$scene.text.reset();
    this.mainTextMiddle = 0;
    this.listMaginTop = 46;
    console.log("home mounted");
    this.initLogoScene();
    this.initTextLeaveScene();
    this.initMainScene();
    this.initWhatScene();
    this.onResized(this.resize.width, this.resize.height);
  },
  beforeDestroy() {
    this.parallax.dispose();
    // this.$scene.app.camera.layers.disable(0);
    // this.$scene.flowers.reset();
    // this.$scene.text.reset();
  },
  methods: {
    initLogoScene() {
      const { menu } = this.$root.$children[0].$refs.scene;
      menu.group.visible = false;
      const tl = this.$root.$children[0].$refs.scene.flowers.completeIntro();
      const helper = {
        y: 0
      };
      tl.add(
        this.$root.$children[0].$refs.scene.text.follow({
          from: -1,
          to: 0,
          progress: true
        }),
        "b"
      ).fromTo(
        helper,
        {
          y: 0
        },
        {
          y: 1,
          ease: "circ.out",
          onStart: () => {
            gsap.set(this.$refs.navigator.$el, {
              alpha: 1
            });
            menu.group.visible = true;
          },
          onUpdate: () => {
            const y = this.resize.height - this.mainTextMiddle;
            // console.log(y);
            gsap.set(this.$refs.navigator.$el, {
              y: this.resize.height - y * helper.y
            });
            const { flowers, menu } = this.$root.$children[0].$refs.scene;
            flowers.updateSmall();

            menu.group.position.y =
              (y / this.resize.height) * flowers.sizes.extents.y * helper.y -
              flowers.sizes.extents.y * 0.5;
          }
        },
        "b"
      );
      const scene = new Scene({
        triggerElement: this.$refs.firstChild,
        triggerHook: 0.0,
        timeline: tl,
        duration:
          window.innerHeight * 0.5 + this.$refs.headline.offsetHeight * 0.5,
        onResized: (w, h) => {
          scene.duration = h * 0.5 + this.$refs.headline.offsetHeight * 0.5;
          this.mainTextMiddle =
            h * 0.5 - this.$refs.navigator.$el.offsetHeight * 0.5;
        }
      });
      this.parallax.scenes.push(scene);
    },
    initTextLeaveScene() {
      const dy = this.$refs.list.offsetTop;
      const y = this.$refs.what.offsetTop;
      this.ox = dy - y + this.listMaginTop;
      this.aox = this.ox / window.innerHeight;
      const helper = {
        y: 0,
        navY: 0
      };

      const tl = this.$root.$children[0].$refs.scene.text.follow({
        from: 0,
        to: 1,
        ease: "circ.in"
      });
      tl.to(
        helper,
        {
          y: 1,
          ease: "none",
          onUpdate: () => {
            const { flowers } = this.$root.$children[0].$refs.scene;
            const oy = flowers.groupOffsetlogoY + flowers.logoY;
            const newY = flowers.sizes.extents.y * (0.5 - this.aox * 0.5) - oy;
            flowers.smallLogoY = newY * helper.y - 0.2 * (1.0 - helper.y);
            flowers.updateSmall();
          }
        },
        "a"
      ).fromTo(
        helper,
        {
          navY: 0
        },
        {
          navY: 1,
          ease: "none",
          onUpdate: () => {
            const { menu } = this.$root.$children[0].$refs.scene;
            const y = this.mainTextMiddle - this.ox;
            gsap.set(this.$refs.navigator.$el, {
              y: this.mainTextMiddle - y * helper.navY
            });
            menu.group.position.y =
              ((this.mainTextMiddle / this.resize.height) *
                menu.sizes.extents.y -
                (y / this.resize.height) * menu.sizes.extents.y * helper.navY -
                menu.sizes.extents.y * 0.5) *
              -1;
          }
        },
        "a"
      );

      const scene = new Scene({
        triggerElement: this.$refs.what,
        triggerHook: 1.0,
        timeline: tl,
        duration:
          window.innerHeight * 0.5 + this.$refs.headline.offsetHeight * 0.5,
        onResized: (w, h) => {
          scene.duration = h * 0.5 + this.$refs.headline.offsetHeight * 0.5;
          const dy = this.$refs.list.offsetTop;
          const y = this.$refs.what.offsetTop;
          this.ox = dy - y + this.listMaginTop;
          this.aox = this.ox / h;
        }
      });
      this.parallax.scenes.push(scene);
    },
    initMainScene() {
      const helper = {
        y: 0
      };
      const tl = new gsap.timeline({
        paused: true,
        onUpdate: () => {
          this.$root.$children[0].$refs.scene.flowers.refractor.material.uniforms.lightStep.value =
            0.9 - 0.3125 * tl.progress();
          this.$root.$children[0].$refs.scene.flowers.logoMaterial.uniforms.lightStep.value =
            0.095 * tl.progress();
        }
      });
      tl.fromTo(
        helper,
        {
          y: 0
        },
        {
          y: 1,
          ease: "circ.out"
        },
        "a"
      )
        .fromTo(
          ".social-media",
          {
            yPercent: 100
          },
          {
            yPercent: -200,
            ease: "sine.out"
          },
          "a"
        )
        .add(this.$root.$children[0].$refs.scene.flowers.scrollY(), "a");
      const scene = new Scene({
        triggerElement: this.$refs.firstChild,
        triggerHook: 0.0,
        timeline: tl,
        duration: this.$refs.gabarit.offsetHeight - window.innerHeight,
        onResized: () => {
          scene.duration = this.$refs.gabarit.offsetHeight - window.innerHeight;
        }
      });
      this.parallax.scenes.push(scene);
    },
    initWhatScene() {
      this.WhatTl = new gsap.timeline({
        paused: true
      });
      this.WhatTl.fromTo(
        ".entry-0, .entry-2, .cta",
        {
          y: "200%",
          ease: "none"
        },
        {
          y: "0%",
          ease: "none"
        },
        "a"
      );
      this.WhatTlSmall = new gsap.timeline({
        paused: true
      }).fromTo(
        ".entry-0, .entry-2, .cta",
        {
          y: "0%",
          ease: "none"
        },
        {
          y: "0%",
          ease: "none"
        },
        "a"
      );
      const w = window.innerWidth;
      const scene = new Scene({
        triggerElement: this.$refs.what,
        triggerHook: 1.0,
        timeline: w < 1102 ? this.WhatTlSmall : this.WhatTl,
        duration: window.innerHeight,
        onResized: (w, h) => {
          scene.duration = h;
          scene.timeline = w < 1102 ? this.WhatTlSmall : this.WhatTl;
        }
      });
      this.parallax.scenes.push(scene);
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
}
.logo-spacer {
  height: 100vh;
}
.headline {
  color: #ffffff;
  width: 100%;
  max-width: 26em;
  font-family: "MADECanvas";
  font-weight: 300;
  font-size: 3rem;
  line-height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 25.75vw;
  padding-right: 10.5vw;
  padding-top: 10px;
  // padding-bottom: 25vh;
  box-sizing: border-box;
  opacity: 0;
  // visibility: hidden;
  height: 150vh;
  @media screen and (max-width: 768px - 1) {
    padding-left: 10.5vw;
    font-size: 2.5rem;
  }
  .main {
    font-size: 1.2em;
  }
}
.what-we-do {
  min-height: 100vh;
  box-sizing: border-box;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  flex-direction: column;
  // padding-left: 25.75vw;
  align-items: flex-start;
  align-items: center;
  padding-left: 10.5vw * 0.5;
  padding-right: 10.5vw * 0.5;
  width: 100%;
  @media screen and (max-width: 768px - 1) {
    padding-right: 10.5vw;
    padding-left: 10.5vw;
    align-items: center;
  }
}
.list {
  display: grid;
  column-gap: 80px;
  grid-template-columns: repeat(auto-fill, 12.5rem);
  width: 100%;
  max-width: 836px;
  justify-content: center;
  @media screen and (max-width: 1200px - 1) {
    max-width: 736px;
  }
  @media screen and (max-width: 768px - 1) {
    justify-content: center;
  }
  // flex: 1;
}
.entry {
  // width: 12.5rem;
  margin: 1.125rem 0;
  h2 {
    font-family: "MADECanvas";
    font-weight: normal;
    font-size: 1.75rem;
    line-height: 0.9642857143;
    margin-bottom: 1em;
    margin-top: 1em;
  }
  .description {
    font-size: 11px;
    font-weight: 300;
    max-width: 15em;
    line-height: 1.4545454545;
  }
}
.cta {
  display: none;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
  @media screen and (max-width: 1102px - 1) {
    // margin-left: 9.5rem;
    margin-bottom: 10.625vh;
  }
  @media screen and (max-width: 768px - 1) {
    // margin-left: 0rem;
    margin-bottom: 10.625vh;
  }
  @media screen and (max-width: 608px - 1) {
    // margin-left: 0;
    margin-bottom: 10.625vh;
  }
}
</style>
