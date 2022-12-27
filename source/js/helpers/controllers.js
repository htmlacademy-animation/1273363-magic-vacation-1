export class UIElementController {
  constructor(elem) {
    this.elem = elem;
  }

  getTextContent() {
    if (!this.elem) {
      return null;
    }

    return this.elem.textContent;
  }

  updateTextContent(text) {
    if (!this.elem) {
      return;
    }

    this.elem.textContent = text;
  }
}
