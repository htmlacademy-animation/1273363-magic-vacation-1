import * as THREE from "three";

export class RoomScene extends THREE.Group {
  constructor(pageSceneCreator) {
    super();

    this.pageSceneCreator = pageSceneCreator;
  }

  constructChildren() {
    this.addWalls();
    this.addFloor();
    this.addStaticOutput();
  }

  addObject(object) {
    object.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    this.add(object);
  }

  addWalls() {
    this.pageSceneCreator.createObjectMesh(this.wall, (obj) => {
      this.addObject(obj);
    });
  }

  addFloor() {
    const geometry = new THREE.CircleGeometry(2000, 8, 0, Math.PI / 2);

    const floor = new THREE.Mesh(geometry, this.floor.material);

    floor.rotation.set(0, -Math.PI / 2, -Math.PI / 2, "ZYX");

    this.addObject(floor);
  }

  addStaticOutput() {
    this.pageSceneCreator.createObjectMesh(this.staticOutput, (obj) => {
      this.addObject(obj);
    });
  }
}
