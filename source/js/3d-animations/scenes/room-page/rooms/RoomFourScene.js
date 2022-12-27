import {RoomScene} from "../RoomScene";
import * as THREE from "three";
import {
  MATERIAL_TYPE,
  OBJECT_ELEMENTS,
  SVG_ELEMENTS,
} from "../../../../constants";
import { MaterialCreator } from "../../../creators/MaterialCreator";
import {Saturn} from '../../../mesh-complex-objects/Saturn';
import {Carpet} from '../../../mesh-complex-objects/Carpet';
import Animation from "../../../../Animation/animation";
import {degreesToRadians} from "../../../utils/degreesToRadians";
import {easeInOutSine, easeInQuad} from "../../../../helpers/easing";

export class RoomFourScene extends RoomScene {
  constructor(pageSceneCreator, animationManager) {
    super(pageSceneCreator, animationManager);

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
  }

  async constructChildren() {
    await super.constructChildren();

    await this.addFlower();
    this.addDarkSaturn();
    this.addCarpet();
    await this.addSonya();
  }

  async addFlower() {
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
        position: {
          x: 60,
          y: 410,
          z: 440,
        },
        rotation: {
          x: Math.PI,
          y: -Math.PI / 2,
        },
        scale: 1,
      },
    };

    const obj = await this.pageSceneCreator.createExtrudedSvgMesh(config);

    this.addObject(obj);
  }

  addDarkSaturn() {
    const saturn = new Saturn(this.pageSceneCreator.materialCreator, {
      darkMode: true,
      withRope: true,
    });

    const transform = {
      position: {
        x: 350,
        y: 500,
        z: 280,
      },
      rotation: {
        y: -Math.PI / 2,
      },
      scale: 1,
    };

    this.pageSceneCreator.setTransformParams(saturn, transform);

    this.addObject(saturn);
  }

  addCarpet() {
    const carpet = new Carpet(this.pageSceneCreator);

    this.addObject(carpet);
  }

  async addSonya() {
    const sonya = await this.pageSceneCreator.createObjectMesh({
      name: OBJECT_ELEMENTS.sonya,
      transform: {
        position: {
          x: 440,
          y: 120,
          z: 280,
        },
      },
    });

    this.animationManager.addRoomsPageAnimations(
      3,
      new Animation({
        func: (_, { startTime, currentTime }) => {
          sonya.position.y =
            120 + 10 * Math.sin((currentTime - startTime) / 500);
        },
        duration: "infinite",
        easing: easeInOutSine,
      })
    );

    sonya.traverse((obj) => {
      if (obj.name === "RightHand") {
        this.animationManager.addRoomsPageAnimations(
          3,
          new Animation({
            func: (_, { startTime, currentTime }) => {
              obj.rotation.y =
                degreesToRadians(-55) +
                degreesToRadians(5) *
                Math.cos(1.5 + (currentTime - startTime) / 500);
            },
            duration: "infinite",
            easing: easeInQuad,
          })
        );
      } else if (obj.name === "LeftHand") {
        this.animationManager.addRoomsPageAnimations(
          3,
          new Animation({
            func: (_, { startTime, currentTime }) => {
              obj.rotation.y =
                degreesToRadians(55) +
                degreesToRadians(5) *
                Math.cos(-1.5 + (currentTime - startTime) / 500);
            },
            duration: "infinite",
            easing: easeInQuad,
          })
        );
      }
    });

    this.addObject(sonya);
  }
}
