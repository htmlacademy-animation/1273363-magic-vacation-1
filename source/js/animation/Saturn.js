import * as THREE from "three";
import {LatheGeometryCreator} from "./LatheGeometryCreator";
import {degreesToRadians} from "../utils/degreesToRadians";

export class Saturn extends THREE.Group {
  constructor() {
    super();

    this.defaultMaterial = this.getMaterial();
    this.constructChildren();
  }

  constructChildren() {
    this.addRope();
    this.addPlanet();
    this.addSmallSphere();
    this.addRing();
  }

  addRope() {
    const geometry = new THREE.CylinderGeometry(1, 1, 1000, 20);

    const cylinder = new THREE.Mesh(geometry, this.getMaterial(0x8996A8));

    cylinder.position.set(0, 500, 0);

    this.add(cylinder);
  }

  addPlanet() {
    const geometry = new THREE.SphereGeometry(60, 32, 32);

    this.add(new THREE.Mesh(geometry, this.getMaterial(0xFF0038)));
  }

  addSmallSphere() {
    const geometry = new THREE.SphereGeometry(10, 16, 16);

    const sphere = new THREE.Mesh(geometry, this.defaultMaterial);

    sphere.position.set(0, 120, 0);

    this.add(sphere);
  }

  addRing() {
    const geometry = new LatheGeometryCreator().createGeometry(80, 40, 2);

    const ring = new THREE.Mesh(geometry, this.defaultMaterial);

    ring.rotateZ(degreesToRadians(-18));

    this.add(ring);
  }

  getMaterial(color = 0x7E46E9) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.05,
      emissive: 0x0,
      roughness: 0.5,
    });
  }
}
