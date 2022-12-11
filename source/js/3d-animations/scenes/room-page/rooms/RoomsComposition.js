import * as THREE from "three";
import {RoomOneScene} from "./RoomOneScene";
import {RoomTwoScene} from "./RoomTwoScene";
import {RoomThreeScene} from "./RoomThreeScene";
import {RoomFourScene} from "./RoomFourScene";

export class RoomsComposition extends THREE.Group {
  constructor(pageSceneCreator, animationManager) {
    super();

    this.pageSceneCreator = pageSceneCreator;
    this.animationManager = animationManager;

    this.constructRooms();
  }

  constructRooms() {
    this.addRoomOne();
    this.addRoomTwo();
    this.addRoomThree();
    this.addRoomFour();
  }

  addRoomOne() {
    this.add(new RoomOneScene(this.pageSceneCreator, this.animationManager));
  }

  addRoomTwo() {
    const roomTwo = new RoomTwoScene(
      this.pageSceneCreator,
      this.animationManager
    );

    roomTwo.rotateY(Math.PI / 2);

    this.add(roomTwo);
  }

  addRoomThree() {
    const roomThree = new RoomThreeScene(
      this.pageSceneCreator,
      this.animationManager
    );

    roomThree.rotateY(Math.PI);

    this.add(roomThree);
  }

  addRoomFour() {
    const roomFour = new RoomFourScene(
      this.pageSceneCreator,
      this.animationManager
    );

    roomFour.rotateY(-Math.PI / 2);

    this.add(roomFour);
  }
}
