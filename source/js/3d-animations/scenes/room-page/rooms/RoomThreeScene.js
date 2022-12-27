import {RoomScene} from "../RoomScene";
import * as THREE from "three";
import {MATERIAL_TYPE, OBJECT_ELEMENTS} from "../../../../constants";
import {MaterialCreator} from "../../../creators/MaterialCreator";
import {Snowman} from "../../../mesh-complex-objects/Snowman";
import {Road} from "../../../mesh-complex-objects/Road";
import {degreesToRadians} from "../../../utils/degreesToRadians";
import Animation from "../../../../Animation/animation";
import {easeInQuad} from "../../../../helpers/easing";

export class RoomThreeScene extends RoomScene {
  constructor(pageSceneCreator, animationManager) {
    super(pageSceneCreator, animationManager);

    this.wall = {
      name: OBJECT_ELEMENTS.wallCorner,
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.SoftMaterial,
        {
          color: MaterialCreator.Colors.SkyLightBlue,
          side: THREE.DoubleSide,
        }
      ),
    };
    this.floor = {
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.SoftMaterial,
        {
          color: MaterialCreator.Colors.MountainBlue,
        }
      ),
    };
    this.staticOutput = {
      name: OBJECT_ELEMENTS.staticOutput3,
    };
  }

  async constructChildren() {
    await super.constructChildren();

    this.addSnowman();
    this.addRoad();
    this.addRoadBlocks();
    await this.addCompass();
  }

  addSnowman() {
    const snowman = new Snowman(this.pageSceneCreator.materialCreator);
    const transform = {
      position: {
        x: 210,
        y: 50,
        z: 400,
      },
      rotation: {
        y: Math.PI / 2,
      },
      scale: 1,
    };

    this.pageSceneCreator.setTransformParams(snowman, transform);

    this.addObject(snowman);
  }

  addRoad() {
    const road = new Road(this.pageSceneCreator);

    this.addObject(road);
  }

  addRoadBlocks() {
    const geometry = new THREE.CylinderGeometry(12, 12, 80, 20);

    const radius = 700;
    const cylindersAmount = 5;
    const angleBetweenBlocks = degreesToRadians(15);

    const outerAngle = Math.PI / 2 - angleBetweenBlocks * cylindersAmount;

    const cylinder = new THREE.Mesh(
      geometry,
      this.pageSceneCreator.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
        color: MaterialCreator.Colors.Grey,
      })
    );

    new Array(cylindersAmount)
      .fill(0)
      .map((_, index) => outerAngle + index * angleBetweenBlocks)
      .forEach((angle) => {
        const clone = cylinder.clone();

        const transform = {
          position: {
            x: radius * Math.cos(angle),
            y: 40,
            z: radius * Math.sin(angle),
          },
        };

        this.pageSceneCreator.setTransformParams(clone, transform);

        this.addObject(clone);
      });
  }

  async addCompass() {
    const compass = await this.pageSceneCreator.createObjectMesh({
      name: OBJECT_ELEMENTS.compass,
    });

    compass.traverse((obj) => {
      if (obj.name === "Compas") {
        this.animationManager.addRoomsPageAnimations(
          2,
          new Animation({
            func: (_, { startTime, currentTime }) => {
              obj.rotation.z =
                degreesToRadians(10) *
                Math.sin((currentTime - startTime) / 1000);
            },
            duration: "infinite",
            easing: easeInQuad,
          })
        );
      }
    });

    this.addObject(compass);
  }
}
