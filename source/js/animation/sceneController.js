import {scene} from "./initAnimationScreen";
import {LatheGeometryCreator} from "./LatheGeometryCreator";
import {MaterialCreator} from "./MaterialCreator";
import {MainPageScene} from "../scenes/main-page/MainPageScene";
import {SvgPathLoader} from "../helpers/SvgPathLoader";
import {EXTRUDE_SETTINGS, SVG_ELEMENTS} from "../constants";
import {ExtrudeSvgCreator} from "../helpers/ExtrudeSvgCreator";
import {ObjectsCreator} from "../helpers/ObjectCreator";
import {RoomsPageScene} from "../scenes/room-page/RoomsPageScene";
import {degreesToRadians} from "../utils/degreesToRadians";
import {TransformationGuiHelper} from "../helpers/TransformationGuiHelper";
import {PageSceneCreator} from "../scenes/PageSceneCreator";
import {AnimationManager} from './AnimationManager';

const materialCreator = new MaterialCreator();
const latheGeometryCreator = new LatheGeometryCreator();
const svgShapeLoader = new SvgPathLoader(SVG_ELEMENTS);
const extrudeSvgCreator = new ExtrudeSvgCreator(
  svgShapeLoader,
  EXTRUDE_SETTINGS
);
const objectCreator = new ObjectsCreator();
const transformationGuiHelper = new TransformationGuiHelper();
const pageSceneCreator = new PageSceneCreator(
  materialCreator,
  extrudeSvgCreator,
  objectCreator,
  latheGeometryCreator,
  transformationGuiHelper
);

const animationManager = new AnimationManager();

export const sceneController = {
  ainPageScene: null,
  roomsPageScene: null,

  clearScene() {
    scene.clearScene();
  },

  addMainPageScene() {
    this.clearScene();

    if (!this.mainPageScene) {
      this.mainPageScene = new MainPageScene(pageSceneCreator, animationManager);
    }

    scene.addSceneObject(this.mainPageScene);
  },

  addRoomsPageScene() {
    this.clearScene();

    const positionZ = 2150;
    const positionY = 700;

    scene.camera.position.set(0, positionY, positionZ);
    scene.light.position.set(0, positionY, positionZ);

    scene.controls.target.set(
      0,
      positionY - positionZ * Math.tan(degreesToRadians(15)),
      0
    );

    if (!this.roomsPageScene) {
      this.roomsPageScene = new RoomsPageScene(pageSceneCreator, scene);
    }

    scene.addSceneObject(this.roomsPageScene);
  },

  addScene() {
    this.addMainPageScene();

    // this.addRoomsPageScene();
  },
};
