"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, boxGeo, ease, clamp01, rng, useTier, SCENE_Z } from "../shared";
import { chapterProgress } from "@/lib/scroll";
import { createWaterMat, updateWater } from "../water";
import { Palms, PyramidMesh } from "../Props";

const petalGeo = new THREE.ConeGeometry(0.5, 1, 6);
petalGeo.translate(0, 0.5, 0);

/** Light column: additive, fades out toward the top, brighter at the base. */
const columnMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: { uTime: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `
    varying vec2 vUv; uniform float uTime;
    void main(){
      float fade = pow(1.-vUv.y, 1.4);
      float streak = .75 + .25*sin(vUv.x*40. + uTime*2. + vUv.y*6.);
      gl_FragColor = vec4(1., .86, .55, fade*streak*.55);
    }`,
});

const FIELD_COLORS = ["#6f8f3a", "#8aa24a", "#587a34"];

export default function GrowScene() {
  const tier = useTier();
  const flood = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.Mesh>(null);
  const petals = useRef<THREE.InstancedMesh>(null);
  const motes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lotus = useMemo(() => {
    const r = rng(33);
    return Array.from({ length: tier === "full" ? 14 : 7 }, () => ({
      x: (r() - 0.5) * 22, z: -2 - r() * 34, s: 0.5 + r() * 0.6, d: r() * 0.4,
    }));
  }, [tier]);
  const nMotes = tier === "full" ? 60 : 24;
  const perLotus = 8;
  const floodMat = useMemo(() => createWaterMat({ deep: "#157079", shallow: "#7fd0c4", flood: true }), []);
  const palms = useMemo<[number, number, number][]>(() => Array.from({ length: tier === "full" ? 10 : 4 }, (_, i) => [(i % 2 ? 1 : -1) * (13 + (i % 4) * 2.2), 0.3, 12 - Math.floor(i / 2) * 7]), [tier]);
  const fieldMats = useMemo(() => FIELD_COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 })), []);
  useEffect(() => () => { fieldMats.forEach((m) => m.dispose()); floodMat.dispose(); }, [fieldMats, floodMat]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    columnMat.uniforms.uTime.value = t;
    updateWater(floodMat, t);
    const p = chapterProgress("grow");
    const rise = ease(clamp01(p * 1.2));
    if (flood.current) flood.current.position.y = 0.05 + rise * 0.5;
    if (light.current) {
      const h = 2 + rise * 46;
      light.current.scale.set(1, h, 1);
      light.current.position.y = h / 2;
    }
    if (motes.current) {
      for (let i = 0; i < nMotes; i++) {
        const u = (t * 0.12 + i / nMotes) % 1;
        const a = i * 2.4;
        dummy.position.set(Math.cos(a) * (0.6 + u * 1.8), 1 + u * (4 + rise * 40), -6 + Math.sin(a) * (0.6 + u * 1.8));
        dummy.scale.setScalar(0.12 * (1 - u));
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        motes.current.setMatrixAt(i, dummy.matrix);
      }
      motes.current.instanceMatrix.needsUpdate = true;
    }
    if (petals.current) {
      lotus.forEach((l, li) => {
        const open = ease(clamp01((p * 1.6 - l.d) / 0.6));
        for (let k = 0; k < perLotus; k++) {
          const a = (k / perLotus) * Math.PI * 2;
          dummy.position.set(l.x, 0.4 + rise * 0.5, l.z);
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
      {/* fields along the banks, slowly drowned by the flood */}
      {[-18, -9, 9, 18].map((x, i) => (
        <mesh key={x} position={[x, 0.22, -8]} scale={[7, 0.1, 44]} material={fieldMats[i % 3]} geometry={boxGeo} />
      ))}
      <mesh ref={flood} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -4]} material={floodMat}>
        <planeGeometry args={[60, 60]} />
      </mesh>
      <instancedMesh ref={petals} args={[petalGeo, mats.carnelian, lotus.length * perLotus]} frustumCulled={false} />
      <mesh ref={light} position={[0, 1, -6]} material={columnMat}>
        <cylinderGeometry args={[0.5, 1.1, 1, 24, 1, true]} />
      </mesh>
      <instancedMesh ref={motes} args={[new THREE.SphereGeometry(1, 6, 6), mats.glow, nMotes]} frustumCulled={false} />
      <PyramidMesh s={9} steps={10} position={[0, 0, -6]} />
      <Palms spots={palms} />
      <pointLight position={[0, 8, -2]} intensity={120} distance={50} color="#9fe8d8" />
    </group>
  );
}
