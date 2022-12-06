import * as THREE from "three";
import {degreesToRadians} from "../utils/degreesToRadians";
import {MaterialCreator} from '../creators/MaterialCreator';
import {MATERIAL_TYPE} from "../../constants";

export class Snowman extends THREE.Group {
  constructor(materialCreator) {
    super();

    this.materialCreator = materialCreator;
    this.constructChildren();
  }

  constructChildren() {
    this.addBottomSphere();
    this.addTopSphereWithCone();
  }

  addBottomSphere() {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(75, 32, 16),
      this.materialCreator.create(MATERIAL_TYPE.StrongMaterial, {
        color: MaterialCreator.Colors.SnowColor,
      })
    );

    mesh.position.set(0, 75 - 10, 0);

    this.add(mesh);
  }

  addTopSphereWithCone() {
    const topSphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(44, 32, 16),
      this.materialCreator.create(MATERIAL_TYPE.StrongMaterial, {
        color: MaterialCreator.Colors.SnowColor,
      })
    );

    const coneMesh = new THREE.Mesh(
      new THREE.ConeGeometry(18, 75, 32),
      this.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
        color: MaterialCreator.Colors.Orange,
      })
    );

    coneMesh.rotateX(degreesToRadians(90));
    coneMesh.position.set(0, 0, 40);

    topSphereMesh.add(coneMesh);

    topSphereMesh.position.set(0, 170, 0);

    this.add(topSphereMesh);
  }
}
