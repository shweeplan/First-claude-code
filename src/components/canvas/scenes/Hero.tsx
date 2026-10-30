"use client";
import type React from "react";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, boxGeo, rng, useTier, SCENE_Z } from "../shared";
import { scrollState } from "@/lib/scroll";

/** Dune ground that spans the whole journey. Centre strip stays flat so temples sit cleanly. */
export function Dunes() {
  const tier = useTier();
  const geo = useMemo(() => {
    const w = 260, l = 560;
    const sx = tier === "full" ? 120 : 50, sz = tier === "full" ? 260 : 110;
    const g = new THREE.PlaneGeometry(w, l, sx, sz);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const edge = Math.min(1, Math.max(0, (Math.abs(x) - 14) / 30));
      const h =
        (Math.sin(x * 0.07 + z * 0.03) * 4 + Math.sin(x * 0.19 - z * 0.11) * 1.4 + Math.sin(z * 0.045) * 2) * edge;
      p.setY(i, h - 0.05);
    }
    g.computeVertexNormals();
    g.translate(0, 0, -210);
    return g;
  }, [tier]);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#d8b985" roughness={1} />
    </mesh>
  );
}

function Obelisk({ h = 14, w = 1.4, ...p }: { h?: number; w?: number } & React.ComponentProps<"group">) {
  return (
    <group {...p}>
      <mesh position={[0, h / 2, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.sandstone}>
        <cylinderGeometry args={[w * 0.55, w, h, 4]} />
      </mesh>
      <mesh position={[0, h + w * 0.45, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.gold}>
        <coneGeometry args={[w * 0.55 * 1.414 * 0.72, w * 0.9, 4]} />
      </mesh>
    </group>
  );
}
export { Obelisk };

function Pyramid({ s = 20, ...p }: { s?: number } & React.ComponentProps<"mesh">) {
  return (
    <mesh {...p} rotation={[0, Math.PI / 4, 0]} material={mats.sandstone} position={p.position}>
      <coneGeometry args={[s * 0.72, s * 0.85, 4]} />
    </mesh>
  );
}

function Dust({ count, z0, z1 }: { count: number; z0: number; z1: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const r = rng(7);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * 60;
      pos[i * 3 + 1] = r() * 16;
      pos[i * 3 + 2] = z1 + r() * (z0 - z1);
      seed[i] = r() * 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: 38 } },
      vertexShader: /* glsl */ `
        attribute float aSeed; uniform float uTime; uniform float uSize; varying float vA;
        void main(){
          vec3 p = position;
          p.x += sin(uTime*0.25 + aSeed)*1.6 + uTime*0.35;
          p.x = mod(p.x + 30., 60.) - 30.;
          p.y += sin(uTime*0.4 + aSeed*3.)*0.7;
          vec4 mv = modelViewMatrix * vec4(p,1.);
          gl_PointSize = uSize / -mv.z;
          vA = smoothstep(80., 10., -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord-.5);
          float a = smoothstep(.5,.0,d)*vA*.55;
          gl_FragColor = vec4(1.,.82,.5,a);
        }`,
    });
    return { geo: g, mat: m };
  }, [count, z0, z1]);
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
export { Dust };

/** Pointer-reactive warm light for the hero. */
function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    const { x, y } = scrollState.pointer;
    ref.current.position.x += (x * 10 - ref.current.position.x) * 0.06;
    ref.current.position.y += (6 + y * 4 - ref.current.position.y) * 0.06;
  });
  return <pointLight ref={ref} position={[0, 6, 6]} intensity={90} distance={40} color="#ffcf8a" />;
}

export default function HeroScene() {
  const tier = useTier();
  const sun = useRef<THREE.Group>(null);
  const obe = useRef<THREE.Group>(null);
  const flank = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 6 }, (_, i) => ({
      x: (i % 2 ? 1 : -1) * (26 + r() * 40),
      z: -30 - r() * 60,
      s: 14 + r() * 22,
    }));
  }, []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (sun.current) sun.current.position.y = 9 + Math.sin(t * 0.2) * 0.2;
    if (obe.current) {
      const rise = Math.min(1, t / 3.2); // rises from the dunes on load
      obe.current.position.y = -16 * Math.pow(1 - rise, 3);
      obe.current.rotation.y = scrollState.pointer.x * 0.12;
    }
  });
  return (
    <group position={[0, 0, SCENE_Z.hero]}>
      <group ref={sun} position={[0, 9, -50]}>
        <mesh material={mats.glow}>
          <circleGeometry args={[7, 48]} />
        </mesh>
        <mesh position={[0, 0, -0.1]} material={mats.beam} scale={1.9}>
          <circleGeometry args={[7, 48]} />
        </mesh>
      </group>
      <group ref={obe} position={[0, 0, -18]}>
        <Obelisk h={16} w={1.6} />
        <mesh position={[0, 0.4, 0]} scale={[5, 0.8, 5]} material={mats.sandDark} geometry={boxGeo} />
        <mesh position={[0, 0.1, 0]} scale={[7, 0.2, 7]} material={mats.sandstone} geometry={boxGeo} />
      </group>
      {flank.map((f, i) => (
        <Pyramid key={i} s={f.s} position={[f.x, f.s * 0.42, f.z]} />
      ))}
      <Dust count={tier === "full" ? 1400 : 380} z0={20} z1={-440} />
      {tier === "full" && <CursorLight />}
    </group>
  );
}
