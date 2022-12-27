import throttle from "lodash/throttle";
import bodyTheme from "../helpers/body-theme";
import {game} from "./game";
import {prizesAnimation} from "./prizesAnimation";
import {sceneController} from "../script";
import {
  sonyaAnimationEnd,
  sonyaAnimationStart,
} from "../helpers/sonyaAnimation";

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

    if (prevActiveScreen === nextActiveScreen) {
      return;
    }

    const isNextIntroPage =
      nextActiveScreen.classList.contains(`screen--intro`);
    const isNextStoryPage =
      nextActiveScreen.classList.contains(`screen--story`);
    const isNextPrizesPage =
      nextActiveScreen.classList.contains(`screen--prizes`);
    const isNextGamePage = nextActiveScreen.classList.contains(`screen--game`);
    const isNextRulesPage =
      nextActiveScreen.classList.contains(`screen--rules`);

    const isPrevIntroPage =
      prevActiveScreen && prevActiveScreen.classList.contains(`screen--intro`);
    const isPrevStoryPage =
      prevActiveScreen && prevActiveScreen.classList.contains(`screen--story`);
    const isPrevGamePage =
      prevActiveScreen && prevActiveScreen.classList.contains(`screen--game`);
    const isPrevPrizesPage =
      prevActiveScreen && prevActiveScreen.classList.contains(`screen--prizes`);
    const isPrevRulesPage =
      prevActiveScreen && prevActiveScreen.classList.contains(`screen--rules`);

    if (isNextIntroPage) {
      sceneController.showMainScene();
    } else if (isNextStoryPage) {
      sceneController.showRoomScene();
    }

    if (isNextStoryPage) {
      bodyTheme.applyTheme();
    } else if (isPrevStoryPage) {
      bodyTheme.clearBodyTheme();
    }

    if (isNextPrizesPage) {
      setTimeout(() => {
        prizesAnimation.start();
      }, 100);
    }

    if (isNextGamePage) {
      game.start();

      sonyaAnimationStart();
    } else if (isPrevGamePage) {
      sonyaAnimationEnd();
    }

    // отключаем 3D-рендер, когда скрыты соответствующие экраны
    if (isNextIntroPage || isNextStoryPage) {
      sceneController.startAnimation();
    } else {
      sceneController.stopAnimation();
    }

    // особый вид анимации переключения с вкладок story/intro на вкладки
    if (
      (isPrevIntroPage || isPrevStoryPage) &&
      (isNextGamePage || isNextRulesPage || isNextPrizesPage)
    ) {
      if (isNextPrizesPage) {
        setTimeout(() => {
          prizesAnimation.start();
        }, 500);
      }
      this.showTransitionScreen(prevActiveScreen, nextActiveScreen);
      return;
    }

    if (isPrevPrizesPage || isPrevRulesPage || isPrevGamePage) {
      this.transitionBetweenScreenWithOpacity(
        prevActiveScreen,
        nextActiveScreen
      );

      return;
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

      if (prevActiveScreen) {
        prevActiveScreen.classList.remove(`active`);
        prevActiveScreen.classList.add(`screen--hidden`);
      }

      document.documentElement.classList.remove(`is-transitioning`);
      this.transitionBackground.classList.remove(
        `transition--background__show`
      );
    }, 400);
  }

  /**
   * Запускаем плавный переход между экранами через исчезновение
   *
   * @param {HTMLElement} prevActiveScreen
   * @param {HTMLElement} nextActiveScreen
   */
  transitionBetweenScreenWithOpacity(prevActiveScreen, nextActiveScreen) {
    prevActiveScreen.classList.add("screen--fadeOut");

    setTimeout(() => {
      prevActiveScreen.classList.remove(`screen--fadeOut`);

      nextActiveScreen.classList.remove(`screen--hidden`);
      nextActiveScreen.classList.add(`active`);

      prevActiveScreen.classList.remove(`active`);
      prevActiveScreen.classList.add(`screen--hidden`);
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
