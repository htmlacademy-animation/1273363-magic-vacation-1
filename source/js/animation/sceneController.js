import { scene } from "./initAnimationScreen";
import {SceneWithLantern} from '../scenes/SceneWithLantern';

export const sceneController = {
  clearScene() {
    scene.clearScene();
  },

  addScreenMesh() {
    scene.addSceneObject(new SceneWithLantern());
  },
};
