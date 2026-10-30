"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mats, sandMat, texBox, stoneMat, rng, useTier, SCENE_Z, useSceneFrame } from "../shared";
import { scrollState } from "@/lib/scroll";
import { Obelisk, Palms, PyramidMesh } from "../Props";

export { Obelisk };

/** Dune height field. The centre strip stays flat so temples sit cleanly. */
function heightAt(x: number, z: number) {
  const edge = Math.min(1, Math.max(0, (Math.abs(x) - 14) / 30));
  return (Math.sin(x * 0.07 + z * 0.03) * 4 + Math.sin(x * 0.19 - z * 0.11) * 1.4 + Math.sin(z * 0.045) * 2 + Math.sin(x * 0.4 + z * 0.25) * 0.25) * edge;
}

const SUN_DIR = new THREE.Vector3(0.4, 0.3, -0.9).normalize();

/** Rippled dune ground with baked sun shading, plus scattered rocks. */
export function Dunes() {
  const tier = useTier();
  const geo = useMemo(() => {
    const w = 260, l = 560;
    const sx = tier === "full" ? 130 : 50, sz = tier === "full" ? 280 : 110;
    const g = new THREE.PlaneGeometry(w, l, sx, sz);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setY(i, heightAt(p.getX(i), p.getZ(i) - 210) - 0.05);
    g.computeVertexNormals();
    // bake sun-facing light into vertex colours: warm on lit faces, cool and dark on lee sides
    const n = g.attributes.normal as THREE.BufferAttribute;
    const col = new Float32Array(p.count * 3);
    const lit = new THREE.Color("#fff3da"), shade = new THREE.Color("#a98a78"), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const d = n.getX(i) * SUN_DIR.x + n.getY(i) * SUN_DIR.y + n.getZ(i) * SUN_DIR.z;
      c.copy(shade).lerp(lit, Math.min(1, Math.max(0, d * 1.6 + 0.2)));
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.translate(0, 0, -210);
    return g;
  }, [tier]);

  const rocks = useRef<THREE.InstancedMesh>(null);
  const nRocks = tier === "full" ? 140 : 40;
  const rockGeo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  useLayoutEffect(() => {
    const r = rng(8);
    const d = new THREE.Object3D();
    for (let i = 0; i < nRocks; i++) {
      const side = r() > 0.5 ? 1 : -1;
      const x = side * (9 + r() * 55), z = 20 - r() * 440;
      d.position.set(x, heightAt(x, z) + 0.1, z);
      d.rotation.set(r() * 3, r() * 3, r() * 3);
      d.scale.set(0.5 + r() * 1.6, 0.4 + r() * 1.0, 0.5 + r() * 1.4);
      d.updateMatrix();
      rocks.current!.setMatrixAt(i, d.matrix);
    }
    rocks.current!.instanceMatrix.needsUpdate = true;
  }, [nRocks]);

  return (
    <>
      <mesh geometry={geo} material={sandMat(40, 120)} receiveShadow />
      <instancedMesh ref={rocks} args={[rockGeo, mats.sandDark, nRocks]} castShadow receiveShadow frustumCulled={false} />
    </>
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
  useSceneFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
export { Dust };

const PALMS: [number, number, number][] = [
  [-22, 0, -16], [-25, 0, -12], [-20, 0, -9], [27, 0, -22], [24, 0, -26],
];

export default function HeroScene() {
  const tier = useTier();
  const obe = useRef<THREE.Group>(null);
  useSceneFrame((s) => {
    const t = s.clock.elapsedTime;
    if (obe.current) {
      const rise = Math.min(1, t / 3.2); // rises from the dunes on load
      obe.current.position.y = -18 * Math.pow(1 - rise, 3);
      obe.current.rotation.y = scrollState.pointer.x * 0.1;
    }
  });
  return (
    <group position={[0, 0, SCENE_Z.hero]}>
      <group ref={obe} position={[12, 0, -18]}>
        <Obelisk h={16} w={1.5} />
      </group>
      {/* temple forecourt block and low wall in front of the obelisk */}
      <mesh position={[12, 0.35, -9]} geometry={texBox(16, 0.7, 4, 0.2)} material={stoneMat("sandstone", 1, 1, 1.5)} receiveShadow castShadow />
      <PyramidMesh s={20} steps={tier === "full" ? 18 : 10} position={[-38, -0.2, -40]} rotation={[0, 0.3, 0]} />
      <PyramidMesh s={16} steps={tier === "full" ? 16 : 10} position={[44, -0.2, -52]} rotation={[0, 0.1, 0]} />
      <Palms spots={PALMS} />
      <Dust count={tier === "full" ? 1400 : 380} z0={20} z1={-440} />
    </group>
  );
}
