import * as THREE from "three";
import {MaterialCreator} from "./MaterialCreator";

export class RoadCustomMaterial extends THREE.MeshStandardMaterial {
  onBeforeCompile(shader) {
    shader.uniforms = {
      ...shader.uniforms,
      roadColor: new THREE.Uniform(
        new THREE.Color(MaterialCreator.Colors.Grey)
      ),
      stripesColor: new THREE.Uniform(
        new THREE.Color(MaterialCreator.Colors.White)
      ),
    };

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_pars_vertex>`,
      `varying vec2 vUv;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_vertex>`,
      `vUv = uv;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `varying vec3 vViewPosition;`,
      `varying vec3 vViewPosition;
                  varying vec2 vUv;
                  uniform vec3 roadColor;
                  uniform vec3 stripesColor;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <map_fragment>`,
      `vec4 texelColor = vec4(roadColor, 1.0);
                  if (vUv.y > 0.36 && vUv.y < 0.39) {
                    if (vUv.x > 0.11 && vUv.x < 0.22) {
                      texelColor = vec4(stripesColor, 1.0);
                    }
                    if (vUv.x > 0.33 && vUv.x < 0.44) {
                      texelColor = vec4(stripesColor, 1.0);
                    }
                    if (vUv.x > 0.55 && vUv.x < 0.66) {
                      texelColor = vec4(stripesColor, 1.0);
                    }
                    if (vUv.x > 0.77 && vUv.x < 0.88) {
                      texelColor = vec4(stripesColor, 1.0);
                    }
                  }
                  texelColor = mapTexelToLinear( texelColor );
                  diffuseColor *= texelColor;
                  `
    );
  }
}
