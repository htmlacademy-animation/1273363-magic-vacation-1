import throttle from 'lodash/throttle';
import timer from './timer.js';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    let preloadBg = document.querySelector(`.bg-fill`);
    function removeStoryClass() {
      for (let i = 1; i <= 4; i++) {
        document.querySelector(`body`).classList.remove(`story-slide-${i}`);
      }
    }
    if (this.screenElements[this.activeScreen].classList.contains(`screen--prizes`)) {
      preloadBg.classList.add(`active`);
      removeStoryClass();
      setTimeout(() => {
        this.changeVisibilityDisplay();
        preloadBg.classList.remove(`active`);
      }, 700);
    } else if ((this.screenElements[this.activeScreen].classList.contains(`screen--story`))) {
      setTimeout(() => {
        let indexSlide = document.querySelector(`.swiper-pagination-current`).innerHTML;
        document.querySelector(`body`).classList.add(`story-slide-${indexSlide}`);

      }, 100);
      this.changeVisibilityDisplay();
    } else if ((this.screenElements[this.activeScreen].classList.contains(`screen--game`))) {
      removeStoryClass();
      this.changeVisibilityDisplay();
      timer();
    } else {
      removeStoryClass();
      this.changeVisibilityDisplay();
    }
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
