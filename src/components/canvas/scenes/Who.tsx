"use client";
import { useRef } from "react";
import * as THREE from "three";
import { mats, cylGeo, ease, clamp01, reliefMat, SCENE_Z, useSceneFrame } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { Obelisk, PyramidMesh } from "../Props";

const X = [-11, 0, 11];

/** Three stelae, one per audience. They rise in turn and the active one lights its sun disc. */
export default function WhoScene() {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const discs = useRef<(THREE.Mesh | null)[]>([]);

  useSceneFrame(() => {
    const p = chapterProgress("who");
    const idx = p < 0.14 ? -1 : Math.min(2, Math.floor(((p - 0.14) / 0.86) * 3));
    X.forEach((_, i) => {
      const g = groups.current[i];
      const d = discs.current[i];
      if (g) g.position.y = -12 * (1 - ease(clamp01((p * 4 - i * 0.35) / 0.9)));
      if (d) {
        const target = idx === i ? 1 : 0.15;
        d.scale.setScalar(d.scale.x + (target - d.scale.x) * 0.08);
      }
    });
  });

  const set = (i: number) => (el: THREE.Group | null) => { groups.current[i] = el; };
  const disc = (i: number) => (el: THREE.Mesh | null) => { discs.current[i] = el; };

  return (
    <group position={[0, 0, SCENE_Z.who]}>
      {/* brands on Instagram / WhatsApp: obelisk */}
      <group ref={set(0)} position={[X[0], -12, 0]}>
        <Obelisk h={9} w={1.1} />
        <mesh ref={disc(0)} position={[0, 12.5, 0]} material={mats.glow}><circleGeometry args={[1.8, 32]} /></mesh>
      </group>
      {/* startups: pyramid */}
      <group ref={set(1)} position={[X[1], -12, 0]}>
        <PyramidMesh s={9} steps={12} />
        <mesh position={[0, 8.0, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.gold}><coneGeometry args={[0.5, 0.7, 4]} /></mesh>
        <mesh ref={disc(1)} position={[0, 10.6, 0]} material={mats.glow}><circleGeometry args={[1.8, 32]} /></mesh>
      </group>
      {/* local businesses: lotus column */}
      <group ref={set(2)} position={[X[2], -12, 0]}>
        <mesh position={[0, 4, 0]} scale={[0.9, 8, 0.9]} material={reliefMat(2, 1, 3, 7)} geometry={cylGeo} castShadow />
        <mesh position={[0, 8.4, 0]} material={mats.gold}><sphereGeometry args={[1.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.6]} /></mesh>
        <mesh ref={disc(2)} position={[0, 11.4, 0]} material={mats.glow}><circleGeometry args={[1.8, 32]} /></mesh>
      </group>
      <pointLight position={[0, 10, 12]} intensity={100} distance={50} color="#ffc680" />
    </group>
  );
}
