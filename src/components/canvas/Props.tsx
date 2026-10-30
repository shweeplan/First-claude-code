"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type React from "react";
import { mats, stoneMat, reliefMat, texBox, rng, quality } from "./shared";
import { stoneTex } from "./textures";

type G = React.ComponentProps<"group">;

let _pyrMat: THREE.MeshStandardMaterial | null = null;
let _pyrBump = true;
function pyramidMat() {
  if (!_pyrMat || _pyrBump !== quality.bump) {
    _pyrBump = quality.bump;
    const t = stoneTex("limestone", 5, 2.2);
    _pyrMat = new THREE.MeshStandardMaterial({ map: t.map, bumpMap: quality.bump ? t.bump : null, bumpScale: 2, roughness: 1, flatShading: true });
  }
  return _pyrMat;
}

/** Stepped limestone pyramid in one mesh (lathe with a stair profile, 4 sides). */
export function PyramidMesh({ s = 20, steps = 18, ...p }: { s?: number; steps?: number } & G) {
  const geo = useMemo(() => {
    const R = s * 0.72, H = s * 0.85;
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i < steps; i++) {
      const r0 = R * (1 - i / steps), r1 = R * (1 - (i + 1) / steps);
      const y0 = (H * i) / steps, y1 = (H * (i + 1)) / steps;
      pts.push(new THREE.Vector2(r0, y0), new THREE.Vector2(r0 - (r0 - r1) * 0.3, y1), new THREE.Vector2(r1, y1));
    }
    pts.push(new THREE.Vector2(0, H));
    return new THREE.LatheGeometry(pts, 4);
  }, [s, steps]);
  return (
    <group {...p}>
      <mesh geometry={geo} material={pyramidMat()} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow />
    </group>
  );
}

/** Obelisk: carved hieroglyph faces, gold pyramidion, stepped plinth. */
export function Obelisk({ h = 14, w = 1.4, ...p }: { h?: number; w?: number } & G) {
  return (
    <group {...p}>
      <mesh position={[0, h / 2 + w * 1.1, 0]} rotation={[0, Math.PI / 4, 0]} material={reliefMat(4, 1, 2, 14)} castShadow receiveShadow>
        <cylinderGeometry args={[w * 0.55, w, h, 4]} />
      </mesh>
      <mesh position={[0, h + w * 1.1 + w * 0.45, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.gold} castShadow>
        <coneGeometry args={[w * 0.55 * 1.414 * 0.72, w * 0.9, 4]} />
      </mesh>
      <mesh position={[0, w * 0.55, 0]} geometry={texBox(w * 3.2, w * 1.1, w * 3.2, 0.3)} material={stoneMat("sandstone", 1, 1, 1.5)} castShadow receiveShadow />
      <mesh position={[0, w * 0.15, 0]} geometry={texBox(w * 4.2, w * 0.3, w * 4.2, 0.3)} material={stoneMat("sandstone", 1, 1, 1.5)} receiveShadow />
    </group>
  );
}

/** One tapered temple tower: coursed stone, cornice, square windows, flag-pole niches, carved relief panel. */
export function PylonTower({ w = 9, h = 16, d = 4, ...p }: { w?: number; h?: number; d?: number } & G) {
  const body = useMemo(() => {
    const g = texBox(w, h, d, 0.12);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const top = pos.getY(i) > 0;
      if (top) {
        pos.setX(i, pos.getX(i) * 0.86);
        pos.setZ(i, pos.getZ(i) * 0.9);
      }
      pos.setY(i, pos.getY(i) + h / 2);
    }
    g.computeVertexNormals();
    return g;
  }, [w, h, d]);
  const dark = mats.dark;
  return (
    <group {...p}>
      <mesh geometry={body} material={stoneMat("sandstone", 1, 1, 1.3)} castShadow receiveShadow />
      <mesh position={[0, h + 0.45, 0]} geometry={texBox(w * 0.86 + 1, 0.9, d * 0.9 + 1, 0.2)} material={stoneMat("sandstone", 1, 1, 1)} castShadow />
      {[0.34, 0.5, 0.66].map((fy, i) => (
        <mesh key={i} position={[(i - 1) * w * 0.28, h * 0.88, d * 0.5 * (1 - 0.1 * 0.88) + 0.02]} scale={[0.7, 0.9, 0.3]} material={dark} geometry={texBox(1, 1, 1, 0.1)} />
      ))}
      {[-0.34, 0.34].map((fx) => (
        <mesh key={fx} position={[fx * w, h * 0.45, d * 0.5 * 0.96]} scale={[0.5, h * 0.7, 0.3]} material={dark} geometry={texBox(1, 1, 1, 0.1)} />
      ))}
      <mesh position={[0, h * 0.58, d * 0.5 * 0.95 + 0.08]} material={reliefMat(1, 1, 3, 9)}>
        <planeGeometry args={[w * 0.5, h * 0.36]} />
      </mesh>
    </group>
  );
}

/** Seated colossal statue: throne, torso, nemes headdress, tall crown. Stylised blocks, not a copy of any real statue. */
export function Colossus({ s = 1, ...p }: { s?: number } & G) {
  const m = stoneMat("sandstone", 1, 1, 1);
  const b = (w: number, h: number, d: number) => texBox(w, h, d, 0.4);
  return (
    <group scale={s} {...p}>
      <mesh position={[0, 0.8, 0]} geometry={b(2.6, 1.6, 3)} material={m} castShadow receiveShadow />
      <mesh position={[0, 2.5, -0.4]} geometry={b(1.5, 2.3, 1.1)} material={m} castShadow />
      <mesh position={[-0.55, 1.75, 0.9]} geometry={b(0.7, 0.7, 1.9)} material={m} castShadow />
      <mesh position={[0.55, 1.75, 0.9]} geometry={b(0.7, 0.7, 1.9)} material={m} castShadow />
      <mesh position={[-0.95, 2.3, 0.1]} geometry={b(0.4, 0.4, 1.3)} material={m} castShadow />
      <mesh position={[0.95, 2.3, 0.1]} geometry={b(0.4, 0.4, 1.3)} material={m} castShadow />
      <mesh position={[0, 4.15, -0.3]} geometry={b(0.95, 1.05, 0.95)} material={m} castShadow />
      <mesh position={[-0.6, 3.95, -0.45]} geometry={b(0.28, 1.3, 0.8)} material={mats.lapis} />
      <mesh position={[0.6, 3.95, -0.45]} geometry={b(0.28, 1.3, 0.8)} material={mats.lapis} />
      <mesh position={[0, 4.15, 0.22]} geometry={b(0.18, 0.3, 0.2)} material={m} />
      <mesh position={[0, 5.2, -0.3]} material={mats.carnelian} castShadow>
        <cylinderGeometry args={[0.2, 0.5, 1.3, 10]} />
      </mesh>
      <mesh position={[0, 5.95, -0.3]} material={mats.sandstone}>
        <sphereGeometry args={[0.22, 10, 8]} />
      </mesh>
    </group>
  );
}

/** Palm trees: instanced trunks and fronds, laid out once. */
export function Palms({ spots }: { spots: [number, number, number][] }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const perPalm = 9;
  const leafGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(0.55, 0.05, 3.4, 1, 1, 6);
    g.translate(0, 0, 1.7);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const z = p.getZ(i) / 3.4; // 0..1 along the frond
      p.setX(i, p.getX(i) * (1 - z * 0.85));
      p.setY(i, p.getY(i) - z * z * 0.7); // droop
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.26, 1, 8), []);
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4f7d36", roughness: 0.8, side: THREE.DoubleSide }), []);
  const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7a5a3a", roughness: 1 }), []);

  useLayoutEffect(() => {
    const r = rng(spots.length * 13 + 5);
    const d = new THREE.Object3D();
    spots.forEach(([x, y, z], i) => {
      const h = 4.5 + r() * 3;
      const lean = (r() - 0.5) * 0.18;
      d.position.set(x, y + h / 2, z);
      d.rotation.set(0, 0, lean);
      d.scale.set(1, h, 1);
      d.updateMatrix();
      trunks.current!.setMatrixAt(i, d.matrix);
      for (let k = 0; k < perPalm; k++) {
        d.position.set(x + Math.sin(lean) * -h * 0.5, y + h, z);
        d.rotation.set(0.35 + r() * 0.5, (k / perPalm) * 6.283 + r() * 0.3, 0, "YXZ");
        d.scale.setScalar(0.85 + r() * 0.5);
        d.updateMatrix();
        leaves.current!.setMatrixAt(i * perPalm + k, d.matrix);
      }
    });
    trunks.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [spots]);

  return (
    <>
      <instancedMesh ref={trunks} args={[trunkGeo, trunkMat, spots.length]} castShadow frustumCulled={false} />
      <instancedMesh ref={leaves} args={[leafGeo, leafMat, spots.length * perPalm]} castShadow frustumCulled={false} />
    </>
  );
}
