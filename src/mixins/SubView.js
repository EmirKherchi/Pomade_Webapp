import gsap from "gsap";
import Draggable from "@/modules/gsap/Draggable";
import Wheel from "@/modules/Wheel";
import Resize from "@/mixins/Resize";

export default {
  mixins: [Resize],
  mounted() {
    this.initBindings();
  },
  beforeDestroy() {
    this.disposeBindings();
  },
  methods: {
    disposeBindings() {
      this.draggable.kill();
      this.wheel.dispose();
    },
    initBindings() {
      this.slideDelay = 1.5;

      this.progressClamp = gsap.utils.clamp(0, 1);

      this.proxy = document.createElement("div");
      this.$el.appendChild(this.proxy);
      this.overwriteAnimation = gsap.to({}, {});
      this.wrapHeight = 0;
      this.scrollHeight = 0;

      this.animation = gsap.to(this.$refs.gabarit, {
        y: -1,
        duration: 1,
        ease: "none",
        paused: true,
        modifiers: {
          y: y => {
            const newX = parseFloat(y) * this.scrollHeight;
            return `${newX}px`;
          }
        },
        onUpdate: this.render
      });
      this.draggable = new Draggable(this.proxy, {
        trigger: this.$refs.gabarit,
        type: "y",
        inertia: true,
        bounds: this.$el,
        zIndexBoost: false,
        cursor: "auto",
        onPress: this.updateDraggable,
        onDrag: this.updateProgress,
        onThrowUpdate: this.updateProgress
      });
      this.draggable.applyBounds(this.$el);

      this.wheel = new Wheel({
        el: this.$refs.gabarit,
        onMove: this.handleWheel
      });

      this.onResized(window.innerWidth, window.innerHeight);
    },
    render() {
      const y = gsap.getProperty(this.proxy, "y");
      // gsap.set(this.$refs.gabarit, {
      //   y: Math.max(Math.min(y, 0), -this.scrollHeight)
      // });
      this.handleRender(y);
    },
    handleRender(y) {
      this.parallax?.update({
        y: -y
      });
    },
    updateDraggable() {
      if (this.overwriteAnimation) this.overwriteAnimation.kill();
      this.draggable.update();
    },
    updateProgress() {
      const y = gsap.getProperty(this.proxy, "y");
      let progress = -y / this.scrollHeight;
      let newProgress = this.progressClamp(progress);
      this.animation.progress(newProgress);
    },
    animateSlider(direction, duration = 0.625) {
      this.animation.pause();
      if (this.overwriteAnimation) this.overwriteAnimation.kill();
      const y = gsap.utils.clamp(
        -this.scrollHeight,
        0,
        gsap.getProperty(this.proxy, "y") - direction
      );
      this.offsetY = y;

      this.overwriteAnimation = gsap.to(this.proxy, {
        overwrite: "auto",
        duration,
        y: this.offsetY,
        onUpdate: this.updateProgress
      });
    },
    handleWheel(x, y) {
      // console.log(x, y);
      // const { spinY, spinX, pixelX, pixelY } = data;
      let delta = Math.abs(y) >= Math.abs(x) ? y : x;
      const targetDiff = gsap.getProperty(this.proxy, "y") - this.offsetY;
      const offset = delta + targetDiff;
      const duration = Math.min(Math.abs(offset) / 300, 1.0) * 0.3125 + 0.3125;
      this.animateSlider(offset, duration);
    },
    handleResize() {
      var progress = this.animation.progress();
      this.wrapHeight = this.$refs.gabarit.offsetHeight;
      this.sizerHeight = this.$el.offsetHeight;
      this.scrollHeight = Math.max(this.wrapHeight - this.sizerHeight, 0);

      gsap.set(this.proxy, {
        height: this.wrapHeight,
        y: -progress * this.scrollHeight,
        willChange: "transform",
        pointerEvents: "none",
        position: "absolute",
        autoAlpha: 0,
        top: 0,
        left: 0
      });
      this.animateSlider(0);
      this.overwriteAnimation.progress(1);
      this.offsetY = gsap.getProperty(this.proxy, "y");
      this.updateDraggable(true);
      this.render();
      gsap.set(this.$refs.gabarit, {
        y: Math.max(Math.min(this.offsetY, 0), -this.scrollHeight)
      });
    },
    onResized(w, h) {
      this.handleResize(w, h);
      this.parallax?.handleResize(w, h);
    }
  }
};
