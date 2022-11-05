export default () => {
  let emailFields = document.querySelectorAll(`.form__labeled-field > label`);
  let adaptPlaceholder = function (el) {
    if ((window.innerWidth / window.innerHeight < 1) || (window.innerWidth < 769)) {
      el.dataset.label = `e-mail`;
    } else {
      el.dataset.label = `e-mail для регистации результата и получения приза`;
    }
  };
  for (let i = 0; i < emailFields.length; i++) {
    adaptPlaceholder(emailFields[i]);
    window.addEventListener(`resize`, function () {
      adaptPlaceholder(emailFields[i]);
    });
  }
};
