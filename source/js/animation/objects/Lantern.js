import * as THREE from "three";
import {MaterialCreator} from '../MaterialCreator';

export class Lantern extends THREE.Group {
  constructor(materialCreator) {
    super();

    this.materialCreator = materialCreator;
    this.constructChildren();
  }

  constructChildren() {
    this.addFooting();
    this.addKernel();
    this.addLight();
  }

  addKernel() {
    const height = 230;
    const geometry = new THREE.CylinderGeometry(7, 7, height, 40);

    const cylinder = new THREE.Mesh(geometry, this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.Blue}));

    cylinder.position.set(0, height / 2 + 120, 0);

    this.add(cylinder);
  }

  addLight() {
    const light = new THREE.Group();

    let mesh = new THREE.Mesh(
      new THREE.BoxGeometry(37, 4, 37),
      this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.Blue})
    );

    light.add(mesh);

    mesh = new THREE.Mesh(
      this.getTruncatedPyramidGeometry(42, 32, 60),
      this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.LightBlue})
    );

    mesh.position.set(0, 32, 0);

    light.add(mesh);

    mesh = new THREE.Mesh(
      this.getTruncatedPyramidGeometry(45, 57, 6),
      this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.Blue})
    );

    mesh.position.set(0, 70, 0);

    light.add(mesh);

    light.position.set(0, 350, 0);

    this.add(light);
  }

  addFooting() {
    const geometry = new THREE.CylinderGeometry(16, 16, 120, 40);

    const cylinder = new THREE.Mesh(geometry, this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.Blue}));

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(16, 32, 32),
      this.materialCreator.create('SoftMaterial',{color: MaterialCreator.Colors.Blue})
    );

    sphere.position.set(0, 60, 0);

    cylinder.add(sphere);

    cylinder.position.set(0, 60, 0);

    this.add(cylinder);
  }

  getTruncatedPyramidGeometry(topSideWidth, bottomSideWidth, height) {
    const geometry = new THREE.BoxGeometry(
      bottomSideWidth,
      height,
      bottomSideWidth
    );

    geometry.vertices.forEach((v) => {
      if (v.y > 0) {
        v.x = (v.x * topSideWidth) / bottomSideWidth;
        v.y = (v.y * topSideWidth) / bottomSideWidth;
        v.z = (v.z * topSideWidth) / bottomSideWidth;
      }
    });

    geometry.verticesNeedUpdate = true;

    return geometry;
  }
}
