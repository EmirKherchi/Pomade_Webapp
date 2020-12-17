/* eslint-disable */
class Resize {
	constructor() {
		this.width = window.innerWidth
		this.height = window.innerHeight

		this.delay = 300
		this.optimizePhone = false
		this.optimizeRefresh = true

		this._onResizedCb = []

		window.addEventListener('resize', this._onResize.bind(this), false)
	}

	//  ---------
	//  LISTENERS
	//  ---------

	/**
	 * Add a listener called at every resized.
	 *
	 * @param {Function} callback   Called if resized
	 * @returns {Boolean} Success
	 */
	addOnResized(callback) {
		this.removeOnResized(callback)
		this._onResizedCb.push(callback)

		return true
	}

	/**
	 * Remove the listener.
	 *
	 * @param {Function} callback   Same function precedently added
	 * @returns {Boolean} Success
	 */
	removeOnResized(callback) {
		const i = this._onResizedCb.indexOf(callback)
		if (i > -1) {
			this._onResizedCb.splice(i, 1)
			return true
		}

		return false
	}

	dispatch(width = this.width, height = this.height) {
		this._dispatchResized(width, height)
	}

	_onResize(event, force = false) {
		const now = Date.now()
		if (this.optimizeRefresh) {
			clearTimeout(this._resizedTo)

			if (force || (this._lastResized && now - this._lastResized > this.delay - 1)) {
				const w = document.body.clientWidth // window.innerWidth
				const h = window.innerHeight
				const oldW = this.width
				const oldH = this.height

				// prevent smartphone scroll
				if ((this.optimizePhone && w !== oldW) || (Math.abs(h - oldH) > 100 || h > oldH)) {
					this._dispatchResized(w, h)
				} else {
					this._dispatchResized(w, h)
				}
			} else {
				this._resizedTo = setTimeout(this._onResize.bind(this), this.delay)
			}
		} else {
			const w = document.body.clientWidth || window.innerWidth
			const h = window.innerHeight
			this._dispatchResized(w, h)
		}

		this._lastResized = now
	}

	_dispatchResized(width, height) {
		this.width = width
		this.height = height
		for (const cb of this._onResizedCb) {
			cb(width, height)
		}
	}
}

export default Resize