import * as THREE from "three";

export class Carpet {
  constructor(latheGeometryCreator, materialCreator) {
    const geometry = latheGeometryCreator.createGeometry(763, 180, 3, 16, 74);
    const material = materialCreator.create("CustomCarpetMaterial");

    return new THREE.Mesh(geometry, material);
  }
}
