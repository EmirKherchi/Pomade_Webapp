// import gsap from "gsap";
// import ScrollTrigger from "@/pure/gsap/ScrollTrigger";
import { MathUtils } from "three";

import { getSize } from "./getSize.js";

class Momentum {
  limit = {
    x: Infinity,
    y: Infinity
  };

  /**
   * Container bounding rect
   */
  bounding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  _momentum = { x: 0, y: 0 };
  constructor({ container, content, update }) {
    this.container = container;
    this.content = content;
    this.offset = {
      x: 0,
      y: 0
    };
    this._plugins = [];

    this.update = update;

    this.size = this.getSize();

    // ScrollTrigger.addEventListener("refresh", () => {
    //   this.handleResize();
    // });
  }

  getSize() {
    return getSize(this);
  }

  addMomentum(x, y) {
    this.setMomentum(this._momentum.x + x, this._momentum.y + y);
  }

  setMomentum(x, y) {
    if (this.limit.x === 0) {
      x = 0;
    }
    if (this.limit.y === 0) {
      y = 0;
    }

    // if (this.options.renderByPixels) {
    //   x = Math.round(x);
    //   y = Math.round(y);
    // }

    this._momentum.x = x;
    this._momentum.y = y;
  }

  addTransformableMomentum(x, y, fromEvent, callback) {
    // this._updateDebounced();

    const finalDelta = this._plugins.reduce(
      (delta, plugin) => {
        return plugin.transformDelta(delta, fromEvent) || delta;
      },
      { x, y }
    );

    const willScroll = !this._shouldPropagateMomentum(
      finalDelta.x,
      finalDelta.y
    );
    if (willScroll) {
      this.addMomentum(finalDelta.x, finalDelta.y);
    }

    if (callback) {
      callback.call(this, willScroll);
    }
  }
  _shouldPropagateMomentum(deltaX = 0, deltaY = 0) {
    const {
      // options,
      offset,
      limit
    } = this;

    // force an update when scrollbar is "unscrollable", see #106
    // if (limit.x === 0 && limit.y === 0) {
    //   this._updateDebounced();
    // }
    const destX = MathUtils.clamp(deltaX + offset.x, 0, limit.x);
    const destY = MathUtils.clamp(deltaY + offset.y, 0, limit.y);
    let res = true;

    // offsets are not about to change
    // `&=` operator is not allowed for boolean types
    res = res && destX === offset.x;
    res = res && destY === offset.y;

    // current offsets are on the edge
    res =
      res &&
      (offset.x === limit.x ||
        offset.x === 0 ||
        offset.y === limit.y ||
        offset.y === 0);

    return res;
  }
  setPosition(x, y) {
    const {
      // options,
      offset,
      limit
      // track,
    } = this;

    const newX = MathUtils.clamp(x, 0, limit.x);
    const newY = MathUtils.clamp(y, 0, limit.y);

    if (newX === offset.x && newY === offset.y) {
      return null;
    }

    offset.x = newX;
    offset.y = newY;

    this.update();

    return {
      offset: { ...offset }
    };
  }
  handleRender() {
    const { _momentum } = this;

    if (_momentum.x || _momentum.y) {
      const nextX = this._nextTick("x");
      const nextY = this._nextTick("y");

      _momentum.x = nextX.momentum;
      _momentum.y = nextY.momentum;

      this.setPosition(nextX.position, nextY.position);
      // return {x :nextX.position, y: nextY.position};
    }
    // const remain = { ...this._momentum };

    // this._plugins.forEach((plugin) => {
    //   plugin.onRender(remain);
    // });
  }

  _nextTick(direction = "x" | "y") {
    const {
      // options,
      offset,
      _momentum
    } = this;

    const current = offset[direction];
    const remain = _momentum[direction];

    if (Math.abs(remain) <= 0.1) {
      return {
        momentum: 0,
        position: current + remain
      };
    }

    let nextMomentum = remain * 0.9;

    // if (options.renderByPixels) {
    //   nextMomentum |= 0;
    // }

    return {
      momentum: nextMomentum,
      position: current + remain - nextMomentum
    };
  }
  handleResize() {
    const newSize = this.getSize();

    const limit = {
      x: Math.max(newSize.content.width - newSize.container.width, 0),
      y: Math.max(newSize.content.height - newSize.container.height, 0)
    };

    // metrics
    const containerBounding = this.container.getBoundingClientRect();

    const bounding = {
      top: Math.max(containerBounding.top, 0),
      right: Math.min(containerBounding.right, window.innerWidth),
      bottom: Math.min(containerBounding.bottom, window.innerHeight),
      left: Math.max(containerBounding.left, 0)
    };

    // assign props
    this.size = newSize;
    this.limit = limit;
    this.bounding = bounding;

    // update tracks
    // this.container.track.update();

    // re-positioning
    // this.container.setPosition();
  }
}

export default Momentum;
