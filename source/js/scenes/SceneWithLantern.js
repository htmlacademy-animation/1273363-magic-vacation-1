import * as THREE from "three";
import {Lantern} from "../animation/objects/Lantern";
import {Snowman} from '../animation/objects/Snowman';
import {MaterialCreator} from "../animation/MaterialCreator";
import {degreesToRadians} from "../utils/degreesToRadians";

export class SceneWithLantern extends THREE.Group {
  constructor(materialCreator) {
    super();

    this.materialCreator = materialCreator;
    this.constructChildren();
  }

  constructChildren() {
    this.addPyramid();
    this.addLantern();
    this.addSnowman();
  }

  addPyramid() {
    const pyramid = new THREE.Mesh(
      new THREE.ConeGeometry(250 / Math.pow(2, 0.5), 280, 4),
      this.materialCreator.create("SoftMaterial", {
        color: MaterialCreator.Colors.Blue,
      })
    );

    pyramid.position.set(0, 140, 0);

    this.add(pyramid);
  }

  addLantern() {
    const lantern = new Lantern(this.materialCreator);
    lantern.position.set(400, 0, 0);

    this.add(lantern);
  }

  addSnowman() {
    const snowman = new Snowman(this.materialCreator);
    snowman.rotateY(degreesToRadians(45));
    snowman.position.set(-400, 0, 0);

    this.add(snowman);
  }
}
