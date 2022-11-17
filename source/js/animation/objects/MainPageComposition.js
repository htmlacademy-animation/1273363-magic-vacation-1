import * as THREE from "three";
import {SvgPathLoader} from "../../helpers/SvgPathLoader";
import {EXTRUDE_SETTINGS, SVG_FORMS} from "../../constants";
import {ExtrudeSvgFactory} from "../../helpers/ExtrudeSvg";
import {degreesToRadians} from "../../utils/degreesToRadians";
import {MaterialCreator} from "../MaterialCreator";

const svgShapeLoader = new SvgPathLoader(SVG_FORMS);

export class MainPageComposition extends THREE.Group {
  constructor(materialCreator) {
    super();

    this.extrudeSvgFactory = new ExtrudeSvgFactory(
      svgShapeLoader,
      EXTRUDE_SETTINGS
    );
    this.materialCreator = materialCreator;
    this.constructChildren();
  }

  constructChildren() {
    this.addKeyHoleBackground();
    this.addExtrudedSvg();
  }

  async addKeyHoleBackground() {
    const keyholeMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.keyhole,
      { depth: 4, bevelThickness: 2, bevelSize: 2 }
    );

    keyholeMesh.rotateZ(degreesToRadians(180));
    keyholeMesh.position.set(1000, 1000, -200);

    const meshBehindTheKeyHole = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      this.materialCreator.create("BasicMaterial", {
        color: MaterialCreator.Colors.Purple,
      })
    );
    meshBehindTheKeyHole.position.set(0, 0, -210);

    this.add(keyholeMesh);
    this.add(meshBehindTheKeyHole);
  }

  async addExtrudedSvg() {
    const flamingoMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.flamingo,
      {
        depth: 8,
        bevelThickness: 2,
        bevelSize: 2,
        material: this.materialCreator.create("SoftMaterial", {
          color: MaterialCreator.Colors.LightDominantRed,
        }),
      }
    );
    const snowflakeMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.snowflake,
      {
        depth: 8,
        bevelThickness: 2,
        bevelSize: 2,
        material: this.materialCreator.create("BasicMaterial", {
          color: MaterialCreator.Colors.Blue,
        }),
      }
    );
    const questionMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.question,
      {
        depth: 8,
        bevelThickness: 2,
        bevelSize: 2,
        material: this.materialCreator.create("BasicMaterial", {
          color: MaterialCreator.Colors.Blue,
        }),
      }
    );
    const leafMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.leaf,
      {
        depth: 8,
        bevelThickness: 2,
        bevelSize: 2,
        material: this.materialCreator.create("BasicMaterial", {
          color: MaterialCreator.Colors.Green,
        }),
      }
    );

    const flowerMesh = await this.extrudeSvgFactory.createAndAddToTheScene(
      SVG_FORMS.flower,
      {
        depth: 4,
        bevelThickness: 2,
        bevelSize: 2,
      }
    );

    flamingoMesh.position.set(-100, 62, 0);
    flamingoMesh.rotateX(Math.PI);

    questionMesh.position.set(0, 200, 0);
    questionMesh.rotateZ(Math.PI);
    questionMesh.rotateY(Math.PI);

    leafMesh.position.set(120, 0, 0);

    flowerMesh.rotateZ(Math.PI);
    flowerMesh.position.set(200, -200, 0);

    this.add(flamingoMesh);
    this.add(snowflakeMesh);
    this.add(questionMesh);
    this.add(leafMesh);
    this.add(flowerMesh);
  }
}
