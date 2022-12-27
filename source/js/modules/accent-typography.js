import AccentTypographyBuild from "../helpers/accent-typography-build";

const introTitle = new AccentTypographyBuild(document.querySelector(`.intro__title`), {
  letterDelays: [3, 1, 0, 1, 2, 1, 0, 5, 2, 0, 2, 1],
  nextWordDelay: 200,
});

const introDate = new AccentTypographyBuild(document.querySelector(`.intro__date`), {
  letterDelays: [3, 1, 1, 4, 0, 0, 1, 2, 0, 0, 3, 2, 1],
  delay: 800,
});

const storyTitle = new AccentTypographyBuild(document.querySelector(`.slider__item-title`), {
  letterDelays: [4, 2, 0, 2, 3, 2, 1],
});

const prizesTitle = new AccentTypographyBuild(document.querySelector(`.prizes__title`), {
  letterDelays: [4, 2, 0, 2, 3],
});

const rulesTitle = new AccentTypographyBuild(document.querySelector(`.rules__title`), {
  letterDelays: [4, 2, 1, 0, 3, 2, 1],
});

const gameTitle = new AccentTypographyBuild(document.querySelector(`.game__title`), {
  letterDelays: [4, 2, 0, 1],
});

window.addEventListener(`load`, () => {
  introTitle.prepareText();
  introDate.prepareText();
  storyTitle.prepareText();
  prizesTitle.prepareText();
  rulesTitle.prepareText();
  gameTitle.prepareText();
});
