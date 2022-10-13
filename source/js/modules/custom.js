export default () => {
  document.addEventListener(`DOMContentLoaded`, function () {
    let bodyDOM = document.querySelector(`body`);
    bodyDOM.classList.add(`show-anim`);

    const path = document.querySelector(`#string3-1`);
    const pathLength = path.getTotalLength();
    // eslint-disable-next-line no-console
    console.log(pathLength);
  });
};

class AccentTypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property
  ) {
    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;

    this.prepareText();
  }

  createElement(letter, index) {
    const span = document.createElement(`span`);
    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;

    this._timeOffset = Math.floor(Math.random() * 400);

    return span;
  }

  prepareText() {
    if (this._element) {
      const text = this._element.textContent.trim().split(` `).filter((letter) => letter !== ``);

      const content = text.reduce((fragmentParent, word) => {
        const wordElement = Array.from(word).reduce((fragment, letter, index) => {
          fragment.appendChild(this.createElement(letter, index));
          return fragment;
        }, document.createDocumentFragment());
        const wordContainer = document.createElement(`span`);
        wordContainer.classList.add(`text__word`);
        wordContainer.appendChild(wordElement);
        fragmentParent.appendChild(wordContainer);
        return fragmentParent;
      }, document.createDocumentFragment());

      this._element.innerHTML = ``;
      this._element.appendChild(content);
    }
  }

  runAnimation() {
    if (this._element) {
      this._element.classList.add(this._classForActivate);
    }
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}

function animText(elem) {
  const animationTopScreenTextLine = new AccentTypographyBuild(elem, 500, `active`, `transform`);
  setTimeout(() => {
    animationTopScreenTextLine.runAnimation();
  }, 500);
}

animText(`.intro__title`);
animText(`.intro__date`);
animText(`.slider__item-title`);
animText(`.prizes__title`);
animText(`.rules__title`);
animText(`.game__title`);
