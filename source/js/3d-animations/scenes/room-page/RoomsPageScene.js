import * as THREE from "three";
import {RoomsComposition} from "./rooms/RoomsComposition";

export class RoomsPageScene extends THREE.Group {
  constructor(pageSceneCreator, animationManager) {
    super();

    this.pageSceneCreator = pageSceneCreator;
    this.animationManager = animationManager;
  }

  async constructChildren(diceLoader) {
    await this.addRooms(diceLoader);
  }

  async addRooms(diceLoader) {
    const roomsComposition = new RoomsComposition(
      this.pageSceneCreator,
      this.animationManager,
      diceLoader
    );

    await roomsComposition.constructRooms();

    roomsComposition.rotateY(-Math.PI / 4);

    this.add(roomsComposition);
  }
}
