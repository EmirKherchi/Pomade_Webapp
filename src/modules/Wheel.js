/* eslint-disable */
const DELTA_SCALE = {
  STANDARD: 1,
  OTHERS: -3,
};

const DELTA_MODE = [1.0, 28.0, 500.0];
const getDeltaMode = (mode) => DELTA_MODE[mode] || DELTA_MODE[0];

function normalizeDelta(eve) {
  if ('deltaX' in eve) {
    const mode = getDeltaMode(eve.deltaMode);

    return {
      x: eve.deltaX / DELTA_SCALE.STANDARD * mode,
      y: eve.deltaY / DELTA_SCALE.STANDARD * mode,
    };
  }

  if ('wheelDeltaX' in eve) {
    return {
      x: eve.wheelDeltaX / DELTA_SCALE.OTHERS,
      y: eve.wheelDeltaY / DELTA_SCALE.OTHERS,
    };
  }

  return {
    x: 0,
    y: evt.wheelDelta / DELTA_SCALE.OTHERS,
  };
}
const eventName = ('onwheel' in window || document.implementation.hasFeature('Events.wheel', '3.0')) ? 'wheel' : 'mousewheel';

class Wheel {
	constructor({
		el = document,
		onMove = event => event
	}) {
		this.el = el
    this.offset = {
      x: 0,
      y: 0
    }
		this.onMove = onMove

		this._onWheel = this._onWheel.bind(this)
		this.listen()
	}

	listen() {
		this.el.addEventListener(eventName, this._onWheel, {
			passive: false
    })
    
	}
	dispose() {
		this.el.removeEventListener(eventName, this._onWheel)
	}

	_onWheel(eve) {
    const { x, y } = normalizeDelta(eve)

		this.onMove(x, y, eve);
  }

}

export default Wheel
