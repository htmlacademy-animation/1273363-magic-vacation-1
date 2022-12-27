const sonyaElement = document.getElementById("image--sonya");

const createSonyaAnimationAppear = () =>
  sonyaElement.animate(
    [
      { transform: "translate(400px, 300px) rotateZ(-22deg) scale(0.3)" },
      { transform: "translate(0, 0) rotateZ(0) scale(1)" },
    ],
    {
      duration: 533,
      easing: "cubic-bezier(.17,.17,.37,1)",
      delay: 400,
    }
  );

const createSonyaAnimationBounce = () =>
  sonyaElement.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }],
    {
      duration: 1400,
      easing: "ease-in-out",
      iterations: 1,
      fill: "both",
    }
  );

let sonyaAnimation;

export const sonyaAnimationStart = () => {
  sonyaAnimation = createSonyaAnimationAppear();
  sonyaAnimation.play();

  sonyaAnimation.onfinish = () => {
    sonyaAnimation = createSonyaAnimationBounce();

    sonyaAnimation.onfinish = () => {
      sonyaAnimation.reverse();
    };
  };
};

export const sonyaAnimationEnd = () => {
  if (!sonyaAnimation) {
    return;
  }

  sonyaAnimation.onfinish = () => {};
  sonyaAnimation.cancel();
  sonyaAnimation = createSonyaAnimationAppear();
  sonyaAnimation.reverse();

  sonyaAnimation.onfinish = () => {
    sonyaAnimation = null;
  };
};
