import {infrastructure} from "./initInfrastructure";
import {LatheGeometryCreator} from "./creators/LatheGeometryCreator";
import {MaterialCreator} from "./creators/MaterialCreator";
import {MainPageScene} from "./scenes/main-page/MainPageScene";
import {SvgPathLoader} from "./loaders/SvgPathLoader";
import {
  BACKGROUND_AXIS_POSITION_Z,
  EXTRUDE_SETTINGS,
  OBJECT_ELEMENTS,
  SVG_ELEMENTS,
} from "../constants";
import {ExtrudeSvgCreator} from "./creators/ExtrudeSvgCreator";
import {ObjectsCreator} from "./creators/ObjectCreator";
import {RoomsPageScene} from "./scenes/room-page/RoomsPageScene";
// import {TransformationGuiHelper} from "./ProjectGui/TransformationGuiHelper";
import {PageSceneCreator} from "./scenes/PageSceneCreator";
import {AnimationManager} from "./controllers/AnimationManager";
import {CameraRigDesktop} from "./rigs/CameraRig/CameraRigDesktop";
import {createObjectTransformAnimation} from "./creators/animationCreators";
import {
  easeInCubic,
  easeInOutSine,
  easeOutCubic,
} from "../helpers/easing";
import * as THREE from "three";
import {degreesToRadians} from "./utils/degreesToRadians";
import {CameraRigMobile} from "./rigs/CameraRig/CameraRigMobile";

const textureLoader = new THREE.TextureLoader();
const materialCreator = new MaterialCreator(textureLoader);
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
    this.previousRoomIndex = 1;
    this.isSuitcaseAppear = false;
    this.isMainPageObjectsAppear = false;

    this.eventHandlerTick = null;

    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener("resize", this.onResize);
  }

  onResize() {
    this.addCameraRig();
  }

  async initScene(startSceneIndex) {
    this.sceneIndex = startSceneIndex;

    await this.addMainPageScene();
    await this.addRoomsPageScene();
    await this.initSuitCase();

    if (startSceneIndex === 0) {
      animationManager.startMainPageAnimations();
      this.isMainPageObjectsAppear = true;
    } else {
      animationManager.startRoomAnimations(0);
      animationManager.startSuitcaseAnimations();
      this.isSuitcaseAppear = true;
    }

    this.addCameraRig();
  }

  async addMainPageScene() {
    this.mainPageScene = new MainPageScene(pageSceneCreator, animationManager);

    await this.mainPageScene.constructChildren();

    this.mainPageScene.position.z = -BACKGROUND_AXIS_POSITION_Z;

    infrastructure.addSceneObject(this.mainPageScene);
  }

  async addRoomsPageScene() {
    this.roomsPageScene = new RoomsPageScene(
      pageSceneCreator,
      animationManager
    );

    await this.roomsPageScene.constructChildren();

    this.roomsPageScene.position.set(0, -800, -BACKGROUND_AXIS_POSITION_Z);

    infrastructure.addSceneObject(this.roomsPageScene);
  }

  async initSuitCase() {
    const suitcase = await pageSceneCreator.createObjectMesh({
      name: OBJECT_ELEMENTS.suitcase,
      transform: {
        position: {
          x: -340,
          y: 150,
          z: 750,
        },
        rotation: {
          y: -0.4,
        },
      },
    });

    this.suitcase = new THREE.Group();

    this.suitcase.position.y = this.roomsPageScene.position.y;

    this.suitcase.add(suitcase);

    suitcase.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    animationManager.addSuitcaseAnimations(
      createObjectTransformAnimation(
        suitcase,
        {
          position: {
            y: 0,
          },
          scale: {
            x: 0.95,
            y: 1.1,
            z: 0.95,
          },
        },
        {
          duration: 300,
          easing: easeInCubic,
        }
      ),
      createObjectTransformAnimation(
        suitcase,
        {
          position: {
            y: 2,
          },
          scale: {
            x: 1.05,
            y: 0.93,
            z: 1.05,
          },
        },
        {
          duration: 150,
          delay: 300,
          easing: easeOutCubic,
        }
      ),
      createObjectTransformAnimation(
        suitcase,
        {
          position: {
            y: 1,
          },
          scale: {
            x: 0.98,
            y: 1.04,
            z: 0.98,
          },
        },
        {
          duration: 150,
          delay: 450,
          easing: easeInOutSine,
        }
      ),
      createObjectTransformAnimation(
        suitcase,
        {
          position: {
            y: 0,
          },
          scale: {
            x: 1,
            y: 1,
            z: 1,
          },
        },
        {
          duration: 150,
          delay: 600,
          easing: easeInCubic,
        }
      )
    );
  }

  addDepsToCameraRig(cameraRigInstance) {
    cameraRigInstance.addObjectToCameraNull(infrastructure.camera);
    cameraRigInstance.addObjectToCameraNull(infrastructure.light);
    cameraRigInstance.addObjectToRotationAxis(this.suitcase);

    const pointerLight = new THREE.Group();
    pointerLight.position.z = 2250;
    pointerLight.add(infrastructure.pointerLight);
    cameraRigInstance.addObjectToRotationAxis(pointerLight);
  }

  subscribeScreenMove() {
    if ("ontouchmove" in window) {
      window.addEventListener("touchmove", this.touchMoveHandler);
    } else {
      window.addEventListener("mousemove", this.mouseMoveHandler);
    }
  }

  unsubscribeScreenMove() {
    if ("ontouchmove" in window) {
      window.removeEventListener("touchmove", this.touchMoveHandler);
    } else {
      window.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    if (this.eventHandlerTick) {
      window.cancelAnimationFrame(this.eventHandlerTick);
    }
  }

  addCameraRig() {
    this.mainPageScene.setRotationYAxis(
      ((this.previousRoomIndex - 1) * Math.PI) / 2
    );

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (height < 1 || width < 1) return;

    // camera resize
    if (width > height) {
      if (this.cameraRig instanceof CameraRigDesktop) {
        return;
      }

      infrastructure.scene.remove(this.cameraRig);

      this.cameraRigDesktop = new CameraRigDesktop(this.sceneIndex, this);
      this.addDepsToCameraRig(this.cameraRigDesktop);

      this.cameraRig = this.cameraRigDesktop;

      infrastructure.scene.add(this.cameraRig);
    } else {
      if (this.cameraRig instanceof CameraRigMobile) {
        return;
      }

      infrastructure.scene.remove(this.cameraRig);

      this.cameraRigMobile = new CameraRigMobile(this.sceneIndex, this);
      this.addDepsToCameraRig(this.cameraRigMobile);

      this.cameraRig = this.cameraRigMobile;
      infrastructure.scene.add(this.cameraRig);
    }
  }

  showMainScene() {
    this.sceneIndex = 0;

    this.unsubscribeScreenMove();

    this.mainPageScene.setRotationYAxis(
      ((this.previousRoomIndex - 1) * Math.PI) / 2
    );

    this.cameraRig.changeStateTo(
      this.cameraRig.getCameraRigStageState(0, this.previousRoomIndex),
      () => {
        this.subscribeScreenMove();
      }
    );

    setTimeout(() => {
      if (!this.isMainPageObjectsAppear) {
        animationManager.startMainPageAnimations();
        this.isMainPageObjectsAppear = true;
      }
    }, 500);
  }

  showRoomScene(nextRoomIndex) {
    if (this.previousRoomIndex === nextRoomIndex) {
      return;
    }

    this.sceneIndex = nextRoomIndex || this.previousRoomIndex;

    this.unsubscribeScreenMove();

    if (typeof nextRoomIndex === "number") {
      this.previousRoomIndex = nextRoomIndex;
    }

    this.cameraRig.changeStateTo(
      this.cameraRig.getCameraRigStageState(
        nextRoomIndex,
        this.previousRoomIndex
      ),
      () => {
        this.subscribeScreenMove();
      }
    );

    animationManager.startRoomAnimations(this.sceneIndex - 1);

    setTimeout(() => {
      if (!this.isSuitcaseAppear) {
        animationManager.startSuitcaseAnimations();
        this.isSuitcaseAppear = true;
      }
    }, 800);
  }

  mouseMoveHandler(ev) {
    const targetPositionY = ev.y;

    this.handleMove(targetPositionY);
  }

  touchMoveHandler(ev) {
    const targetPositionY = ev.targetTouches[0].clientY;

    this.handleMove(targetPositionY);
  }

  handleMove(targetPositionY) {
    if (this.eventHandlerTick) {
      window.cancelAnimationFrame(this.eventHandlerTick);
    }

    const windowHeight = window.innerHeight;

    const targetPositionYNormalized =
      (2 * (windowHeight / 2 - targetPositionY)) / windowHeight;

    const targetPitchRotation = degreesToRadians(
      this.cameraRig.getMaxPitchRotation() * targetPositionYNormalized
    );

    let currentPitchRotation = this.cameraRig.pitchRotation;
    const movePitchRotationCloserToTarget = (increase) => {
      if (
        (increase && currentPitchRotation > targetPitchRotation) ||
        (!increase && currentPitchRotation < targetPitchRotation)
      ) {
        window.cancelAnimationFrame(this.eventHandlerTick);
        return;
      }

      if (increase) {
        currentPitchRotation += 0.001;
      } else {
        currentPitchRotation -= 0.001;
      }
      this.cameraRig.pitchRotation = currentPitchRotation;
      this.cameraRig.invalidate();

      this.eventHandlerTick = requestAnimationFrame(() => {
        movePitchRotationCloserToTarget(increase);
      });
    }
  }
}
