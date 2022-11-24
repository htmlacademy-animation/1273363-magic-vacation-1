import * as THREE from "three";
import {MATERIAL_TYPE} from "../../constants";

export class Carpet {
  constructor(latheGeometryCreator, materialCreator) {
    const geometry = latheGeometryCreator.createGeometry(763, 180, 3, 16, 74);
    const material = materialCreator.create(MATERIAL_TYPE.CustomCarpetMaterial);

    return new THREE.Mesh(geometry, material);
  }
}
