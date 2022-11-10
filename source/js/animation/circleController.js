import * as THREE from "three";
import { scene } from "./initAnimationScreen";

export const circleController = {
  clearScene() {
    scene.clearScene();
  },

  addScreenMesh() {
    const geometry = new THREE.SphereGeometry(200, 32, 32);

    const material = new THREE.MeshStandardMaterial({
      color: 0x0020D5,
      metalness: 0.05,
      emissive: 0x0,
      roughness: 0.5,
    });

    scene.addSceneObject(new THREE.Mesh(geometry, material));
  },
};
