import * as THREE from "three";

export class ExtrudeSvgCreator {
  constructor(svgShapeLoader, settings) {
    this.svgShapeLoader = svgShapeLoader;
    this.settings = settings;
  }

  async create(name, settings = {}) {
    const currentSettings = {...this.settings, ...settings};

    const group = new THREE.Group();

    const paths = await this.svgShapeLoader.getSvgShape(name);

    for (const path of paths) {
      const material =
        currentSettings.material ||
        new THREE.MeshStandardMaterial({
          color: path.color,
          side: THREE.DoubleSide,
        });

      const shapes = path.toShapes();

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, currentSettings);

        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    return group;
  }
}
