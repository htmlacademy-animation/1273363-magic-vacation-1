import {Scene3d} from "./scene-3d";
/*import Stats from 'three/examples/jsm/libs/stats.module';

const stats1 = new Stats();
stats1.showPanel(0);
stats1.domElement.style.cssText = 'position:absolute;top:0px;left:0px;z-index:1000';
document.body.appendChild(stats1.domElement);

const stats2 = new Stats();
stats2.showPanel(2);
stats2.domElement.style.cssText = 'position:absolute;top:0px;left:80px;z-index:1000';
document.body.appendChild(stats2.domElement);
*/
export const infrastructure = new Scene3d({
  elementId: "canvas--animation-screen",
  cameraConfig: { fov: 35, near: 1, far: 5500 },
  enableAnimation: true,
  //stats: [stats1, stats2]
});
