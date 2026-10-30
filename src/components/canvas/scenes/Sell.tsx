"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mats, boxGeo, cylGeo, texBox, stoneMat, ease, clamp01, rng, useTier, SCENE_Z, useSceneFrame } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { PylonTower } from "../Props";

/** Avenue of ram-headed sphinxes that narrows into a gate, with a scale weighing visits against orders. */
export default function SellScene() {
  const tier = useTier();
  const beam = useRef<THREE.Group>(null);
  const panL = useRef<THREE.Group>(null);
  const panR = useRef<THREE.Group>(null);
  const plinths = useRef<THREE.InstancedMesh>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const legs = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const horns = useRef<THREE.InstancedMesh>(null);
  const snouts = useRef<THREE.InstancedMesh>(null);
  const glows = useRef<THREE.InstancedMesh>(null);
  const parent = useMemo(() => new THREE.Object3D(), []);
  const child = useMemo(() => new THREE.Object3D(), []);
  const unit = useMemo(() => texBox(1, 1, 1, 0.45), []);
  const headGeo = useMemo(() => new THREE.SphereGeometry(1, 12, 10), []);
  const hornGeo = useMemo(() => new THREE.TorusGeometry(0.3, 0.08, 6, 14), []);
  useEffect(() => { parent.add(child); return () => { unit.dispose(); headGeo.dispose(); hornGeo.dispose(); }; }, [parent, child, unit, headGeo, hornGeo]);
  const pairs = tier === "full" ? 8 : 5;
  const stalls = useMemo(() => {
    const r = rng(5);
    const palette = [mats.carnelian, mats.lapis, mats.turquoise];
    return Array.from({ length: tier === "full" ? 10 : 5 }, (_, i) => ({ x: (i % 2 ? 1 : -1) * (17 + r() * 3), z: 18 - i * 6, m: palette[i % 3] }));
  }, [tier]);

  /** place one instance of a sphinx part: parent transform (sphinx), then local offset/scale */
  const put = (mesh: THREE.InstancedMesh | null, idx: number, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number) => {
    if (!mesh) return;
    child.position.set(lx, ly, lz);
    child.scale.set(sx, sy, sz);
    parent.updateMatrixWorld(true);
    mesh.setMatrixAt(idx, child.matrixWorld);
  };

  useSceneFrame((s) => {
    const p = chapterProgress("sell");
    const tilt = Math.sin(s.clock.elapsedTime * 0.8) * 0.05 + (0.35 - ease(clamp01(p * 1.4)) * 0.35);
    if (beam.current) beam.current.rotation.z = tilt;
    if (panL.current) panL.current.position.y = -Math.sin(tilt) * 4 - 1.2;
    if (panR.current) panR.current.position.y = Math.sin(tilt) * 4 - 1.2;
    const funnel = ease(clamp01(p * 1.3));
    for (let i = 0; i < pairs * 2; i++) {
      const row = i >> 1, side = i % 2 ? 1 : -1;
      const w = 9 - row * (3.2 / pairs) * funnel; // avenue narrows as the chapter plays
      parent.position.set(side * w, 0, 20 - row * 5.4);
      parent.rotation.set(0, side > 0 ? Math.PI : 0, 0); // face the path
      parent.scale.setScalar(1);
      put(plinths.current, i, 0, 0.3, 0, 3.6, 0.6, 1.9);
      put(bodies.current, i, -0.2, 1.1, 0, 2.3, 1.0, 1.1);
      put(legs.current, i * 2, 0.95, 0.95, 0.38, 1.3, 0.7, 0.3);
      put(legs.current, i * 2 + 1, 0.95, 0.95, -0.38, 1.3, 0.7, 0.3);
      put(heads.current, i, 1.5, 1.85, 0, 0.62, 0.58, 0.5);
      put(snouts.current, i, 2.05, 1.7, 0, 0.55, 0.32, 0.3);
      put(horns.current, i * 2, 1.4, 1.85, 0.5, 1, 1, 1);
      put(horns.current, i * 2 + 1, 1.4, 1.85, -0.5, 1, 1, 1);
      put(glows.current, i, 1.7, 0.08, 0, 0.12, 0.1, 1.7);
    }
    for (const m of [plinths, bodies, legs, heads, snouts, horns, glows]) if (m.current) m.current.instanceMatrix.needsUpdate = true;
  });

  const n = pairs * 2;
  const stone = stoneMat("sandstone", 1, 1, 1.4);
  return (
    <group position={[0, 0, SCENE_Z.sell - 4]} scale={0.75}>
      <group position={[0, 0, 4]}>
        <mesh position={[0, 3.2, 0]} scale={[0.5, 6.4, 0.5]} material={mats.gold} geometry={boxGeo} castShadow />
        <mesh position={[0, 0.2, 0]} geometry={texBox(3, 0.4, 3, 0.4)} material={stone} receiveShadow />
        <group ref={beam} position={[0, 6.4, 0]}>
          <mesh scale={[8, 0.3, 0.4]} material={mats.gold} geometry={boxGeo} castShadow />
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
      {/* paved avenue */}
      <mesh position={[0, 0.04, -2]} geometry={texBox(11, 0.08, 64, 0.2)} material={stone} receiveShadow />
      <instancedMesh ref={plinths} args={[unit, stone, n]} castShadow receiveShadow frustumCulled={false} />
      <instancedMesh ref={bodies} args={[unit, stone, n]} castShadow frustumCulled={false} />
      <instancedMesh ref={legs} args={[unit, stone, n * 2]} castShadow frustumCulled={false} />
      <instancedMesh ref={heads} args={[headGeo, stone, n]} castShadow frustumCulled={false} />
      <instancedMesh ref={snouts} args={[unit, stone, n]} castShadow frustumCulled={false} />
      <instancedMesh ref={horns} args={[hornGeo, mats.gold, n * 2]} castShadow frustumCulled={false} />
      <instancedMesh ref={glows} args={[unit, mats.flame, n]} frustumCulled={false} />
      {stalls.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z - 6]}>
          <mesh position={[0, 0.8, 0]} geometry={texBox(3, 1.6, 2.2, 0.3)} material={stone} castShadow receiveShadow />
          <mesh position={[0, 2.8, 0]} rotation={[0.25, 0, 0]} scale={[3.6, 0.12, 2.8]} material={s.m} geometry={boxGeo} castShadow />
        </group>
      ))}
      <group position={[0, 0, -34]}>
        <PylonTower position={[-7, 0, 0]} w={6} h={13} d={3.5} />
        <PylonTower position={[7, 0, 0]} w={6} h={13} d={3.5} />
        <mesh position={[0, 5, -0.5]} scale={[8, 10, 0.3]} material={mats.beam} geometry={boxGeo} />
      </group>
    </group>
  );
}
