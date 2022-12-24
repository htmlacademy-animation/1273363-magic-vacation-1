export class DiceLoader {
  constructor() {
    this._element = document.getElementById("dice_text");

    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this._percentage = percentage;
    this._element.dataset.percentage = `${this._percentage}%`;
  }

  increasePercentage(delta) {
    this._percentage += delta;
    this._element.dataset.percentage = this._percentage > 100 ? '100%' : `${this._percentage}%`;
  }
}
