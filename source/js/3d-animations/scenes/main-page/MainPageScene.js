import * as THREE from "three";
import {
  SVG_ELEMENTS,
  OBJECT_ELEMENTS,
  MATERIAL_TYPE,
} from "../../../constants";
import {MaterialCreator} from "../../creators/MaterialCreator";
import {Saturn} from "../../mesh-complex-objects/Saturn";
import {easeOutCubic} from "../../../helpers/easing";
import {
  createBounceAnimation,
  createObjectTransformAnimation,
} from "../../creators/animationCreators";

export class MainPageScene extends THREE.Group {
  constructor(pageSceneCreator, animationManager) {
    super();

    this.pageSceneCreator = pageSceneCreator;
    this.animationManager = animationManager;
    this.objectsLoaded = 0;

    this.meshExtrudedObjects = [
      {
        name: SVG_ELEMENTS.keyhole,
        extrude: {
          depth: 4,
          bevelThickness: 2,
          bevelSize: 2,
          material: this.pageSceneCreator.materialCreator.create(
            MATERIAL_TYPE.SoftMaterial,
            {
              color: MaterialCreator.Colors.DarkPurple,
            }
          ),
        },
        transform: {
          position: {
            x: 1000,
            y: 1000,
          },
          rotation: {
            z: Math.PI,
          },
        },
      },
      {
        name: SVG_ELEMENTS.flamingo,
        bounceAnimation: true,
        extrude: {
          depth: 8,
          bevelThickness: 2,
          bevelSize: 2,
          material: this.pageSceneCreator.materialCreator.create(
            MATERIAL_TYPE.SoftMaterial,
            {
              color: MaterialCreator.Colors.LightDominantRed,
            }
          ),
        },
        transform: {
          rotation: {
            x: 6.2,
            y: 0.5,
            z: 3.6,
          },
          scale: 0,
        },
        transformAppear: {
          position: {
            x: -460,
            y: 370,
            z: 140,
          },
          rotation: {
            x: 6.2,
            y: 0.5,
            z: 3.6,
          },
          scale: 1,
        },
      },
      {
        name: SVG_ELEMENTS.snowflake,
        bounceAnimation: true,
        extrude: {
          depth: 8,
          bevelThickness: 2,
          bevelSize: 2,
          material: this.pageSceneCreator.materialCreator.create(
            MATERIAL_TYPE.BasicMaterial,
            {
              color: MaterialCreator.Colors.Blue,
            }
          ),
        },
        transform: {
          rotation: {
            x: 6.1,
            y: -1,
            z: 0.3,
            },
          scale: 0,
        },
        transformAppear: {
          position: {
            x: -320,
            y: -20,
            z: 90,
          },
          rotation: {
            x: 6.1,
            y: 0.7,
            z: 0.3,
          },
          scale: 1,
        },
      },
      {
        name: SVG_ELEMENTS.leaf,
        bounceAnimation: true,
        extrude: {
          depth: 8,
          bevelThickness: 2,
          bevelSize: 2,
          material: this.pageSceneCreator.materialCreator.create(
            MATERIAL_TYPE.BasicMaterial,
            {
              color: MaterialCreator.Colors.Green,
            }
          ),
        },
        transform: {
          rotation: {
            x: -1,
            y: 1,
            z: 4.3,
          },
          scale: 0,
        },
        transformAppear: {
          position: {
            x: 500,
            y: 290,
            z: 100,
          },
          rotation: {
            x: -0.2,
            y: 2.5,
            z: 4.3,
          },
          scale: 1,
        },
      },
      {
        name: SVG_ELEMENTS.question,
        bounceAnimation: true,
        extrude: {
          depth: 8,
          bevelThickness: 2,
          bevelSize: 2,
          material: this.pageSceneCreator.materialCreator.create(
            MATERIAL_TYPE.BasicMaterial,
            {
              color: MaterialCreator.Colors.Blue,
            }
          ),
        },
        transform: {
          rotation: {
            x: -1.6,
            y: 2,
            z: 2.8,
          },
          scale: 0,
        },
        transformAppear: {
          position: {
            x: 140,
            y: -260,
            z: 50,
          },
          rotation: {
            x: -0.7,
            y: 3.2,
            z: 2.8,
          },
          scale: 1,
        },
      },
    ];

    this.meshObjects = [
      {
        name: OBJECT_ELEMENTS.watermelon,
        bounceAnimation: true,
        transform: {
          rotation: {
            x: 0,
            y: 3.3,
            z: 0,
          },
          scale: 0,
        },
        transformAppear: {
          position: {
            x: -600,
            y: -240,
            z: 200,
          },
          rotation: {
            x: 0.3,
            y: 3.3,
            z: 0.8,
          },
          scale: 1.8,
        },
      },
      /*{
        name: OBJECT_ELEMENTS.airplane,
        transform: {
          position: {
             x: 190,
             y: 120,
             z: 70,
           },
           rotation: {
             x: 0.7,
             y: 2.4,
             z: 0,
           },
           scale: 1,
        },
        material: this.pageSceneCreator.materialCreator.create(
          MATERIAL_TYPE.BasicMaterial,
          {
            color: MaterialCreator.Colors.White,
          }
        ),
      },
      {
        name: OBJECT_ELEMENTS.suitcase,
        transform: {
          position: {
             x: -60,
             y: -120,
             z: 120,
           },
           rotation: {
             x: 0.5,
             y: 3.8,
             z: 0.2,
           },
           scale: 0.4,
        },
      },*/
    ];

    this.constructChildren();
  }

  constructChildren() {
    this.addMeshObjects();
    this.addExtrudedSvgObjects();
    this.addPlaneMeshBehindKeyhole();

    this.addSaturn();
  }

  addMeshObjects() {
    this.meshObjects.forEach((config) => {
      this.pageSceneCreator.createObjectMesh(config, this.addObject(config));
    });
  }

  addExtrudedSvgObjects() {
    this.meshExtrudedObjects.forEach((config) => {
      this.pageSceneCreator.createExtrudedSvgMesh(
        config,
        this.addObject(config)
      );
    });
  }

  addObject(config) {
    return (obj) => {
      if (config.transformAppear) {
        this.animationManager.addAnimations(
          createObjectTransformAnimation(obj, config.transformAppear, {
            duration: 1500,
            delay: 500,
            easing: easeOutCubic,
          })
        );
      }

      if (config.bounceAnimation) {
        this.animationManager.addAnimations(createBounceAnimation(obj));
      }

      this.addMesh(obj);
    };
  }

  addSaturn() {
    const saturn = new Saturn(this.pageSceneCreator.materialCreator, {
      darkMode: false,
      withRope: false,
    });

    this.pageSceneCreator.setTransformParams(saturn, {
      rotation: { y: 3.6, z: 1 },
      scale: 0,
    });

    this.pageSceneCreator.setTransformParams(saturn, transform.from);

    this.animationManager.addAnimations(
      createObjectTransformAnimation(
        saturn,
        {
          position: { x: 350, y: -120, z: 140 },
          rotation: { y: 3.6, z: 0 },
          scale: 0.5,
        },
        {
          duration: 1500,
          delay: 500,
          easing: easeOutCubic,
        }
      )
    );

    this.animationManager.addAnimations(createBounceAnimation(saturn));

    this.addMesh(saturn);
  }

  addPlaneMeshBehindKeyhole() {
    const meshBehindTheKeyHole = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400, 2, 2),
      this.pageSceneCreator.materialCreator.create(
        MATERIAL_TYPE.BasicMaterial,
        {
          color: MaterialCreator.Colors.Purple,
        }
      )
    );

    meshBehindTheKeyHole.position.set(0, 0, -10);

    this.addMesh(meshBehindTheKeyHole);
  }

  addMesh(mesh) {
    this.objectsLoaded++;

    this.add(mesh);

    if (
      this.objectsLoaded ===
      this.meshObjects.length + this.meshExtrudedObjects.length + 2
    ) {
      this.animationManager.startAnimations();
    }
  }
}
