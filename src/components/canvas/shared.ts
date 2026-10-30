import * as THREE from "three";
import { createContext, useContext, useRef } from "react";
import { useFrame, type RootState } from "@react-three/fiber";
import type { Tier } from "@/lib/env";
import { stoneTex, reliefTex, sandTex } from "./textures";

export const TierContext = createContext<Tier>("full");
export const useTier = () => useContext(TierContext);

/** Whether the scene wrapping this component is near the camera. Hidden scenes stay mounted (no rebuild hitch) but skip their per-frame work. */
export const ActiveContext = createContext(true);
export function useSceneFrame(cb: (state: RootState, dt: number) => void) {
  const active = useContext(ActiveContext);
  const on = useRef(active);
  on.current = active;
  useFrame((s, dt) => {
    if (on.current) cb(s, dt);
  });
}

/** Shared materials: created once, reused by every scene. */
export const mats = {
  sandstone: new THREE.MeshStandardMaterial({ color: "#d9bc8a", roughness: 0.95, metalness: 0 }),
  sandDark: new THREE.MeshStandardMaterial({ color: "#a9824f", roughness: 1 }),
  gold: new THREE.MeshStandardMaterial({ color: "#e0aa45", roughness: 0.32, metalness: 0.9 }),
  lapis: new THREE.MeshStandardMaterial({ color: "#2a4fb0", roughness: 0.25, metalness: 0.3, emissive: "#14307a", emissiveIntensity: 0.7 }),
  turquoise: new THREE.MeshStandardMaterial({ color: "#2a9d96", roughness: 0.4, metalness: 0.1 }),
  carnelian: new THREE.MeshStandardMaterial({ color: "#b2432d", roughness: 0.6 }),
  linen: new THREE.MeshStandardMaterial({ color: "#f1e6cf", roughness: 1, side: THREE.DoubleSide }),
  dark: new THREE.MeshStandardMaterial({ color: "#2b1a0e", roughness: 1 }),
  glow: new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd88a").multiplyScalar(2.4), toneMapped: false, fog: false }),
  flame: new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff9a3c").multiplyScalar(1.6), toneMapped: false }),
  beam: new THREE.MeshBasicMaterial({
    color: "#ffd88a",
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    fog: false,
  }),
};

export const boxGeo = new THREE.BoxGeometry(1, 1, 1);
export const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 24);
export const coneGeo = new THREE.ConeGeometry(1, 1, 4);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic pseudo random so scenes look the same on every load/resize. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** World z of each scene centre. */
export const SCENE_Z = {
  hero: 0,
  build: -70,
  traffic: -140,
  sell: -210,
  grow: -280,
  reports: -350,
  who: -385,
  start: -420,
} as const;
export type SceneId = keyof typeof SCENE_Z;

/** Box whose UVs follow its real size, so stone courses stay the same scale on every block. `density` = texture tiles per world unit. */
export function texBox(w: number, h: number, d: number, density = 0.13) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  // face order: +x, -x, +y, -y, +z, -z (4 vertices each)
  const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++)
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, uv.getX(k) * dims[f][0] * density, uv.getY(k) * dims[f][1] * density);
    }
  uv.needsUpdate = true;
  return g;
}

/** Set by <World/> before scenes render: bump maps are a full-tier luxury. */
export const quality = { bump: true };

const matCache = new Map<string, THREE.MeshStandardMaterial>();
const stdCache = (key: string, make: () => THREE.MeshStandardMaterial) => {
  if (!matCache.has(key)) matCache.set(key, make());
  return matCache.get(key)!;
};

/** Textured stone material (carved coursing + bump). Geometry should use texBox UVs, or pass repeat for curved shapes. */
export function stoneMat(kind: "sandstone" | "limestone" = "sandstone", rx = 1, ry = 1, bump = 1.2) {
  return stdCache(`stone-${kind}-${rx}-${ry}-${bump}-${quality.bump}`, () => {
    const t = stoneTex(kind, rx, ry);
    return new THREE.MeshStandardMaterial({ map: t.map, bumpMap: quality.bump ? t.bump : null, bumpScale: bump, roughness: 0.95 });
  });
}

/** Hieroglyph relief material for obelisk faces and column shafts. */
export function reliefMat(rx = 1, ry = 1, cols = 2, rows = 14) {
  return stdCache(`relief-${rx}-${ry}-${cols}-${rows}-${quality.bump}`, () => {
    const t = reliefTex(rx, ry, cols, rows);
    return new THREE.MeshStandardMaterial({ map: t.map, bumpMap: quality.bump ? t.bump : null, bumpScale: 2.2, roughness: 0.9 });
  });
}

export function sandMat(rx = 40, ry = 120) {
  return stdCache(`sand-${rx}-${ry}-${quality.bump}`, () => {
    const t = sandTex(rx, ry);
    return new THREE.MeshStandardMaterial({ map: t.map, bumpMap: quality.bump ? t.bump : null, bumpScale: 1.5, roughness: 1, vertexColors: true });
  });
}

/** Live sky colours, written by the camera rig each frame and read by the sky dome, fog and lights. */
export const skyState = {
  horizon: new THREE.Color("#f4b98a"),
  zenith: new THREE.Color("#5f86c4"),
  sunAmt: 1,
  sunY: 0.2,
};
