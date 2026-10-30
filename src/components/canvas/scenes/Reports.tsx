"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mats, boxGeo, cylGeo, ease, clamp01, SCENE_Z, useSceneFrame } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { paintedWallTex } from "../textures";

const bars = [0.35, 0.5, 0.42, 0.7, 0.62, 0.9];

/** A seated scribe beside a papyrus that unrolls into a simple, illustrative chart. */
export default function ReportsScene() {
  const sheet = useRef<THREE.Mesh>(null);
  const roll = useRef<THREE.Mesh>(null);
  const bar = useRef<THREE.Group>(null);
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ map: paintedWallTex(), roughness: 1 }), []);

  useSceneFrame(() => {
    const p = ease(clamp01(chapterProgress("reports") * 1.5));
    const h = 0.05 + p * 7;
    if (sheet.current) {
      sheet.current.scale.set(9, h, 0.05);
      sheet.current.position.y = 8 - h / 2;
    }
    if (roll.current) roll.current.position.y = 8 - h;
    bar.current?.children.forEach((c, i) => {
      const t = ease(clamp01((p - 0.3 - i * 0.08) / 0.4));
      c.scale.y = Math.max(0.001, bars[i] * 5 * t);
      c.position.y = 8 - 6.4 + c.scale.y / 2;
    });
  });

  return (
    <group position={[0, 0, SCENE_Z.reports - 4]} scale={0.85}>
      <mesh position={[0, 6, -9]} material={wall}>
        <planeGeometry args={[44, 11]} />
      </mesh>
      <mesh position={[0, 8.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.35, 9.4, 0.35]} material={mats.gold} geometry={cylGeo} />
      <mesh ref={sheet} position={[0, 8, 0]} material={mats.linen} geometry={boxGeo} />
      <mesh ref={roll} position={[0, 8, 0.05]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 9.2, 0.5]} material={mats.sandstone} geometry={cylGeo} />
      <group ref={bar} position={[0, 0, 0.1]}>
        {bars.map((_, i) => (
          <mesh key={i} position={[-3.3 + i * 1.32, 2, 0]} scale={[0.7, 0.01, 0.12]} material={i === bars.length - 1 ? mats.gold : mats.lapis} geometry={boxGeo} />
        ))}
      </group>
      {/* scribe */}
      <group position={[-13, 0, -4]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 1.2, 0]} scale={[1.4, 2.4, 1]} material={mats.linen} geometry={boxGeo} />
        <mesh position={[0, 2.9, 0]} material={mats.sandDark}><sphereGeometry args={[0.55, 16, 16]} /></mesh>
        <mesh position={[0, 3.4, 0]} scale={[1.3, 0.5, 1.2]} material={mats.dark} geometry={boxGeo} />
        <mesh position={[0, 2.2, 0.55]} scale={[1.2, 0.2, 0.2]} material={mats.gold} geometry={boxGeo} />
      </group>
    </group>
  );
}
