import * as THREE from "three";
import {degreesToRadians} from "../../utils/degreesToRadians";
import Animation from "../../../Animation/Animation";
import {easeInOutSine} from "../../../helpers/easing";
import {AnimationController} from "./AnimationController";
import {BACKGROUND_AXIS_POSITION_Z} from "../../../constants";

export class CameraRigMobile extends THREE.Group {
  constructor(startSceneIndex, sceneController) {
    super();

    this.name = "CameraRig";

    this.stateParameters =
      this.getCameraRigStageState(startSceneIndex).newStateParams;

    this.keyholeCover = sceneController.mainPageScene.children[0].children.find(
      ({ name }) => name === "keyholeCover"
    );

    // Set internal parameters
    this._depth = this.stateParameters.depth || 0;
    this._rotationAxisYAngle = this.stateParameters.rotationAxisYAngle || 0;
    this._horizonIncline = this.stateParameters.horizonIncline || 0;
    this._pitchRotation = this.stateParameters.pitchRotation || 0;
    this._pitchDepth = this.stateParameters.pitchDepth || 0;
    this._cameraRotationY = this.stateParameters.cameraRotationY || 0;

    this._depthChanged = true;
    this._rotationAxisYAngleChanged = true;
    this._horizonInclineChanged = true;
    this._pitchRotationChanged = true;
    this._pitchDepthChanged = true;
    this._cameraRotationYChanged = true;

    this.animationController = new AnimationController();

    this.constructRigElements();

    this.position.z = this.getMaxDepth();

    // Set Rig to the initial state
    this.invalidate();
  }

  constructRigElements() {
    // Construct parts
    const depthTrack = new THREE.Group();
    const rotationAxis = new THREE.Group();
    const pitchAxis = new THREE.Group();
    const cameraNull = new THREE.Group();

    // Connect
    this.add(rotationAxis);
    rotationAxis.add(depthTrack);
    depthTrack.add(pitchAxis);
    pitchAxis.add(cameraNull);

    this.depthTrack = depthTrack;
    this.rotationAxis = rotationAxis;
    this.pitchAxis = pitchAxis;
    this.cameraNull = cameraNull;

    this.cameraNull.rotation.y = degreesToRadians(3);

    this.pitchAxis.position.z = this.pitchDepth;
  }

  setState(newStateParameters) {
    this.stateParameters = newStateParameters;
  }

  set depth(value) {
    if (value === this._depth) return;

    this._depth = value;
    this._depthChanged = true;

    if (this.keyholeCover) {
      let opacity;

      const fullOpacityBreakpoint = -2000;
      const noOpacityBreakpoint = -500;

      if (value < fullOpacityBreakpoint) {
        opacity = 1;
      } else if (value > noOpacityBreakpoint) {
        opacity = 0;
      } else {
        opacity =
          (value - noOpacityBreakpoint) /
          (fullOpacityBreakpoint - noOpacityBreakpoint);
      }

      this.keyholeCover.opacity = opacity;

      this.keyholeCover.invalidate();
    }
  }

  get depth() {
    return this._depth;
  }

  set horizonIncline(value) {
    if (value === this._horizonIncline) return;

    this._horizonIncline = value;
    this._horizonInclineChanged = true;
  }

  get horizonIncline() {
    return this._horizonIncline;
  }

  get rotationAxisYAngle() {
    return this._rotationAxisYAngle;
  }

  set rotationAxisYAngle(value) {
    if (value === this._rotationAxisYAngle) return;

    this._rotationAxisYAngle = value;
    this._rotationAxisYAngleChanged = true;
  }

  get pitchRotation() {
    return this._pitchRotation;
  }

  set pitchRotation(value) {
    if (value === this._pitchRotation) return;

    this._pitchRotation = value;
    this._pitchRotationChanged = true;
  }

  get pitchDepth() {
    return this._pitchDepth;
  }

  set pitchDepth(value) {
    if (value === this._pitchDepth) return;

    this._pitchDepth = value;
    this._pitchDepthChanged = true;
  }

  get cameraRotationY() {
    return this._cameraRotationY;
  }

  set cameraRotationY(value) {
    if (value === this._cameraRotationY) return;

    this._cameraRotationY = value;
    this._cameraRotationYChanged = true;
  }

  invalidate() {
    if (this._depthChanged) {
      this.depthTrack.position.z = -this._depth;
      this._depthChanged = false;
    }

    if (this._horizonInclineChanged) {
      this.depthTrack.rotation.x = this._horizonIncline;
      this.pitchAxis.position.y =
        this._pitchDepth * Math.tan(this._horizonIncline);

      this._horizonInclineChanged = false;
    }

    if (this._rotationAxisYAngleChanged) {
      this.rotationAxis.rotation.y = this._rotationAxisYAngle;

      this._rotationAxisYAngleChanged = false;
    }

    if (this._pitchRotationChanged) {
      this.cameraNull.position.y =
        Math.tan(this._pitchRotation) * this._pitchDepth;
      this.cameraNull.rotation.x = -this._pitchRotation;

      this._pitchRotationChanged = false;
    }

    if (this._pitchDepthChanged) {
      this.pitchAxis.position.z = this._pitchDepth;

      this._pitchDepthChanged = false;
    }

    if (this._cameraRotationYChanged) {
      this.cameraNull.rotation.y = this._cameraRotationY;

      this._cameraRotationYChanged = false;
    }
  }

  addObjectToRotationAxis(object) {
    this.rotationAxis.add(object);
  }

  addObjectToCameraNull(object) {
    this.cameraNull.add(object);
  }

  changeStateTo({ newStateParams, animationParams }, onComplete) {
    const initDepth = this._depth;
    const initHorizonIncline = this._horizonIncline;
    const initRotationAxisYAngle = this._rotationAxisYAngle;
    const initPitchRotation = this._pitchRotation;
    const initPitchDepth = this._pitchDepth;
    const initCameraRotationY = this._cameraRotationY;

    this.animationController.start(
      new Animation({
        func: (progress) => {
          if (typeof newStateParams.depth === "number") {
            this.depth =
              initDepth + (newStateParams.depth - initDepth) * progress;
          }

          if (typeof newStateParams.horizonIncline === "number") {
            this.horizonIncline =
              initHorizonIncline +
              (newStateParams.horizonIncline - initHorizonIncline) * progress;
          }

          if (typeof newStateParams.rotationAxisYAngle === "number") {
            this.rotationAxisYAngle =
              initRotationAxisYAngle +
              (newStateParams.rotationAxisYAngle - initRotationAxisYAngle) *
              progress;
          }

          if (typeof newStateParams.pitchRotation === "number") {
            this.pitchRotation =
              initPitchRotation +
              (newStateParams.pitchRotation - initPitchRotation) * progress;
          }

          if (typeof newStateParams.pitchDepth === "number") {
            this.pitchDepth =
              initPitchDepth +
              (newStateParams.pitchDepth - initPitchDepth) * progress;
          }

          if (typeof newStateParams.cameraRotationY === "number") {
            this.cameraRotationY =
              initCameraRotationY +
              (newStateParams.cameraRotationY - initCameraRotationY) * progress;
          }

          this.invalidate();
        },
        duration: animationParams.duration,
        easing: animationParams.easing,
        callback: () => {
          this.setState(newStateParams);

          if (typeof onComplete === "function") {
            onComplete();
          }
        },
      })
    );
  }

  getCameraRigStageState(nextSceneIndex, prevRoomIndex = 1) {
    // переход из комнаты на главную
    if (nextSceneIndex === 0) {
      return {
        newStateParams: {
          index: nextSceneIndex,
          depth: this.getMaxDepth(),
          rotationAxisYAngle: ((prevRoomIndex - 1) * Math.PI) / 2,
          horizonIncline: 0,
          pitchRotation: 0,
          pitchDepth: 1405,
          cameraRotationY: 0,
        },
        animationParams: {
          duration: 1500,
          easing: easeInOutSine,
        },
      };
    }

    // переход с главной к комнате
    if (typeof nextSceneIndex !== "number") {
      return {
        newStateParams: {
          index: prevRoomIndex,
          depth: this.getMinDepth(),
          rotationAxisYAngle: ((prevRoomIndex - 1) * Math.PI) / 2,
          horizonIncline: -degreesToRadians(21),
          pitchRotation: 0,
          pitchDepth: 2200,
          cameraRotationY: degreesToRadians(3),
        },
        animationParams: {
          duration: 1500,
          easing: easeInOutSine,
        },
      };
    }

    // переход между комнатами
    if ([1, 2, 3, 4].includes(nextSceneIndex)) {
      return {
        newStateParams: {
          index: nextSceneIndex,
          depth: this.getMinDepth(),
          rotationAxisYAngle: ((nextSceneIndex - 1) * Math.PI) / 2,
          horizonIncline: -degreesToRadians(21),
          pitchDepth: 2200,
          cameraRotationY: degreesToRadians(3),
        },
        animationParams: {
          duration: 700,
          easing: easeInOutSine,
        },
      };
    }

    return { newStateParams: {}, animationParams: {} };
  }

  getMinDepth() {
    return 0;
  }

  getMaxDepth() {
    return -BACKGROUND_AXIS_POSITION_Z;
  }

  getMaxPitchRotation() {
    return 10;
  }
}
