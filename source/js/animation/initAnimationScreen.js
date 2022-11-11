import { Scene3d } from "./scene-3d";

export const scene = new Scene3d({
  elementId: "canvas--animation-screen",
  cameraConfig: { fov: 35, positionZ: 750, near: 1, far: 5500 },
  enableAnimation: true,
});
