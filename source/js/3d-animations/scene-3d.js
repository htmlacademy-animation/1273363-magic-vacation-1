import * as THREE from "three";
import {isDesktop} from '../constants';

export class Scene3d {
  constructor(config = {}) {
    this.config = config;
    this.meshObjects = new Set();
    this.resizeInProgress = false;
    this.canvasElement = document.getElementById(config.elementId);

    this.initRenderer();
    this.initScene();
    this.initCamera(config.cameraConfig);
    this.initLight();

    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);

    this.render();

    if (config.enableAnimation) {
      this.update();
    }

    this.resize();

    window.addEventListener("resize", () => {
      this.resizeInProgress = true;
    });
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera(cameraConfig = {}) {
    this.camera = new THREE.PerspectiveCamera(
      cameraConfig.fov || 75,
      cameraConfig.aspect || window.innerWidth / window.innerHeight,
      cameraConfig.near || 10,
      cameraConfig.far || 1000
    );

    this.camera.position.z = cameraConfig.positionZ || 5;
  }

  initRenderer() {
    const devicePixelRatio = window.devicePixelRatio;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      alpha: true,
      antialias: devicePixelRatio <= 1,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x5f458c, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (isDesktop) {
      this.renderer.shadowMap.enabled = true;
    }
  }

  initLight() {
    this.light = new THREE.Group();
    this.directionalLight = new THREE.Group();
    this.pointerLight = new THREE.Group();

    const color = new THREE.Color("rgb(255,255,255)");
    const intensity = 0.84;

    const light1 = new THREE.DirectionalLight(color, intensity);

    const directionalLightTargetObject = new THREE.Object3D();

    directionalLightTargetObject.position.set(
      0,
      -1000 * Math.tan((15 * Math.PI) / 180),
      -1000
    );

    this.light.add(directionalLightTargetObject);

    light1.target = directionalLightTargetObject;

    const light2 = this.createPointLight(
      [-785, -350, -710],
      new THREE.Color("rgb(246,242,255)"),
      0.6,
      3000,
      2
    );

    const light3 = this.createPointLight(
      [730, 800, -985],
      new THREE.Color("rgb(245,254,255)"),
      0.95,
      3000,
      2
    );

    this.directionalLight.add(light1);
    this.pointerLight.add(light2, light3);

    const light4 = new THREE.AmbientLight("#fff", 0.05);

    this.light.add(this.directionalLight, light4);
  }

  createPointLight(position, color, intensity, distance, decay) {
    const light = new THREE.PointLight(
      new THREE.Color(color),
      intensity,
      distance,
      decay
    );

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.bias = -0.005;
    light.shadow.camera.near = 100;
    light.shadow.camera.far = distance;

    light.position.set(position[0], position[1], position[2]);

    return light;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    if (this.resizeInProgress) this.resize();

    this.render();

    this.resizeInProgress = false;

    if (this.config.stats) {
      this.config.stats.forEach((stats) => {
        stats.update();
      });
    }

    requestAnimationFrame(this.update);
  };

  clearScene() {
    this.meshObjects.forEach((mesh) => {
      this.scene.remove(mesh);

      this.meshObjects.delete(mesh);
    });

    this.scene.dispose();
  }

  addSceneObject(meshObject) {
    this.meshObjects.add(meshObject);
    this.scene.add(meshObject);

    this.render();
  }

  setSceneObjects(...meshObjects) {
    this.clearScene();

    this.meshObjects.add(...meshObjects);
    this.scene.add(...meshObjects);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (height < 1 || width < 1) return;

    // camera resize
    if (width > height) {
      this.camera.fov = 35;
    } else {
      this.camera.fov = (32 * height) / Math.min(width * 1.3, height);
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // renderer resize
    this.renderer.setSize(width, height);
  }
}
