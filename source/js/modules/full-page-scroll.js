import throttle from "lodash/throttle";
import bodyTheme from "../helpers/body-theme";
import {game} from "./game";
import {prizesAnimation} from "./prizesAnimation";
import {sceneController} from '../script';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(
      `.screen:not(.screen--result)`
    );
    this.menuElements = document.querySelectorAll(
      `.page-header__menu .js-menu-link`
    );
    this.transitionBackground = document.querySelector(
      `.transition--background`
    );

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(
      `wheel`,
      throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, { trailing: true })
    );
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex(
      (screen) => location.hash.slice(1) === screen.id
    );
    this.activeScreen = newIndex < 0 ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const prevActiveScreen = document.querySelector(`.screen.active`);
    const nextActiveScreen = this.screenElements[this.activeScreen];

    const isIntroPage = nextActiveScreen.classList.contains(`screen--intro`);
    const isStoryPage = nextActiveScreen.classList.contains(`screen--story`);

    if (isIntroPage || isStoryPage) {
      if (!sceneController.isInit) {
        sceneController.initScene(isIntroPage ? 0 : 1);
      }

      if (isIntroPage) {
        sceneController.showMainScene();
      } else if (isStoryPage) {
        sceneController.showRoomScene();
      }
    }

    if (
      prevActiveScreen &&
      prevActiveScreen.classList.contains(`screen--story`)
    ) {
      bodyTheme.clearBodyTheme();
    }

    if (nextActiveScreen.classList.contains(`screen--story`)) {
      bodyTheme.applyTheme();
    }

    // особый вид анимации переключения с вкладки история на вкладку призы
    if (
      prevActiveScreen &&
      prevActiveScreen.classList.contains(`screen--story`) &&
      nextActiveScreen.classList.contains(`screen--prizes`)
    ) {
      this.showTransitionScreen(prevActiveScreen, nextActiveScreen);
      setTimeout(() => {
        prizesAnimation.start();
      }, 500);

      return;
    }

    if (nextActiveScreen.classList.contains(`screen--prizes`)) {
      setTimeout(() => {
        prizesAnimation.start();
      }, 100);
    }

    if (nextActiveScreen.classList.contains("screen--game")) {
      game.start();
    }

    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    nextActiveScreen.classList.remove(`screen--hidden`);
    setTimeout(() => {
      nextActiveScreen.classList.add(`active`);
    }, 100);
  }

  /**
   * Запускаем плавный переход между экранами
   *
   * @param {HTMLElement} prevActiveScreen
   * @param {HTMLElement} nextActiveScreen
   */
  showTransitionScreen(prevActiveScreen, nextActiveScreen) {
    document.documentElement.classList.add(`is-transitioning`);
    this.transitionBackground.classList.add(`transition--background__show`);

    setTimeout(() => {
      nextActiveScreen.classList.remove(`screen--hidden`);
      nextActiveScreen.classList.add(`active`);
      prevActiveScreen.classList.remove(`active`);
      prevActiveScreen.classList.add(`screen--hidden`);

      document.documentElement.classList.remove(`is-transitioning`);
      this.transitionBackground.classList.remove(
        `transition--background__show`
      );
    }, 400);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find(
      (item) => item.dataset.href === this.screenElements[this.activeScreen].id
    );
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        screenId: this.activeScreen,
        screenName: this.screenElements[this.activeScreen].id,
        screenElement: this.screenElements[this.activeScreen],
      },
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(
        this.screenElements.length - 1,
        ++this.activeScreen
      );
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
