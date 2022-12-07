import * as THREE from "three";
import {MaterialCreator} from "../creators/MaterialCreator";

export class CarpetCustomMaterial extends THREE.MeshStandardMaterial {
  onBeforeCompile(shader) {
    shader.uniforms = {
      ...shader.uniforms,
      mainColor: new THREE.Uniform(
        new THREE.Color(MaterialCreator.Colors.LightPurple)
      ),
      additionalColor: new THREE.Uniform(
        new THREE.Color(MaterialCreator.Colors.AdditionalPurple)
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
                  uniform vec3 mainColor;
                  uniform vec3 additionalColor;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <map_fragment>`,
      `vec4 texelColor = vec4(mainColor, 1.0);
                  if (vUv.x > 1.0 / 7.0 && vUv.x < 2.0 / 7.0) {
                    texelColor = vec4(additionalColor, 1.0);
                  }
                  if (vUv.x > 3.0 / 7.0 && vUv.x < 4.0 / 7.0) {
                    texelColor = vec4(additionalColor, 1.0);
                  }
                 if (vUv.x > 5.0 / 7.0 && vUv.x < 6.0 / 7.0) {
                    texelColor = vec4(additionalColor, 1.0);
                  }
                  texelColor = mapTexelToLinear( texelColor );
                  diffuseColor *= texelColor;
                  `
    );
  }
}
