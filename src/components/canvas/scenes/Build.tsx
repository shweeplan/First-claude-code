"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { stoneMat, texBox, ease, clamp01, rng, useTier, SCENE_Z, useSceneFrame } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { Obelisk } from "../Props";

type Block = { to: THREE.Vector3; from: THREE.Vector3; s: THREE.Vector3; d: number };

/** A stepped temple whose carved blocks fly in and assemble as the chapter scrolls. */
export default function BuildScene() {
  const tier = useTier();
  const inst = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const obe = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => texBox(1, 1, 1, 0.45), []);

  const blocks = useMemo<Block[]>(() => {
    const r = rng(11);
    const out: Block[] = [];
    const levels = tier === "full" ? 5 : 4;
    for (let l = 0; l < levels; l++) {
      const n = levels - l + 1;
      for (let x = 0; x < n * 2; x++)
        for (let z = 0; z < n; z++) {
          const bw = 2.4, bh = 1.3;
          out.push({
            to: new THREE.Vector3((x - n + 0.5) * bw, bh * (l + 0.5), (z - n / 2 + 0.5) * bw - 2),
            from: new THREE.Vector3((r() - 0.5) * 40, 22 + r() * 18, (r() - 0.5) * 30 - 2),
            s: new THREE.Vector3(bw * 0.96, bh * 0.96, bw * 0.96),
            d: l * 0.16 + r() * 0.12,
          });
        }
    }
    return out;
  }, [tier]);

  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = -8; i <= 8; i += 2) pts.push(i, 0.06, -12, i, 0.06, 8, -14, 0.06, i - 2, 14, 0.06, i - 2);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => { lineGeo.dispose(); geo.dispose(); }, [lineGeo, geo]);

  useSceneFrame(() => {
    const p = chapterProgress("build");
    const m = inst.current;
    if (m) {
      blocks.forEach((b, i) => {
        const t = ease(clamp01((p * 1.5 - b.d) / 0.55));
        dummy.position.lerpVectors(b.from, b.to, t);
        const vis = p > 0.002 ? 1 : 0; // blocks stay hidden until the chapter starts
        dummy.rotation.set((1 - t) * 1.2, (1 - t) * 2, 0);
        dummy.scale.copy(b.s).multiplyScalar(vis);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
    if (obe.current) obe.current.position.y = -22 + 22 * ease(clamp01((p - 0.45) / 0.4));
    if (lines.current) (lines.current.material as THREE.LineBasicMaterial).opacity = 0.9 * (1 - ease(clamp01((p - 0.5) / 0.4)));
  });

  return (
    <group position={[3, 0, SCENE_Z.build - 22]} scale={0.8}>
      <instancedMesh ref={inst} args={[geo, stoneMat("sandstone", 1, 1, 1.4), blocks.length]} castShadow receiveShadow frustumCulled={false} />
      <group ref={obe} position={[10, -22, 2]}>
        <Obelisk h={13} w={1.2} />
      </group>
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial color="#ebc77e" transparent opacity={0.9} toneMapped={false} />
      </lineSegments>
    </group>
  );
}
