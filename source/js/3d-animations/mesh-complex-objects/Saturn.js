import * as THREE from "three";
import {LatheGeometryCreator} from "../creators/LatheGeometryCreator";
import {degreesToRadians} from "../utils/degreesToRadians";
import {MaterialCreator} from "../creators/MaterialCreator";
import {MATERIAL_TYPE, MESH_NAMES} from "../../constants";

export class Saturn extends THREE.Group {
  constructor(materialCreator, options) {
    super();

    this.materialCreator = materialCreator;
    this.options = options;
    this.constructChildren();
  }

  constructChildren() {
    this.addPlanet();
    this.addRing();

    if (this.options.withRope) {
      this.addRope();
      this.addSmallSphere();
    }
  }

  addRope() {
    const geometry = new THREE.CylinderGeometry(1, 1, 1000, 20);

    const cylinder = new THREE.Mesh(
      geometry,
      this.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
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
        this.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
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
      this.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
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
      this.materialCreator.create(MATERIAL_TYPE.SoftMaterial, {
        color: this.options.darkMode
          ? MaterialCreator.Colors.ShadowedBrightPurple
          : MaterialCreator.Colors.BrightPurple,
      })
    );

    ring.name = MESH_NAMES.SaturnRing;
    ring.rotateZ(degreesToRadians(-18));

    this.add(ring);
  }
}
