import {NumbersGrowAnimation} from '../helpers/numbersGrowAnimation'

class PrizesAnimation {
  constructor() {
    this.journeyItem = document.querySelector(".prizes__item--journeys");
    this.casesItem = document.querySelector(".prizes__item--cases");
    this.codesItem = document.querySelector(".prizes__item--codes");

    this.journeyDesc = this.journeyItem.querySelector(".prizes__desc");
    this.casesDesc = this.casesItem.querySelector(".prizes__desc");
    this.codesDesc = this.codesItem.querySelector(".prizes__desc");

    this.journeyNum = this.journeyItem.querySelector(".prizes__desc > b");
    this.casesNum = this.casesItem.querySelector(".prizes__desc > b");
    this.codesNum = this.codesItem.querySelector(".prizes__desc > b");

    this.primaryAwardSvgObjectIsLoaded = false;
    this.secondaryAwardSvgObjectIsLoaded = false;
    this.additionalAwardSvgObjectIsLoaded = false;

    document.getElementById("primaryAward").onload = ({ target }) => {
      this.primaryAwardSvgObject = target;
      this.primaryAwardSvgObjectIsLoaded = true;
    };
    document.getElementById("secondaryAward").onload = ({ target }) => {
      this.secondaryAwardSvgObject = target;
      this.secondaryAwardSvgObjectIsLoaded = true;
    };

    document.getElementById("additionalAward").onload = ({ target }) => {
      this.additionalAwardSvgObject = target;
      this.additionalAwardSvgObjectIsLoaded = true;
    };

    this.start = this.start.bind(this);

    this.checkLoadingStatusTick = null;
  }

  start() {
    if (
      this.primaryAwardSvgObjectIsLoaded &&
      this.secondaryAwardSvgObjectIsLoaded &&
      this.additionalAwardSvgObjectIsLoaded
    ) {
      if (this.checkLoadingStatusTick) {
        window.cancelAnimationFrame(this.checkLoadingStatusTick);
      }

      this.startSvgAnimation();
      return;
    }

    this.checkLoadingStatusTick = window.requestAnimationFrame(this.start);
  }

  startSvgAnimation() {
    this.startPrimaryPrizeAnimation();

    setTimeout(() => {
      this.startSecondaryPrizeAnimation();
    }, 3800);

    setTimeout(() => {
      this.startAdditionalPrizeAnimation();
    }, 6200);
  }

  startPrimaryPrizeAnimation() {
    if (this.journeyItem.classList.contains("active")) {
      return;
    }

    // анимация первого приза
    const svgDoc = this.primaryAwardSvgObject.contentDocument;

    if (!svgDoc) {
      return;
    }

    const animationTag = svgDoc.getElementById("journeysAnimation");

    if (animationTag) {
      this.journeyItem.classList.add("active");
      animationTag.beginElement();

      setTimeout(() => {
        this.journeyDesc.classList.add("active");
        const numbersGrowAnimation = new NumbersGrowAnimation(
          this.journeyNum,
          3
        );
        numbersGrowAnimation.startTransition();
      }, 1000);
    }
  }

  startSecondaryPrizeAnimation() {
    if (this.casesItem.classList.contains("active")) {
      return;
    }

    const svgDoc = this.secondaryAwardSvgObject.contentDocument;
    const animationTag = svgDoc.getElementById("casesAnimation");

    if (animationTag) {
      this.casesItem.classList.add("active");
      animationTag.beginElement();

      setTimeout(() => {
        this.casesDesc.classList.add("active");

        const numbersGrowAnimation = new NumbersGrowAnimation(this.casesNum, 7);
        numbersGrowAnimation.startTransition();
      }, 1000);
    }
  }

  startAdditionalPrizeAnimation() {
    if (this.codesItem.classList.contains("active")) {
      return;
    }

    const svgDoc = this.additionalAwardSvgObject.contentDocument;
    const animationTag = svgDoc.getElementById("suitcaseAnimation");

    if (animationTag) {
      this.codesItem.classList.add("active");
      animationTag.beginElement();

      setTimeout(() => {
        this.codesDesc.classList.add("active");
        const numbersGrowAnimation = new NumbersGrowAnimation(
          this.codesNum,
          900
        );
        numbersGrowAnimation.startTransition();
      }, 1000);
    }
  }
}

export const prizesAnimation = new PrizesAnimation();
