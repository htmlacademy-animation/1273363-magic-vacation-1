import * as THREE from "three";
import {degreesToRadians} from "../utils/degreesToRadians";

export class LatheGeometryCreator {
  constructor(materialCreator) {
    this.materialCreator = materialCreator
  }

  createRoad() {
    const geometry = this.createGeometry(732, 160, 3, 0, 90);
    const material = this.materialCreator.create("CustomRoadMaterial");

    return new THREE.Mesh(geometry, material);
  }

  createCarpet() {
    const geometry = this.createGeometry(763, 180, 3, 16, 74);
    const material = this.materialCreator.create("CustomCarpetMaterial");

    return new THREE.Mesh(geometry, material);
  }

  createGeometry(innerRadius, width, height, angleStart, angleEnd) {
    const points = [];
    points.push(new THREE.Vector2(innerRadius + width, 0));
    points.push(new THREE.Vector2(innerRadius + width, height));
    points.push(new THREE.Vector2(innerRadius, height));
    points.push(new THREE.Vector2(innerRadius, 0));
    points.push(new THREE.Vector2(innerRadius + width, 0));
    return new THREE.LatheGeometry(
      points,
      30,
      degreesToRadians(angleStart),
      degreesToRadians(angleEnd - angleStart)
    );
  }
}
