"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, coneGeo, ease, clamp01, rng, useTier, SCENE_Z } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { waterMat } from "./Traffic";

const petalGeo = new THREE.ConeGeometry(0.5, 1, 6);
petalGeo.translate(0, 0.5, 0);

/** Nile flood rising over fields, lotus blooming, a column of light growing. */
export default function GrowScene() {
  const tier = useTier();
  const flood = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.Mesh>(null);
  const petals = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lotus = useMemo(() => {
    const r = rng(33);
    return Array.from({ length: tier === "full" ? 14 : 7 }, () => ({
      x: (r() - 0.5) * 22, z: -2 - r() * 34, s: 0.5 + r() * 0.6, d: r() * 0.4,
    }));
  }, [tier]);
  const perLotus = 8;

  useFrame(() => {
    const p = chapterProgress("grow");
    if (flood.current) flood.current.position.y = 0.05 + ease(clamp01(p * 1.2)) * 0.5;
    if (light.current) {
      const h = 2 + ease(clamp01(p * 1.2)) * 46;
      light.current.scale.set(1, h, 1);
      light.current.position.y = h / 2;
    }
    if (petals.current) {
      lotus.forEach((l, li) => {
        const open = ease(clamp01((p * 1.6 - l.d) / 0.6));
        for (let k = 0; k < perLotus; k++) {
          const a = (k / perLotus) * Math.PI * 2;
          dummy.position.set(l.x, 0.4, l.z);
          dummy.rotation.set(0.2 + open * 1.1, a, 0, "YXZ");
          dummy.scale.setScalar(l.s * (0.15 + open * 1.4));
          dummy.updateMatrix();
          petals.current!.setMatrixAt(li * perLotus + k, dummy.matrix);
        }
      });
      petals.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, SCENE_Z.grow]}>
      <mesh ref={flood} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -4]} material={waterMat}>
        <planeGeometry args={[60, 60]} />
      </mesh>
      <instancedMesh ref={petals} args={[petalGeo, mats.carnelian, lotus.length * perLotus]} frustumCulled={false} />
      <mesh ref={light} position={[0, 1, -6]} material={mats.beam}>
        <cylinderGeometry args={[0.7, 1.1, 1, 24, 1, true]} />
      </mesh>
      <mesh position={[0, 0.6, -6]} rotation={[0, Math.PI / 4, 0]} scale={[4, 1.2, 4]} material={mats.sandstone} geometry={coneGeo} />
      <pointLight position={[0, 8, -2]} intensity={120} distance={50} color="#9fe8d8" />
    </group>
  );
}
