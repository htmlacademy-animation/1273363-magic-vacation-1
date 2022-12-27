const LETTER_DELAY_MULTIPLIER = 40;

export default class AccentTypographyBuild {
  constructor(node, options) {
    this._element = node;
    this._options = options;
    this._delayGenerator = getDelayGenerator(options.letterDelays);

    this.prepareText(this._element);
  }

  prepareText() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(`accent-text`);

    const content = this._element.textContent
      .trim()
      .split(` `)
      .reduce((fragment, word, index) => {
        const span = document.createElement(`span`);
        span.classList.add(`accent-text__word`);
        span.append(this.createLetters(word, index));

        fragment.append(span);
        return fragment;
      }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.append(content);
  }

  createLetters(word, index) {
    const wordDelay = this._options.nextWordDelay
      ? this._options.nextWordDelay * index
      : 0;

    return word.split(``).reduce((fragment, letter) => {
      const span = document.createElement(`span`);
      const {duration = 400, delay = 0, timingFunction = `ease-out`} = this._options;
      span.textContent = letter;
      span.style.transition = `${duration}ms ${timingFunction} ${
        delay + wordDelay + this._delayGenerator.next().value
      }ms`;

      fragment.append(span);
      return fragment;
    }, document.createDocumentFragment());
  }

  runAnimation() {
    this._element.classList.add(`active`);
  }

  stopAnimation() {
    this._element.classList.remove(`active`);
  }
}

function* getDelayGenerator(delayArr) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!delayArr) {
      yield 0;
    }

    for (const delay of delayArr) {
      yield delay * LETTER_DELAY_MULTIPLIER;
    }
  }
}
