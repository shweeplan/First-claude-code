"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mats, boxGeo, coneGeo, texBox, stoneMat, rng, useTier, SCENE_Z, useSceneFrame } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { createWaterMat, updateWater } from "../water";
import { Colossus, Obelisk, Palms, PylonTower } from "../Props";

const sailShape = new THREE.Shape();
sailShape.moveTo(-1.5, 0);
sailShape.lineTo(2, 0);
sailShape.lineTo(1.3, 4.6);
sailShape.closePath();

/** River of visitors flowing to a temple gate; feluccas under lateen sails, figures walking the banks. */
export default function TrafficScene() {
  const tier = useTier();
  const hulls = useRef<THREE.InstancedMesh>(null);
  const sails = useRef<THREE.InstancedMesh>(null);
  const masts = useRef<THREE.InstancedMesh>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const reedRef = useRef<THREE.InstancedMesh>(null);
  const beams = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const water = useMemo(() => createWaterMat({ deep: "#0d4a78", shallow: "#3fa3a8" }), []);
  const sailGeo = useMemo(() => new THREE.ShapeGeometry(sailShape), []);
  const bodyGeo = useMemo(() => new THREE.CylinderGeometry(0.15, 0.2, 0.9, 6), []);
  const headGeo = useMemo(() => new THREE.SphereGeometry(0.14, 8, 6), []);
  const hullMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8a5a30", roughness: 0.8 }), []);
  const sailMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f6efdc", roughness: 0.9, side: THREE.DoubleSide }), []);
  useEffect(() => () => { water.dispose(); sailGeo.dispose(); bodyGeo.dispose(); headGeo.dispose(); hullMat.dispose(); sailMat.dispose(); }, [water, sailGeo, bodyGeo, headGeo, hullMat, sailMat]);

  const nBoats = tier === "full" ? 8 : 4;
  const nFig = tier === "full" ? 70 : 24;
  const reeds = useMemo(() => {
    const r = rng(21);
    const n = tier === "full" ? 200 : 70;
    return Array.from({ length: n }, () => ({ x: (r() > 0.5 ? 1 : -1) * (6.2 + r() * 2.2), z: 30 - r() * 80, h: 1.2 + r() * 1.8 }));
  }, [tier]);
  const palms = useMemo<[number, number, number][]>(() => {
    const n = tier === "full" ? 9 : 4;
    return Array.from({ length: n * 2 }, (_, i) => [(i % 2 ? 1 : -1) * (11 + (i % 3) * 1.8), 0, 26 - Math.floor(i / 2) * 6.5 + (i % 2) * 2]);
  }, [tier]);

  useLayoutEffect(() => {
    reeds.forEach((r, i) => {
      dummy.position.set(r.x, r.h / 2, r.z);
      dummy.rotation.set(0, 0, (r.x % 1) * 0.1);
      dummy.scale.set(0.08, r.h, 0.08);
      dummy.updateMatrix();
      reedRef.current!.setMatrixAt(i, dummy.matrix);
    });
    reedRef.current!.instanceMatrix.needsUpdate = true;
  }, [reeds, dummy]);

  useSceneFrame((s) => {
    const t = s.clock.elapsedTime;
    updateWater(water, t);
    const p = chapterProgress("traffic");
    const speed = 0.035 + p * 0.04;
    for (let i = 0; i < nBoats; i++) {
      const u = (i / nBoats + t * speed) % 1;
      const z = 30 - u * 80;
      const x = Math.sin(u * 8 + i) * 1.6 + (i % 3 - 1) * 1.7;
      const roll = Math.sin(t * 1.1 + i) * 0.05;
      dummy.position.set(x, 0.32 + Math.sin(t * 1.5 + i) * 0.04, z);
      dummy.rotation.set(0, Math.PI, roll);
      dummy.scale.set(1.1, 0.5, 3.4);
      dummy.updateMatrix();
      hulls.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x + 0.02, 0.9, z);
      dummy.rotation.set(0, 1.05, roll * 1.2 + 0.1); // angled so the sail shows to the camera
      dummy.scale.setScalar(0.8);
      dummy.updateMatrix();
      sails.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 2.2, z);
      dummy.rotation.set(0, 0, roll);
      dummy.scale.set(0.08, 3.6, 0.08);
      dummy.updateMatrix();
      masts.current!.setMatrixAt(i, dummy.matrix);
    }
    hulls.current!.instanceMatrix.needsUpdate = true;
    sails.current!.instanceMatrix.needsUpdate = true;
    masts.current!.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < nFig; i++) {
      const side = i % 2 ? 1 : -1;
      const u = (i / nFig + t * 0.012 * (1 + (i % 3) * 0.2)) % 1;
      const z = 32 - u * 80;
      const x = side * (8.8 + ((i * 7919) % 5) * 0.35);
      const bob = Math.abs(Math.sin(t * 5 + i)) * 0.06;
      dummy.position.set(x, 0.5 + bob, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      bodies.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 1.15 + bob;
      dummy.updateMatrix();
      heads.current!.setMatrixAt(i, dummy.matrix);
    }
    bodies.current!.instanceMatrix.needsUpdate = true;
    heads.current!.instanceMatrix.needsUpdate = true;
    if (beams.current) beams.current.children.forEach((c, i) => (c.rotation.z = (i - 1.5) * (0.12 + p * 0.1)));
  });

  return (
    <group position={[0, 0, SCENE_Z.traffic]}>
      <mesh position={[0, 0.03, -10]} rotation={[-Math.PI / 2, 0, 0]} material={water}>
        <planeGeometry args={[12, 100, 1, 1]} />
      </mesh>
      <instancedMesh ref={hulls} args={[boxGeo, hullMat, nBoats]} castShadow frustumCulled={false} />
      <instancedMesh ref={sails} args={[sailGeo, sailMat, nBoats]} castShadow frustumCulled={false} />
      <instancedMesh ref={masts} args={[boxGeo, mats.dark, nBoats]} frustumCulled={false} />
      <instancedMesh ref={bodies} args={[bodyGeo, mats.linen, nFig]} castShadow frustumCulled={false} />
      <instancedMesh ref={heads} args={[headGeo, mats.sandDark, nFig]} frustumCulled={false} />
      <instancedMesh ref={reedRef} args={[coneGeo, mats.turquoise, reeds.length]} frustumCulled={false} />
      <Palms spots={palms} />

      {/* temple gate: two tapered towers, lintel, sun disc, seated colossi and an obelisk */}
      <group position={[0, 0, -44]}>
        <PylonTower position={[-9.5, 0, 0]} w={8} h={18} d={5} />
        <PylonTower position={[9.5, 0, 0]} w={8} h={18} d={5} />
        <mesh position={[0, 15.8, 0]} geometry={texBox(12, 2.4, 4.6, 0.15)} material={stoneMat("sandstone", 1, 1, 1.2)} castShadow />
        <mesh position={[0, 17.2, 0.1]} geometry={texBox(12.6, 0.6, 5, 0.15)} material={mats.lapis} />
        <mesh position={[0, 20.6, 0]} material={mats.glow}>
          <circleGeometry args={[2.4, 40]} />
        </mesh>
        <group ref={beams} position={[0, 20.6, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, -16, 8]} material={mats.beam}>
              <coneGeometry args={[4, 30, 16, 1, true]} />
            </mesh>
          ))}
        </group>
        <Colossus position={[-4.2, 0, 7]} s={1.5} />
        <Colossus position={[4.2, 0, 7]} s={1.5} />
        <Obelisk position={[-16, 0, 8]} h={15} w={1.2} />
      </group>
    </group>
  );
}
