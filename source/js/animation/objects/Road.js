import * as THREE from "three";
import {MATERIAL_TYPE} from "../../constants";

export class Road {
  constructor(latheGeometryCreator, materialCreator) {
    const geometry = latheGeometryCreator.createGeometry(732, 160, 3, 0, 90);
    const material = materialCreator.create(MATERIAL_TYPE.CustomRoadMaterial);

    return new THREE.Mesh(geometry, material);
  }
}
