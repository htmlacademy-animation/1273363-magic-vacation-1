import {infrastructure} from "./initAnimationScreen";
import {LatheGeometryCreator} from "./creators/LatheGeometryCreator";
import {MaterialCreator} from "./creators/MaterialCreator";
import {MainPageScene} from "./scenes/main-page/MainPageScene";
import {SvgPathLoader} from "./loaders/SvgPathLoader";
import {EXTRUDE_SETTINGS, SVG_ELEMENTS} from "../constants";
import {ExtrudeSvgCreator} from "./creators/ExtrudeSvgCreator";
import {ObjectsCreator} from "./creators/ObjectCreator";
import {RoomsPageScene} from "./scenes/room-page/RoomsPageScene";
// import {TransformationGuiHelper} from "./ProjectGui/TransformationGuiHelper";
import {PageSceneCreator} from "./scenes/PageSceneCreator";
import {AnimationManager} from "./controllers/AnimationManager";
import {CameraRig} from "./rigs/CameraRig/CameraRig";

const materialCreator = new MaterialCreator();
const latheGeometryCreator = new LatheGeometryCreator();
const svgShapeLoader = new SvgPathLoader(SVG_ELEMENTS);
const extrudeSvgCreator = new ExtrudeSvgCreator(
  svgShapeLoader,
  EXTRUDE_SETTINGS
);
const objectCreator = new ObjectsCreator();
// const transformationGuiHelper = new TransformationGuiHelper();
const pageSceneCreator = new PageSceneCreator(
  materialCreator,
  extrudeSvgCreator,
  objectCreator,
  latheGeometryCreator
  // transformationGuiHelper
);

const animationManager = new AnimationManager();

export class SceneController {
  constructor() {
    this.isInit = false;

    this.previousRoomSceneIndex = 1;
  }

  addMainPageScene() {
    if (!this.mainPageScene) {
      this.mainPageScene = new MainPageScene(
        pageSceneCreator,
        animationManager
      );
    }

    infrastructure.addSceneObject(this.mainPageScene);
  }

  addRoomsPageScene() {
    this.roomsPageScene = new RoomsPageScene(
      pageSceneCreator,
      animationManager
    );

    this.roomsPageScene.position.set(0, -700, -3270);

    infrastructure.addSceneObject(this.roomsPageScene);
  }

  initScene(startSceneIndex) {
    this.addMainPageScene();
    this.addRoomsPageScene();

    this.addCameraRig(startSceneIndex);

    this.isInit = true;
  }

  addCameraRig(startSceneIndex) {
    this.cameraRig = new CameraRig(
      CameraRig.getCameraRigStageState(startSceneIndex)
    );

    this.cameraRig.addObjectToCameraNull(infrastructure.camera);
    this.cameraRig.addObjectToCameraNull(infrastructure.light);
    infrastructure.scene.add(this.cameraRig);
  }

  showMainScene() {
    this.cameraRig.changeStateTo(CameraRig.getCameraRigStageState(0));
  }

  showRoomScene(index) {
    if (typeof index === "number") {
      this.previousRoomSceneIndex = index;
    }

    this.cameraRig.changeStateTo(
      CameraRig.getCameraRigStageState(index || this.previousRoomSceneIndex)
    );
  }
}
