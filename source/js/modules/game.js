import { UIElementController } from "../helpers/controllers";
import { GAME_TIME_LIMIT } from "../constants";

class Timer {
  constructor(timeLimit, timerElement, onTimeEndCallback) {
    this.timeLimit = timeLimit;
    this.onTimeEndCallback = onTimeEndCallback;
    this.timerElement = timerElement;
    this.timeStarted = null;
    this.animationFrameId = null;

    this.prevTickText = Timer.timeFormatter.format(this.timeLimit);
    this.timerElement.updateTextContent(this.prevTickText);

    this.tick = this.tick.bind(this);
  }

  tick() {
    const now = Date.now();
    const delta = this.timeStarted + this.timeLimit - now;

    if (delta <= 0) {
      this.onTimeEnd();
      return;
    }

    const newTickText = Timer.timeFormatter.format(delta);

    if (newTickText !== this.prevTickText) {
      this.prevTickText = newTickText;
      this.timerElement.updateTextContent(newTickText);
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  startTimer() {
    this.timeStarted = Date.now();

    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  stopTimer() {
    cancelAnimationFrame(this.animationFrameId);
  }

  onTimeEnd() {
    cancelAnimationFrame(this.animationFrameId);

    this.onTimeEndCallback();
  }
}

Timer.timeFormatter = new Intl.DateTimeFormat("ru", {
  minute: "numeric",
  second: "numeric",
});

class Game {
  constructor() {
    this.timerRef = new UIElementController(
      document.querySelector(".game__counter > span")
    );
    this.timer = null;
    this.onTimerTimeEnd = this.onTimerTimeEnd.bind(this);
  }

  start() {
    if (this.timer) {
      return;
    }

    this.timer = new Timer(GAME_TIME_LIMIT, this.timerRef, this.onTimerTimeEnd);

    this.timer.startTimer();
  }

  end() {
    if (this.timer) {
      this.timer.stopTimer();

      this.timer = null;
    }
  }

  onTimerTimeEnd() {
    this.timer = null;
    const results = document.querySelectorAll(`.screen--result`);
    const targetEl = [].slice
      .call(results)
      .find((el) => el.getAttribute(`id`) === "result3");
    targetEl.classList.add(`screen--show`);
    targetEl.classList.remove(`screen--hidden`);
  }
}

export const game = new Game();
