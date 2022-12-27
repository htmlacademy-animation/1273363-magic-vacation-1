import { game } from "./game";
import {runLosingScene, runWinningScene} from "../2d-animations/main";
import {sonyaAnimationEnd} from '../helpers/sonyaAnimation';

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        game.end();
        sonyaAnimationEnd();

        let target = showResultEls[i].getAttribute(`data-target`);

        if (target === "result") {
          runWinningScene();
        } else if (target === 'result3') {
          runLosingScene();
        }

        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        const targetEl = [].slice
          .call(results)
          .find((el) => el.getAttribute(`id`) === target);
        targetEl.classList.add(`screen--show`);
        targetEl.classList.remove(`screen--hidden`);
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();

        game.start();
      });
    }
  }
};
