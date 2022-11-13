import * as THREE from "three";
import {Mesh} from "three";
import {degreesToRadians} from "../utils/degreesToRadians";

export class Snowman extends THREE.Group {
  constructor(defaultMaterial) {
    super();

    this.defaultMaterial = defaultMaterial;
    this.constructChildren();
  }

  constructChildren() {
    this.addBottomSphere();
    this.addTopSphereWithCone();
  }

  addBottomSphere() {
    const mesh = new Mesh(
      new THREE.SphereGeometry(75, 32, 16),
      this.defaultMaterial
    );

    mesh.position.set(0, 75 - 10, 0);

    this.add(mesh);
  }

  addTopSphereWithCone() {
    const topSphereMesh = new Mesh(
      new THREE.SphereGeometry(44, 32, 16),
      this.defaultMaterial
    );

    const coneMesh = new Mesh(
      new THREE.ConeGeometry(18, 75, 32),
      this.defaultMaterial
    );

    coneMesh.rotateX(degreesToRadians(90));
    coneMesh.position.set(0, 0, 40);

    topSphereMesh.add(coneMesh);

    topSphereMesh.position.set(0, 170, 0);

    this.add(topSphereMesh);
  }
}
