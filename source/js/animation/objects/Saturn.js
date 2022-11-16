import * as THREE from "three";
import {LatheGeometryCreator} from "../LatheGeometryCreator";
import {degreesToRadians} from "../../utils/degreesToRadians";
import {MaterialCreator} from "../MaterialCreator";

export class Saturn extends THREE.Group {
  constructor(materialCreator, options) {
    super();

    this.materialCreator = materialCreator;
    this.options = options;
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

    const cylinder = new THREE.Mesh(
      geometry,
      this.materialCreator.create("SoftMaterial", {
        color: MaterialCreator.Colors.MetalGrey,
      })
    );

    cylinder.position.set(0, 500, 0);

    this.add(cylinder);
  }

  addPlanet() {
    const geometry = new THREE.SphereGeometry(60, 32, 32);

    this.add(
      new THREE.Mesh(
        geometry,
        this.materialCreator.create("SoftMaterial", {
          color: this.options.darkMode
            ? MaterialCreator.Colors.ShadowedDominantRed
            : MaterialCreator.Colors.DominantRed,
        })
      )
    );
  }

  addSmallSphere() {
    const geometry = new THREE.SphereGeometry(10, 16, 16);

    const sphere = new THREE.Mesh(
      geometry,
      this.materialCreator.create("SoftMaterial", {
        color: this.options.darkMode
          ? MaterialCreator.Colors.ShadowedBrightPurple
          : MaterialCreator.Colors.BrightPurple,
      })
    );

    sphere.position.set(0, 120, 0);

    this.add(sphere);
  }

  addRing() {
    const geometry = new LatheGeometryCreator().createGeometry(80, 40, 2);

    const ring = new THREE.Mesh(
      geometry,
      this.materialCreator.create("SoftMaterial", {
        color: this.options.darkMode
          ? MaterialCreator.Colors.ShadowedBrightPurple
          : MaterialCreator.Colors.BrightPurple,
      })
    );

    ring.rotateZ(degreesToRadians(-18));

    this.add(ring);
  }
}
