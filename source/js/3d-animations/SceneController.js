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
  easeLinear,
  easeOutCubic,
} from "../helpers/easing";
import * as THREE from "three";
import {degreesToRadians} from "./utils/degreesToRadians";
import {CameraRigMobile} from "./rigs/CameraRig/CameraRigMobile";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import vertexShader from "../../shader/vertexShader.glsl";
import fragmentShader from "../../shader/fragmentShader.glsl";
import {Scene3d} from "./scene-3d";
import Animation from "../Animation/animation";

export const textureLoader = new THREE.TextureLoader();
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
  constructor(diceLoader) {
    this.infrastructure = new Scene3d({
      elementId: "canvas--animation-screen",
      cameraConfig: { fov: 35, near: 1, far: 5500 },
      enableAnimation: true,
      // stats: [stats1, stats2]
    });
    this.diceLoader = diceLoader;

    this.previousRoomIndex = 1;
    this.isSuitcaseAppear = false;
    this.isMainPageObjectsAppear = false;

    this.eventHandlerTick = null;

    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener("resize", this.onResize);

    this.setBubbleComposer();
  }

  onResize() {
    this.bubbleEffectPass.material.uniforms.aspectRatio.value =
      window.innerWidth / window.innerHeight;
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

    await this.mainPageScene.constructChildren(this.diceLoader);

    this.mainPageScene.position.z = -BACKGROUND_AXIS_POSITION_Z;

    this.infrastructure.addSceneObject(this.mainPageScene);
  }

  async addRoomsPageScene() {
    this.roomsPageScene = new RoomsPageScene(
      pageSceneCreator,
      animationManager
    );

    await this.roomsPageScene.constructChildren(this.diceLoader);

    this.roomsPageScene.position.set(0, -800, -BACKGROUND_AXIS_POSITION_Z);

    this.infrastructure.addSceneObject(this.roomsPageScene);
  }

  initBubbleComposer() {
    const composer = new EffectComposer(this.infrastructure.renderer);

    composer.setPixelRatio(this.infrastructure.devicePixelRation);

    const renderPass = new RenderPass(
      this.infrastructure.scene,
      this.infrastructure.camera
    );

    const effectMaterial = this.getEffectMaterial();

    this.addBubbleAnimation(effectMaterial);

    this.bubbleEffectPass = new ShaderPass(effectMaterial, "map");

    composer.addPass(renderPass);
    composer.addPass(this.bubbleEffectPass);

    return composer;
  }

  setBubbleComposer() {
    this.bubbleComposer = this.initBubbleComposer();

    this.infrastructure.setRenderer(this.bubbleComposer);
  }

  removeBubbleComposer() {
    this.infrastructure.resetRender();
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

    this.diceLoader.increasePercentage(5);

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
    cameraRigInstance.addObjectToCameraNull(this.infrastructure.camera);
    cameraRigInstance.addObjectToCameraNull(this.infrastructure.light);
    cameraRigInstance.addObjectToRotationAxis(this.suitcase);

    const pointerLight = new THREE.Group();
    pointerLight.position.z = 2250;
    pointerLight.add(this.infrastructure.pointerLight);
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

      this.infrastructure.scene.remove(this.cameraRig);

      this.cameraRigDesktop = new CameraRigDesktop(this.sceneIndex, this);
      this.addDepsToCameraRig(this.cameraRigDesktop);

      this.cameraRig = this.cameraRigDesktop;

      this.infrastructure.scene.add(this.cameraRig);
    } else {
      if (this.cameraRig instanceof CameraRigMobile) {
        return;
      }

      this.infrastructure.scene.remove(this.cameraRig);

      this.cameraRigMobile = new CameraRigMobile(this.sceneIndex, this);
      this.addDepsToCameraRig(this.cameraRigMobile);

      this.cameraRig = this.cameraRigMobile;
      this.infrastructure.scene.add(this.cameraRig);
    }
  }

  showMainScene() {
    this.bubbleEffectPass.enabled = false;
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

    this.bubbleEffectPass.enabled = false;

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

        if (this.sceneIndex === 2) {
          this.bubbleEffectPass.enabled = true;
        }
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

  getEffectMaterial(texture) {
    return new THREE.RawShaderMaterial({
      uniforms: {
        map: new THREE.Uniform(texture),
        aspectRatio: new THREE.Uniform(window.innerWidth / window.innerHeight),
        timestamp: new THREE.Uniform(0),
        bubble1: new THREE.Uniform({
          bubblePosition: new THREE.Vector2(0, -2 * 0.07),
          bubbleRadius: 0.06,
          startTime: 0,
          startPositionX: 0.3,
          delay: 600,
          getPositionX(time) {
            return (
              this.startPositionX +
              0.02 * Math.exp(-0.05 * time) * Math.sin(Math.PI * time * 2.5)
            );
          },
          getPositionY: (y) => y + 0.005,
        }),
        bubble2: new THREE.Uniform({
          bubblePosition: new THREE.Vector2(0, -2 * 0.06),
          bubbleRadius: 0.07,
          startTime: 0,
          startPositionX: 0.4,
          delay: 0,
          getPositionX(time) {
            return (
              this.startPositionX +
              0.03 * Math.exp(-0.05 * time) * Math.sin(Math.PI * time * 2.5)
            );
          },
          getPositionY: (y) => y + 0.005,
        }),
        bubble3: new THREE.Uniform({
          bubblePosition: new THREE.Vector2(0, -2 * 0.04),
          bubbleRadius: 0.04,
          startPositionX: 0.5,
          startTime: 0,
          delay: 1000,
          getPositionX(time) {
            return (
              this.startPositionX +
              0.01 * Math.exp(-0.05 * time) * Math.sin(Math.PI * time * 2)
            );
          },
          getPositionY: (y) => y + 0.006,
        }),
        hasBubbles: new THREE.Uniform(false),
      },
      defines: {
        BUBBLE_LINE_WIDTH: 0.002,
      },
      vertexShader,
      fragmentShader,
    });
  }

  addBubbleAnimation(material) {
    const bubble1 = material.uniforms.bubble1.value;
    const bubble2 = material.uniforms.bubble2.value;
    const bubble3 = material.uniforms.bubble3.value;

    animationManager.addRoomsPageAnimations(
      1,
      new Animation({
        func: (_, { startTime, currentTime }) => {
          material.uniforms.timestamp.value = currentTime;

          material.uniforms.hasBubbles.value = true;

          [bubble1, bubble2, bubble3].forEach((bubble) => {
            if (!bubble.startTime) {
              bubble.startTime = startTime;
            }

            if (currentTime < bubble.startTime + bubble.delay) {
              return;
            }

            if (bubble.bubblePosition.y > 1.0 + 2 * bubble.bubbleRadius) {
              bubble.bubblePosition.y = -2 * bubble.bubbleRadius;
              bubble.startPositionX = Math.random();
              bubble.startTime = currentTime;
            }

            const deltaTime = (currentTime - bubble.startTime) / 1000;

            bubble.bubblePosition.x = bubble.getPositionX(deltaTime);
            bubble.bubblePosition.y = bubble.getPositionY(
              bubble.bubblePosition.y
            );
          });
        },
        duration: "infinite",
        easing: easeLinear,
      })
    );
  }
}
