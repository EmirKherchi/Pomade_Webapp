export default class Parallax {
  constructor() {
    this.scenes = [];
    this.y = 0;
    this.direction = 0;
  }
  handleResize(w, h) {
    this.scenes.forEach(scene => {
      scene.handleResize(w, h, this.y);
    });
    this.refresh({ y: this.y });
  }

  update({ y }) {
    if (this.y !== y) {
      const direction = Math.sign(this.y - y);
      this.y = y;
      this.direction = direction;

      this.scenes.forEach(scene => {
        scene.update({ y, direction });
      });
    }
  }

  refresh({ y }) {
    this.y = y;
    this.scenes.forEach(scene => {
      scene.update({ y, direction: this.direction });
    });
  }

  dispose() {}
}
