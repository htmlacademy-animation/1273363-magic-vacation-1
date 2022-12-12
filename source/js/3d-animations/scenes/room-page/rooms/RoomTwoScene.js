import {RoomScene} from "../RoomScene";
import * as THREE from "three";
import {MATERIAL_TYPE, OBJECT_ELEMENTS, SVG_ELEMENTS} from "../../../../constants";
import {MaterialCreator} from "../../../creators/MaterialCreator";
import {Lantern} from '../../../mesh-complex-objects/Lantern';
import Animation from "../../../../Animation/animation";
import {easeInOutSine} from "../../../../helpers/easing";

export class RoomTwoScene extends RoomScene {
  constructor(pageSceneCreator, animationManager) {
    super(pageSceneCreator, animationManager);

    this.wall = {
      name: OBJECT_ELEMENTS.wallCorner,
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.BasicMaterial,
        {
          color: MaterialCreator.Colors.Blue,
          side: THREE.DoubleSide,
        }
      ),
    };
    this.floor = {
      material: this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.SoftMaterial,
        {
          color: MaterialCreator.Colors.BrightBlue,
        }
      ),
    };

    this.staticOutput = {
      name: OBJECT_ELEMENTS.staticOutput2,
    };

    this.constructChildren();
  }

  constructChildren() {
    super.constructChildren();

    this.addLeaves();
    this.addPyramid();
    this.addLantern();
  }

  addLeaves() {
    const config = {
      name: SVG_ELEMENTS.leaf,
      extrude: {
        depth: 2,
        bevelThickness: 1,
        bevelSize: 1,
      },
      transform: {
        position: {
          x: 0,
          y: 76,
          z: 128,
        },
        rotation: {
          x: -2.6,
          y: -Math.PI / 2,
        },
        scale: 1.1,
      },
    };

    const group = new THREE.Group();
    const groupLeaf1 = new THREE.Group();
    const groupLeaf2 = new THREE.Group();

    this.pageSceneCreator.createExtrudedSvgMesh(config, (leaf1) => {
      const leaf2 = leaf1.clone();

      this.pageSceneCreator.setTransformParams(leaf2, {
        position: {
          x: 0,
          y: 320,
          z: 80,
        },
        rotation: {
          x: 2.9,
          y: -Math.PI / 2,
        },
        scale: 2.5,
      });

      group.position.set(80, 20, 330);

      this.animationManager.addAnimations(
        new Animation({
          func: (_, { startTime, currentTime }) => {
            const time = ((currentTime - startTime) / 300) % 16;
            groupLeaf1.rotation.x = 0.3 * Math.exp(-0.2*time) * Math.cos(1.2* time + Math.PI / 2);
          },
          duration: "infinite",
          easing: easeInOutSine,
        }),
        new Animation({
          func: (_, { startTime, currentTime }) => {
            const time = ((currentTime - startTime) / 300) % 16;
            groupLeaf2.rotation.x = 0.4 * Math.exp(-0.2*time) * Math.cos(time + Math.PI / 2);
          },
          duration: "infinite",
          easing: easeInOutSine,
        })
      );

      groupLeaf1.add(leaf1);
      groupLeaf2.add(leaf2);

      group.add(groupLeaf1);
      group.add(groupLeaf2);

      this.addObject(group);
    });
  }

  addPyramid() {
    const pyramid = new THREE.Mesh(
      new THREE.ConeGeometry(250 / Math.pow(2, 0.5), 280, 4),
      this.pageSceneCreator.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
        color: MaterialCreator.Colors.Blue,
      })
    );

    const transform = {
      position: {
        x: 190,
        y: 140,
        z: 230,
      },
      rotation: {
        y: -Math.PI / 4,
      },
      scale: 1,
    };

    this.pageSceneCreator.setTransformParams(pyramid, transform);

    this.addObject(pyramid);
  }

  addLantern() {
    const lantern = new Lantern(this.pageSceneCreator.materialCreator);

    const transform = {
      position: {
        x: 640,
        y: 0,
        z: 110,
      },
      rotation: {
        y: -0.3,
      },
      scale: 1,
    };

    this.pageSceneCreator.setTransformParams(lantern, transform);

    this.addObject(lantern);
  }
}
