import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MaterialCreator} from "../animation/MaterialCreator";

export class ObjectsCreator {
  constructor(materialCreator) {
    this.materialCreator = materialCreator;
    this.objLoader = new OBJLoader();
    this.loaderGltf = new GLTFLoader();

    this.objects = {};
  }

  create(name, onSuccess) {
    const config = ObjectsCreator.objectsConfigMap[name];

    if (!config) return;

    const onComplete = (obj3d) => {
      if (config.materialType) {
        const material = this.materialCreator.create(config.materialType, {
          color: config.color,
        });

        obj3d.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
          }
        });
      }

      if (typeof onSuccess === "function") onSuccess.call(null, obj3d);
    };

    const onGltfComplete = (gltf) => {
      if (!gltf.scene) return;
      onComplete(gltf.scene);
    };

    if (config.path.endsWith(".obj")) {
      this.objLoader.load(config.path, onComplete);
    } else if (config.path.endsWith(".gltf")) {
      this.loaderGltf.load(config.path, onGltfComplete);
    }
  }
}

ObjectsCreator.objectsConfigMap = {
  airplane: {
    name: "airplane",
    materialType: "BasicMaterial",
    color: MaterialCreator.Colors.White,
    path: "./3d/module-6/scene-0-objects/airplane.obj",
  },
  suitcase: {
    name: "suitcase",
    path: "./3d/module-6/scene-0-objects/suitcase.gltf",
  },
  watermelon: {
    name: "watermelon",
    path: "./3d/module-6/scene-0-objects/watermelon.gltf",
  },
};
