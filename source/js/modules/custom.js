export default () => {
  document.addEventListener(`DOMContentLoaded`, function () {
    let bodyDOM = document.querySelector(`body`);
    bodyDOM.classList.add(`show-anim`);
  });
};
