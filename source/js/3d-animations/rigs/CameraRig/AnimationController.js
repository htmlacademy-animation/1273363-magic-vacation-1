export class AnimationController {
  constructor() {
    this.animation = null;
  }

  start(animation) {
    this.stop();

    this.animation = animation;
    this.animation.start();
  }

  stop() {
    if (!this.animation) {
      return;
    }

    this.animation.stop();
  }
}
