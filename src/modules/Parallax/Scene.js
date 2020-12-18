import router from "../../router";
export default class Scene {
  constructor({
    triggerHook = 0,
    triggerElement,
    duration = 0,
    offset = 0,
    timeline,
    onResized = () => {
      // console.log("Scene OnResized");
    },
    onEnter = () => {},
    onProgress = () => {
      let w = window.innerWidth;
     
      if (this.progress > 0.9995522455089821) {
        console.log(this.progress);
      }

      if (w < 768 && this.progress > 0.9999999) {
        console.log("here push router");
        router.push("/work");
      } else if (w > 768 && this.progress == 1) {
        router.push("/work");
      }
    },
    onLeave = () => {},
  }) {
    this.triggerHook = triggerHook;
    this.triggerElement = triggerElement;
    this.duration = duration;
    this.offset = offset;
    this.onResized = onResized;
    this.progress = 0;
    this.state;
    this.bounds = {
      top: 0,
      bottom: 0,
    };
    if (timeline) {
      this.timeline = timeline;
      this.onEnter = onEnter;
      this.onLeave = onLeave;
      this.onProgress = onProgress;
      this._update = () => {
        this.handleBounds();
        this.handleTimeline();
      };
    }
  }

  handleResize(w, h, y) {
    this.onResized(w, h);
    const bounds = this.triggerElement.getBoundingClientRect();
    const hookOffset = this.triggerHook * h;
    this.bounds.top = bounds.top + y + this.offset - hookOffset;
    this.bounds.bottom = this.bounds.top + this.duration - hookOffset;
  }

  handleTimeline() {
    this.timeline.progress(this.progress).pause();
  }

  handleBounds() {
    // console.log("bounds", this.previousRaw, this.state, this.progress);
    if (this.previousRaw >= 0 && this.previousRaw <= 1) {
      if (this.state !== "enter") {
        // console.log("bounonEnterd");
        this.onEnter(this.progress);
        this.state = "enter";
      }
      this.onProgress(this.progress);
    } else {
      // console.log("onLeave");
      this.onLeave(this.progress);
      this.state = "leave";
    }
  }

  update({ y }) {
    const raw = (y - this.bounds.top) / this.duration;
    this.progress = Math.min(Math.max(raw, 0.0), 1.0);
    this.previousRaw = raw;
    this._update();
  }

  dispose() {}
}
