import {scene} from "./initAnimationScreen";
import {SceneWithLantern} from '../scenes/SceneWithLantern';
import {LatheGeometryCreator} from "./LatheGeometryCreator";
import {Saturn} from "./objects/Saturn";
import {MaterialCreator} from "./MaterialCreator";
import * as THREE from "three";
import {GUI} from "dat.gui";
import {MainPageComposition} from "./objects/MainPageComposition";

const gui = new GUI();
const materialCreator = new MaterialCreator(scene, gui);
const latheGeometryCreator = new LatheGeometryCreator(materialCreator);

scene.addSceneObject(gui);

export const sceneController = {
  clearScene() {
    scene.clearScene();
  },

  addRoadAndCarpet() {
    const road = latheGeometryCreator.createRoad();
    const carpet = latheGeometryCreator.createCarpet();
    road.position.set(0, 100, 0);

    scene.addSceneObject(road);
    scene.addSceneObject(carpet);
  },

  addSaturn() {
    const saturn = new Saturn(materialCreator, { darkMode: false });

    saturn.position.set(0, 500, 0);

    scene.addSceneObject(saturn);
  },

  addDarkSaturn() {
    const saturn = new Saturn(materialCreator, { darkMode: true });

    saturn.position.set(300, 500, 0);

    scene.addSceneObject(saturn);
  },

  addSpheres() {
    const spheresGroup = new THREE.Group();

    const geometry = new THREE.SphereGeometry(100, 32, 32);

    const sphere1 = new THREE.Mesh(geometry);
    const sphere2 = new THREE.Mesh(geometry);
    const sphere3 = new THREE.Mesh(geometry);
    const sphere4 = new THREE.Mesh(geometry);
    const sphere5 = new THREE.Mesh(geometry);
    const sphere6 = new THREE.Mesh(geometry);

    sphere1.position.set(-110, 110, 0);
    sphere2.position.set(-110, -110, 0);
    sphere3.position.set(110, 110, 0);
    sphere4.position.set(110, -110, 0);
    sphere5.position.set(330, 110, 0);
    sphere6.position.set(330, -110, 0);

    sphere1.material = materialCreator.create("SoftMaterial", {
      color: MaterialCreator.Colors.Blue,
    });

    sphere2.material = materialCreator.create("SoftMaterial", {
      color: MaterialCreator.Colors.DarkBlue,
    });

    sphere3.material = materialCreator.create("BasicMaterial", {
      color: MaterialCreator.Colors.Blue,
    });

    sphere4.material = materialCreator.create("BasicMaterial", {
      color: MaterialCreator.Colors.DarkBlue,
    });

    sphere5.material = materialCreator.create("StrongMaterial", {
      color: MaterialCreator.Colors.Blue,
    });

    sphere6.material = materialCreator.create("StrongMaterial", {
      color: MaterialCreator.Colors.DarkBlue,
    });

    spheresGroup.add(sphere1);
    spheresGroup.add(sphere2);
    spheresGroup.add(sphere3);
    spheresGroup.add(sphere4);
    spheresGroup.add(sphere5);
    spheresGroup.add(sphere6);

    spheresGroup.translateY(-400);

    scene.addSceneObject(spheresGroup);
  },

  addMainPageComposition() {
    const mainPageComposition = new MainPageComposition(materialCreator);

    mainPageComposition.position.set(0, 0, -400);

    scene.addSceneObject(mainPageComposition);
  },

  addSceneWithLantern() {
    scene.addSceneObject(new SceneWithLantern(materialCreator));
  },

  addScreenMesh() {
    // this.addSceneWithLantern();

    // this.addSpheres();

    // this.addSaturn();
    // this.addDarkSaturn();

    // this.addMainPageComposition();

    this.addRoadAndCarpet();
  },
};
