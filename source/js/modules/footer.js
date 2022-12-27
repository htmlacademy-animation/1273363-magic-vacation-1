export default () => {
  let footerTogglers = document.querySelectorAll(`.js-footer-toggler`);
  const jsFooters = document.querySelectorAll(".js-footer");

  jsFooters.forEach((footer) => {
    footer.addEventListener("animationend", function () {
      if (this.classList.contains(`screen__footer--full`)) {
        this.classList.remove(
          "screen__footer--full",
          "screen__footer--is_closing"
        );
      } else {
        this.classList.add(`screen__footer--full`);
        this.classList.remove("screen__footer--is_opening");
      }
    });
  });

  if (footerTogglers.length) {
    for (let i = 0; i < footerTogglers.length; i++) {
      footerTogglers[i].addEventListener(`click`, function () {
        let footer = footerTogglers[i].parentNode;

        if (this.classList.contains('screen__footer--is_closing') || this.classList.contains('screen__footer--is_opening')) {
          // во время анимации игнорируем все нажатия на переключатель
          return;
        }

        if (footer.classList.contains(`screen__footer--full`)) {
          footer.classList.add("screen__footer--is_closing");
        } else {
          footer.classList.add(`screen__footer--is_opening`);
        }
      });
    }
  }
};
