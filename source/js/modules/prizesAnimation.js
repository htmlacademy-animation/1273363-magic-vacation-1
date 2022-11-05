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
  }

  start() {
    if (this.journeyItem.classList.contains("active")) {
      return;
    }

    // анимация первого приза
    const svgDoc = document.getElementById("primaryAward").contentDocument;

    if (!svgDoc) {
      return;
    }

    const animationTag = svgDoc.getElementById("journeysAnimation");

    if (animationTag) {
      this.journeyItem.classList.add("active");
      animationTag.beginElement();

      setTimeout(() => {
        this.journeyDesc.classList.add("active");
        new NumbersGrowAnimation(this.journeyNum, 3);
      }, 1000);
    }

    // анимация второго приза
    setTimeout(() => {
      const svgDoc = document.getElementById("secondaryAward").contentDocument;
      const animationTag = svgDoc.getElementById("casesAnimation");

      if (animationTag) {
        this.casesItem.classList.add("active");
        animationTag.beginElement();

        setTimeout(() => {
          this.casesDesc.classList.add("active");
          new NumbersGrowAnimation(this.casesNum, 7);
        }, 1000);
      }
    }, 3800);

    // анимация дополнительного приза
    setTimeout(() => {
      const svgDoc = document.getElementById("additionalAward").contentDocument;
      const animationTag = svgDoc.getElementById("suitcaseAnimation");

      if (animationTag) {
        this.codesItem.classList.add("active");
        animationTag.beginElement();

        setTimeout(() => {
          this.codesDesc.classList.add("active");
          new NumbersGrowAnimation(this.codesNum, 900);
        }, 1000);
      }
    }, 6200);
  }
}

export const prizesAnimation = new PrizesAnimation();
