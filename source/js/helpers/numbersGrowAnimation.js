import {UIElementController} from "./controllers";

export class NumbersGrowAnimation {
  constructor(element, to, duration = 800, fps = 12) {
    this.controller = new UIElementController(element);
    this.from = parseInt(this.controller.getTextContent());
    this.to = parseInt(to);
    this.fps = fps;
    this.interval = 1000 / fps;

    this.timeStart = Date.now();
    this.duration = duration;
    this.prevTickTime = this.timeStart;

    this.tick = this.tick.bind(this);
  }

  startTransition() {
    requestAnimationFrame(this.tick);
  }

  tick() {
    const now = Date.now();

    if (this.controller.getTextContent() === this.to.toString()) {
      return;
    }

    if (now - this.prevTickTime < this.interval) {
      requestAnimationFrame(this.tick);
      return;
    }

    let newValue =
      this.from +
      Math.floor(
        ((this.to - this.from) * (now - this.timeStart)) / this.duration
      );

    if (newValue > this.to) {
      newValue = this.to;
    }

    this.prevTickTime = now;
    this.controller.updateTextContent(newValue);

    requestAnimationFrame(this.tick);
  }
}
