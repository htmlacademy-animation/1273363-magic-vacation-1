import * as THREE from "three";

export class MaterialCreator {
  constructor(scene, gui) {
    this.scene = scene;
    this.sceneChildren = scene.scene.children;
    this.gui = gui;

    this.initMaterialGui();
  }

  create(materialType, config) {
    switch (materialType) {
      case "SoftMaterial": {
        return this.createSoft({
          ...MaterialCreator.Config.SoftMaterial,
          ...config,
        });
      }
      case "BasicMaterial": {
        return this.createBasic({
          ...MaterialCreator.Config.BasicMaterial,
          ...config,
        });
      }
      case "StrongMaterial": {
        return this.createStrong({
          ...MaterialCreator.Config.StrongMaterial,
          ...config,
        });
      }
      default: {
        return this.createBasic({
          ...MaterialCreator.Config.StrongMaterial,
          ...config,
        });
      }
    }
  }

  createSoft(config) {
    return new THREE.MeshStandardMaterial(config);
  }

  createBasic(config) {
    return new THREE.MeshStandardMaterial(config);
  }

  createStrong(config) {
    return new THREE.MeshPhongMaterial(config);
  }

  findMaterialAndUpdate(data, materialName, propName) {
    return (object) => {
      if (object.type === "Mesh" && object.material.name === materialName) {
        if (propName === 'specular') {
          object.material[propName] = new THREE.Color(data)
        } else {
          object.material[propName] = data;
        }
      }

      if (object.type === "Group") {
        object.children.forEach(
          this.findMaterialAndUpdate(data, materialName, propName)
        );
      }
    };
  }

  initMaterialGui() {
    const softMaterial = this.gui.addFolder("SoftMaterial");
    softMaterial
      .add(MaterialCreator.Config.SoftMaterial, "roughness", 0, 1, 0.01)
      .onChange((data) => {
        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "SoftMaterial", "roughness")
        );
      });
    softMaterial
      .add(MaterialCreator.Config.SoftMaterial, "metalness", 0, 1, 0.01)
      .onChange((data) => {
        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "SoftMaterial", "metalness")
        );
      });
    softMaterial.open();

    const basicMaterial = this.gui.addFolder("BasicMaterial");
    basicMaterial
      .add(MaterialCreator.Config.BasicMaterial, "roughness", 0, 1, 0.01)
      .onChange((data) => {
        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "BasicMaterial", "roughness")
        );
      });
    basicMaterial
      .add(MaterialCreator.Config.BasicMaterial, "metalness", 0, 1, 0.01)
      .onChange((data) => {
        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "BasicMaterial", "metalness")
        );
      });
    basicMaterial.open();

    const strongMaterial = this.gui.addFolder("StrongMaterial");
    strongMaterial
      .add(MaterialCreator.Config.StrongMaterial, "shininess", 0, 100, 1)
      .onChange((data) => {
        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "StrongMaterial", "shininess")
        );
      });
    strongMaterial
      .addColor(MaterialCreator.Config.StrongMaterial, "specular")
      .onChange((value) => {
        const data = Number("0x" + value.toString(16));

        MaterialCreator.Config.StrongMaterial.specular = data;

        this.sceneChildren.forEach(
          this.findMaterialAndUpdate(data, "StrongMaterial", "specular")
        );
      });
    strongMaterial.open();
  }
}

MaterialCreator.Colors = {
  Blue: "rgb(51, 113, 235)",
  BrightBlue: "rgb(47, 58, 201)",
  LightBlue: "rgb(150, 176, 243)",
  DarkBlue: "rgb(12, 49, 112)",
  SkyLightBlue: "rgb(161, 200, 240)",
  MountainBlue: "rgb(101, 152, 219)",
  DominantRed: "rgb(255, 32, 66)",
  LightDominantRed: "rgb(255, 105, 120)",
  ShadowedDominantRed: "rgb(124, 26, 48)",
  Purple: "rgb(163, 118, 235)",
  BrightPurple: "rgb(118, 76, 225)",
  LightPurple: "rgb(194, 153, 225)",
  AdditionalPurple: "rgb(119, 85, 189)",
  DarkPurple: "rgb(76, 49, 121)",
  ShadowedPurple: "rgb(75, 50, 116)",
  ShadowedBrightPurple: "rgb(56, 37, 108)",
  ShadowedLightPurple: "rgb(77, 53, 106)",
  ShadowedAdditionalPurple: "rgb(55, 38, 89)",
  ShadowedDarkPurple: "rgb(49, 42, 71)",
  Grey: "rgb(118, 125, 143)",
  MetalGrey: "rgb(126, 141, 164)",
  Orange: "rgb(230, 80, 0)",
  Green: "rgb(0, 210, 134)",
  White: "rgb(255, 255, 255)",
  SnowColor: "rgb(182, 206, 240",
};

MaterialCreator.Config = {
  SoftMaterial: {
    roughness: 0.9,
    metalness: 0.0,
    name: "SoftMaterial",
  },
  BasicMaterial: {
    roughness: 0.62,
    metalness: 0.53,
    name: "BasicMaterial",
  },
  StrongMaterial: {
    shininess: 0,
    specular: 0xffffff,
    name: "StrongMaterial",
  },
};
