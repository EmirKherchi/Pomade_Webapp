import {
  LoadingManager,
  TextureLoader,
  sRGBEncoding,
  LinearFilter
} from "three";

export default class Loader {
  constructor() {
    this.manager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.manager);
  }
  loadTexture(url, cb = () => {}) {
    const texture = this.textureLoader.load(url, cb);
    texture.minFilter = LinearFilter;
    texture.encoding = sRGBEncoding;
    return texture;
  }
}
