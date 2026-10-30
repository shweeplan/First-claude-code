import { SCENE_Z, type SceneId } from "./shared";

export type LightSlot = { p: [number, number, number]; i: number; d: number; c: string; flicker?: boolean };

/**
 * One fixed pool of 3 point lights moves to whichever scene the camera is nearest.
 * A constant light count means three never has to rebuild every material when a scene changes,
 * and every pixel is shaded by at most 3 point lights instead of every scene's lights at once.
 */
export const RIGS: Record<SceneId, LightSlot[]> = {
  hero: [{ p: [0, 6, 6], i: 60, d: 40, c: "#ffcf8a" }],
  build: [{ p: [3, 12, SCENE_Z.build - 12], i: 80, d: 50, c: "#ffd9a0" }],
  traffic: [{ p: [0, 14, SCENE_Z.traffic - 34], i: 140, d: 60, c: "#ffcf8a" }],
  sell: [
    { p: [-4.5, 2.3, SCENE_Z.sell - 1], i: 70, d: 26, c: "#ff9a4a" },
    { p: [4.5, 2.3, SCENE_Z.sell - 10], i: 70, d: 26, c: "#ff9a4a" },
    { p: [0, 7.5, SCENE_Z.sell - 6], i: 80, d: 55, c: "#ffc680" },
  ],
  grow: [{ p: [0, 8, SCENE_Z.grow - 2], i: 120, d: 50, c: "#9fe8d8" }],
  reports: [{ p: [0, 7.6, SCENE_Z.reports + 4], i: 100, d: 45, c: "#ffc27a" }],
  who: [{ p: [0, 10, SCENE_Z.who + 12], i: 100, d: 50, c: "#ffc680" }],
  start: [
    { p: [-6.2, 5, SCENE_Z.start + 6], i: 70, d: 30, c: "#ff9a3c", flicker: true },
    { p: [6.2, 5, SCENE_Z.start + 6], i: 70, d: 30, c: "#ff9a3c", flicker: true },
  ],
};
