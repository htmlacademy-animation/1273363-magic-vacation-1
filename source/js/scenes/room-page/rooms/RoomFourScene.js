import {RoomScene} from "../RoomScene";
import * as THREE from "three";
import {MATERIAL_TYPE, OBJECT_ELEMENTS, SVG_ELEMENTS} from "../../../constants";
import { MaterialCreator } from "../../../animation/MaterialCreator";
import {Saturn} from '../../../animation/objects/Saturn';
import {Carpet} from '../../../animation/objects/Carpet';

export class RoomFourScene extends RoomScene {
  constructor(pageSceneCreator) {
    super(pageSceneCreator);

    this.wall = {
      name: OBJECT_ELEMENTS.wallCorner,
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.BasicMaterial,
        {
          color: MaterialCreator.Colors.ShadowedPurple,
          side: THREE.DoubleSide,
        }
      ),
    };
    this.floor = {
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.SoftMaterial,
        {
          color: MaterialCreator.Colors.ShadowedDarkPurple,
        }
      ),
    };
    this.staticOutput = {
      name: OBJECT_ELEMENTS.staticOutput4,
    };

    this.constructChildren();
  }

  constructChildren() {
    super.constructChildren();

    this.addFlower();
    this.addDarkSaturn();
    this.addCarpet();
  }

  addFlower() {
    const config = {
      name: SVG_ELEMENTS.flower,
      extrude: {
        depth: 4,
        bevelThickness: 2,
        bevelSize: 2,
        material: this.pageSceneCreator.materialCreator.create(
          MATERIAL_TYPE.SoftMaterial,
          {
            color: MaterialCreator.Colors.ShadowedAdditionalPurple,
          }
        ),
      },
      transform: {
        transformX: 60,
        transformY: 410,
        transformZ: 440,

        rotateX: Math.PI,
        rotateY: -Math.PI / 2,

        scale: 1,
      },
    };

    this.pageSceneCreator.createExtrudedSvgMesh(config, (obj) => {
      this.addObject(obj);
    });
  }

  addDarkSaturn() {
    const saturn = new Saturn(this.pageSceneCreator.materialCreator, {
      darkMode: true,
      withRope: true,
    });

    const transform = {
      transformX: 350,
      transformY: 500,
      transformZ: 280,

      rotateY: -Math.PI / 2,

      scale: 1,
    };

    this.pageSceneCreator.setTransformParams(saturn, transform);

    this.addObject(saturn);
  }

  addCarpet() {
    const carpet = new Carpet(this.pageSceneCreator);

    this.addObject(carpet);
  }
}
