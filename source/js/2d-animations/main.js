import Scene2DSeaCalf from "./scenes/winning-scene/scene-2d-seacalf";
import Scene2dCrocodile from "./scenes/losing-scene/scene-2d-crocodile";

export const runWinningScene = () => new Scene2DSeaCalf();
export const runLosingScene = () => new Scene2dCrocodile();
