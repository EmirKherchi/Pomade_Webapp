/* eslint-disable */
import Resize from './Resize'

const resize = new Resize()


export default {
	created() {
		this.resize = resize
	},

	mounted() {
		if (this.onResized) {
			this._mixinOnResizedDisptacher = this.onResized.bind(this)
			this.resize.addOnResized(this._mixinOnResizedDisptacher)
		}
		/* else
		{
		    console.warn('Use the method onResized(width, height) if you use the mixin core-resize in your component', this.$el)
		}*/
	},

	destroyed() {
		if (this._mixinOnResizedDisptacher) {
			this.resize.removeOnResized(this._mixinOnResizedDisptacher)
		}
	}
}