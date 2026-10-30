"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mats, cylGeo, texBox, stoneMat, reliefMat, useTier, SCENE_Z, useSceneFrame } from "../shared";
import { paintedWallTex } from "../textures";

/** Papyrus-bell capital profile, lathed. */
const capGeo = new THREE.LatheGeometry(
  [[0.95, 0], [1.0, 0.25], [1.25, 0.6], [1.6, 1.1], [1.78, 1.5], [1.6, 1.72], [0, 1.72]].map(([x, y]) => new THREE.Vector2(x, y)),
  18,
);

const flameGeo = new THREE.ConeGeometry(0.32, 1, 8);

/** Rising embers around the torches. */
function Embers({ count, positions }: { count: number; positions: [number, number, number][] }) {
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i % positions.length];
      pos.set([x, y, z], i * 3);
      seed[i] = (i * 0.6180339) % 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSeed; uniform float uTime; varying float vA;
        void main(){
          float t = fract(uTime*.25 + aSeed);
          vec3 p = position + vec3(sin(aSeed*40.+uTime)*.5*t, t*5., cos(aSeed*30.+uTime)*.5*t);
          vec4 mv = modelViewMatrix*vec4(p,1.);
          gl_PointSize = (1.-t)*90./-mv.z;
          vA = 1.-t;
          gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-.5); gl_FragColor = vec4(1.,.55,.15, smoothstep(.5,0.,d)*vA); }`,
    });
    return { geo: g, mat: m };
  }, [count, positions]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useSceneFrame((s) => { mat.uniforms.uTime.value = s.clock.elapsedTime; });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

const TORCHES: [number, number, number][] = [[-6.2, 4.4, 6], [6.2, 4.4, 6], [-6.2, 4.4, -12], [6.2, 4.4, -12]];

/** Hypostyle hall at night: carved columns with papyrus capitals, painted walls, flickering torchlight. */
export default function HallScene() {
  const tier = useTier();
  const shafts = useRef<THREE.InstancedMesh>(null);
  const caps = useRef<THREE.InstancedMesh>(null);
  const bases = useRef<THREE.InstancedMesh>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const flames = useRef<(THREE.Mesh | null)[]>([]);
  const torch1 = useRef<THREE.PointLight>(null);
  const torch2 = useRef<THREE.PointLight>(null);
  const rows = tier === "full" ? 7 : 4;
  const spots = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < rows; r++) for (const x of [-9, -3.5, 3.5, 9]) out.push([x, 2 - r * 9]);
    return out;
  }, [rows]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ map: paintedWallTex(), roughness: 1 }), []);
  useEffect(() => () => wall.dispose(), [wall]);

  useLayoutEffect(() => {
    const set = (m: THREE.InstancedMesh | null, i: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
      if (!m) return;
      dummy.position.set(x, y, z);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    };
    spots.forEach(([x, z], i) => {
      set(shafts.current, i, x, 5.2, z, 1.1, 10, 1.1);
      set(caps.current, i, x, 9.7, z, 1, 1, 1);
      set(bases.current, i, x, 0.25, z, 1.5, 0.5, 1.5);
      set(rings.current, i, x, 9.2, z, 1.2, 0.25, 1.2);
    });
    for (const m of [shafts, caps, bases, rings]) if (m.current) m.current.instanceMatrix.needsUpdate = true;
  }, [spots, dummy]);

  useSceneFrame((s) => {
    const t = s.clock.elapsedTime;
    if (torch1.current) torch1.current.intensity = 70 + Math.sin(t * 9) * 8 + Math.sin(t * 17) * 5;
    if (torch2.current) torch2.current.intensity = 70 + Math.sin(t * 11 + 2) * 8 + Math.sin(t * 19) * 5;
    flames.current.forEach((f, i) => {
      if (!f) return;
      const k = 1 + Math.sin(t * 10 + i * 2) * 0.18 + Math.sin(t * 23 + i) * 0.1;
      f.scale.set(0.9 + (k - 1) * 0.5, 1.3 * k, 0.9);
    });
  });

  const floor = stoneMat("sandstone", 1, 1, 1);
  return (
    <group position={[0, 0, SCENE_Z.start]}>
      <instancedMesh ref={shafts} args={[cylGeo, reliefMat(2, 1, 3, 7), spots.length]} castShadow receiveShadow frustumCulled={false} />
      <instancedMesh ref={caps} args={[capGeo, mats.gold, spots.length]} castShadow frustumCulled={false} />
      <instancedMesh ref={bases} args={[cylGeo, floor, spots.length]} receiveShadow frustumCulled={false} />
      <instancedMesh ref={rings} args={[cylGeo, mats.turquoise, spots.length]} frustumCulled={false} />
      <mesh position={[0, 0.02, -26]} geometry={texBox(40, 0.1, 62, 0.16)} material={floor} receiveShadow />
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 17, 7, -24]} rotation={[0, -side * Math.PI / 2, 0]} material={wall}>
          <planeGeometry args={[60, 15]} />
        </mesh>
      ))}
      {TORCHES.map(([x, y, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 2, 0]} scale={[0.15, 4, 0.15]} material={mats.dark} geometry={texBox(1, 1, 1, 0.1)} />
          <mesh position={[0, y - 0.1, 0]} material={mats.gold}>
            <cylinderGeometry args={[0.28, 0.16, 0.3, 10]} />
          </mesh>
          <mesh ref={(el) => { flames.current[i] = el; }} position={[0, y + 0.55, 0]} material={mats.flame} geometry={flameGeo} />
        </group>
      ))}
      <Embers count={tier === "full" ? 80 : 28} positions={TORCHES} />
      <pointLight ref={torch1} position={[-6.2, 5, 6]} intensity={70} distance={30} color="#ff9a3c" />
      <pointLight ref={torch2} position={[6.2, 5, 6]} intensity={70} distance={30} color="#ff9a3c" />
    </group>
  );
}
