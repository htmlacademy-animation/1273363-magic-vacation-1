import * as THREE from "three";

export class Road {
  constructor(latheGeometryCreator, materialCreator) {
    const geometry = latheGeometryCreator.createGeometry(732, 160, 3, 0, 90);
    const material = materialCreator.create("CustomRoadMaterial");

    return new THREE.Mesh(geometry, material);
  }
}
