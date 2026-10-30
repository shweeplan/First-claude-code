"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, boxGeo, cylGeo, ease, clamp01, rng, useTier, SCENE_Z } from "../shared";
import { chapterProgress } from "@/lib/scroll";

/** Marketplace funnel corridor that ends in a gate, with a scale weighing visits against orders. */
export default function SellScene() {
  const tier = useTier();
  const beam = useRef<THREE.Group>(null);
  const panL = useRef<THREE.Group>(null);
  const panR = useRef<THREE.Group>(null);
  const cols = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pairs = tier === "full" ? 10 : 6;
  const stalls = useMemo(() => {
    const r = rng(5);
    const palette = [mats.carnelian, mats.lapis, mats.turquoise];
    return Array.from({ length: tier === "full" ? 10 : 5 }, (_, i) => ({
      x: (i % 2 ? 1 : -1) * (13 + r() * 3),
      z: 20 - i * 6,
      m: palette[i % 3],
    }));
  }, [tier]);

  useFrame((s) => {
    const p = chapterProgress("sell");
    const tilt = Math.sin(s.clock.elapsedTime * 0.8) * 0.05 + (0.35 - ease(clamp01(p * 1.4)) * 0.35);
    if (beam.current) beam.current.rotation.z = tilt;
    if (panL.current) panL.current.position.y = -Math.sin(tilt) * 4 - 1.2;
    if (panR.current) panR.current.position.y = Math.sin(tilt) * 4 - 1.2;
    if (cols.current) {
      for (let i = 0; i < pairs * 2; i++) {
        const row = i >> 1, side = i % 2 ? 1 : -1;
        const w = 12 - row * (9 / pairs) * ease(clamp01(p * 1.3)); // corridor narrows to a funnel
        dummy.position.set(side * (w + 2), 3, 18 - row * 5.5);
        dummy.scale.set(0.9, 6, 0.9);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        cols.current.setMatrixAt(i, dummy.matrix);
      }
      cols.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, SCENE_Z.sell]}>
      <group position={[0, 0, 4]}>
        <mesh position={[0, 3.2, 0]} scale={[0.5, 6.4, 0.5]} material={mats.gold} geometry={boxGeo} />
        <mesh position={[0, 0.2, 0]} scale={[3, 0.4, 3]} material={mats.sandDark} geometry={boxGeo} />
        <group ref={beam} position={[0, 6.4, 0]}>
          <mesh scale={[8, 0.3, 0.4]} material={mats.gold} geometry={boxGeo} />
          <group ref={panL} position={[-4, -1.2, 0]}>
            <mesh scale={[1.6, 0.12, 1.6]} material={mats.gold} geometry={cylGeo} />
            <mesh position={[0, 0.3, 0]} scale={[0.5, 0.5, 0.5]} material={mats.glow} geometry={boxGeo} />
          </group>
          <group ref={panR} position={[4, -1.2, 0]}>
            <mesh scale={[1.6, 0.12, 1.6]} material={mats.gold} geometry={cylGeo} />
            <mesh position={[0, 0.4, 0]} scale={[0.8, 0.8, 0.8]} material={mats.turquoise} geometry={boxGeo} />
          </group>
        </group>
      </group>
      <instancedMesh ref={cols} args={[cylGeo, mats.sandstone, pairs * 2]} frustumCulled={false} />
      {stalls.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z - 6]}>
          <mesh position={[0, 0.8, 0]} scale={[3, 1.6, 2.2]} material={mats.sandDark} geometry={boxGeo} />
          <mesh position={[0, 2.8, 0]} rotation={[0.25, 0, 0]} scale={[3.6, 0.12, 2.8]} material={s.m} geometry={boxGeo} />
        </group>
      ))}
      <group position={[0, 0, -30]}>
        {[-5, 5].map((x) => (
          <mesh key={x} position={[x, 6, 0]} scale={[2.6, 12, 2.6]} material={mats.sandstone} geometry={boxGeo} />
        ))}
        <mesh position={[0, 12.5, 0]} scale={[13, 1.6, 3]} material={mats.sandstone} geometry={boxGeo} />
        <mesh position={[0, 5, -0.5]} scale={[6, 10, 0.3]} material={mats.beam} geometry={boxGeo} />
      </group>
      <pointLight position={[0, 10, 8]} intensity={110} distance={55} color="#ffc680" />
    </group>
  );
}
