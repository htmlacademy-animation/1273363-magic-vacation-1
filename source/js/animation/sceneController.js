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

export const sceneController = {
  clearScene() {
    scene.clearScene();
  },

  addMainPageComposition() {
    const mainPageComposition = new MainPageScene(pageSceneCreator);
    scene.addSceneObject(mainPageComposition);
  },

  addRoomsPageComposition() {
    const positionZ = 2150;
    const positionY = 700;

    scene.camera.position.set(0, positionY, positionZ);
    scene.light.position.set(0, positionY, positionZ);

    scene.controls.target.set(
      0,
      positionY - positionZ * Math.tan(degreesToRadians(15)),
      0
    );

    const roomsPageScene = new RoomsPageScene(pageSceneCreator, scene);

    scene.addSceneObject(roomsPageScene);
  },

  addScreenMesh() {
    this.addRoomsPageComposition();
  },
};
