import * as THREE from "three";
import { createContext, useContext } from "react";
import type { Tier } from "@/lib/env";

export const TierContext = createContext<Tier>("full");
export const useTier = () => useContext(TierContext);

/** Shared materials: created once, reused by every scene. */
export const mats = {
  sandstone: new THREE.MeshStandardMaterial({ color: "#d9bc8a", roughness: 0.95, metalness: 0 }),
  sandDark: new THREE.MeshStandardMaterial({ color: "#a9824f", roughness: 1 }),
  gold: new THREE.MeshStandardMaterial({ color: "#e0aa45", roughness: 0.32, metalness: 0.9 }),
  lapis: new THREE.MeshStandardMaterial({ color: "#1e3a8a", roughness: 0.18, metalness: 0.3 }),
  turquoise: new THREE.MeshStandardMaterial({ color: "#2a9d96", roughness: 0.4, metalness: 0.1 }),
  carnelian: new THREE.MeshStandardMaterial({ color: "#b2432d", roughness: 0.6 }),
  linen: new THREE.MeshStandardMaterial({ color: "#f1e6cf", roughness: 1, side: THREE.DoubleSide }),
  dark: new THREE.MeshStandardMaterial({ color: "#2b1a0e", roughness: 1 }),
  glow: new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd88a").multiplyScalar(2.4), toneMapped: false }),
  beam: new THREE.MeshBasicMaterial({
    color: "#ffd88a",
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
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
  start: -420,
} as const;
export type SceneId = keyof typeof SCENE_Z;
