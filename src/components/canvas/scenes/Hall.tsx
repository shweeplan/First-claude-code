"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, boxGeo, cylGeo, useTier, SCENE_Z } from "../shared";

const lotusCap = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.6);

/** Hypostyle hall at night: columns with lotus capitals and flickering torchlight. */
export default function HallScene() {
  const tier = useTier();
  const shafts = useRef<THREE.InstancedMesh>(null);
  const caps = useRef<THREE.InstancedMesh>(null);
  const torch1 = useRef<THREE.PointLight>(null);
  const torch2 = useRef<THREE.PointLight>(null);
  const rows = tier === "full" ? 7 : 4;
  const spots = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < rows; r++) for (const x of [-9, -3.5, 3.5, 9]) out.push([x, 2 - r * 9]);
    return out;
  }, [rows]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const placed = useRef(false);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!placed.current && shafts.current && caps.current) {
      spots.forEach(([x, z], i) => {
        dummy.position.set(x, 5, z);
        dummy.scale.set(1.1, 10, 1.1);
        dummy.updateMatrix();
        shafts.current!.setMatrixAt(i, dummy.matrix);
        dummy.position.set(x, 10.4, z);
        dummy.scale.set(1.5, 1.2, 1.5);
        dummy.updateMatrix();
        caps.current!.setMatrixAt(i, dummy.matrix);
      });
      shafts.current.instanceMatrix.needsUpdate = true;
      caps.current.instanceMatrix.needsUpdate = true;
      placed.current = true;
    }
    if (torch1.current) torch1.current.intensity = 70 + Math.sin(t * 9) * 8 + Math.sin(t * 17) * 5;
    if (torch2.current) torch2.current.intensity = 70 + Math.sin(t * 11 + 2) * 8 + Math.sin(t * 19) * 5;
  });

  return (
    <group position={[0, 0, SCENE_Z.start]}>
      <instancedMesh ref={shafts} args={[cylGeo, mats.sandstone, spots.length]} frustumCulled={false} />
      <instancedMesh ref={caps} args={[lotusCap, mats.gold, spots.length]} frustumCulled={false} />
      <mesh position={[0, 0.02, -8]} scale={[40, 0.1, 80]} material={mats.dark} geometry={boxGeo} />
      {[-6.2, 6.2].map((x) => (
        <group key={x} position={[x, 0, 6]}>
          <mesh position={[0, 2, 0]} scale={[0.15, 4, 0.15]} material={mats.dark} geometry={boxGeo} />
          <mesh position={[0, 4.2, 0]} material={mats.glow}><sphereGeometry args={[0.35, 12, 12]} /></mesh>
        </group>
      ))}
      <pointLight ref={torch1} position={[-6.2, 4.4, 6]} intensity={70} distance={30} color="#ff9a3c" />
      <pointLight ref={torch2} position={[6.2, 4.4, 6]} intensity={70} distance={30} color="#ff9a3c" />
    </group>
  );
}
