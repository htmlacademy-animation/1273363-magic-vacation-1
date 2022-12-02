import * as THREE from "three";
import {RoomOneScene} from "./RoomOneScene";
import {RoomTwoScene} from "./RoomTwoScene";
import {RoomThreeScene} from "./RoomThreeScene";
import {RoomFourScene} from "./RoomFourScene";

export class RoomsComposition extends THREE.Group {
  constructor(pageSceneCreator) {
    super();

    this.pageSceneCreator = pageSceneCreator;

    this.constructRooms();
  }

  constructRooms() {
    this.addRoomOne();
    this.addRoomTwo();
    this.addRoomThree();
    this.addRoomFour();
  }

  addRoomOne() {
    this.add(new RoomOneScene(this.pageSceneCreator));
  }

  addRoomTwo() {
    const roomTwo = new RoomTwoScene(this.pageSceneCreator);

    roomTwo.rotateY(Math.PI / 2);

    this.add(roomTwo);
  }

  addRoomThree() {
    const roomTwo = new RoomThreeScene(this.pageSceneCreator);

    roomTwo.rotateY(Math.PI);

    this.add(roomTwo);
  }

  addRoomFour() {
    const roomTwo = new RoomFourScene(this.pageSceneCreator);

    roomTwo.rotateY(-Math.PI / 2);

    this.add(roomTwo);
  }
}
