"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease, clamp01, rng, useTier, useSceneFrame } from "../shared";
import { chapterProgress, scrollState } from "@/lib/scroll";

/** Active feature step of the Grow chapter: 0 emails, 1 WhatsApp, 2 comment-to-DM, 3 launches, 4 voice agent. */
const step = () => scrollState.steps["grow"] ?? -1;
const approach = (cur: number, target: number, k = 0.06) => cur + (target - cur) * k;

const FIELD_X = [-18, -9, 9, 18]; // matches the field slabs in GrowScene

/** Crops: instanced stalks that sprout on the banks once the flood has peaked. */
export function Crops() {
  const tier = useTier();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.1, 1, 5);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 }), []);
  const crops = useMemo(() => {
    const r = rng(91);
    const n = tier === "full" ? 240 : 90;
    return Array.from({ length: n }, () => ({
      x: FIELD_X[Math.floor(r() * 4)] + (r() - 0.5) * 6.4,
      z: -28 + r() * 40,
      h: 0.9 + r() * 1.1,
      d: 0.3 + r() * 0.4,
      lean: (r() - 0.5) * 0.3,
    }));
  }, [tier]);
  useLayoutEffect(() => {
    const palette = ["#5f8f3a", "#7aa83f", "#9db84a", "#c9b24a", "#4f7d36"].map((c) => new THREE.Color(c));
    const r = rng(7);
    crops.forEach((_, i) => mesh.current!.setColorAt(i, palette[Math.floor(r() * palette.length)]));
    mesh.current!.instanceColor!.needsUpdate = true;
  }, [crops]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  const lastP = useRef(-1);
  useSceneFrame(() => {
    const p = chapterProgress("grow");
    if (Math.abs(p - lastP.current) < 0.002) return; // growth only changes when scrolling
    lastP.current = p;
    crops.forEach((c, i) => {
      const t = ease(clamp01((p - c.d) / 0.25));
      dummy.position.set(c.x, 0.25, c.z);
      dummy.rotation.set(0, 0, c.lean);
      dummy.scale.set(1, Math.max(0.001, c.h * t), 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[geo, mat, crops.length]} frustumCulled={false} />;
}

/** White ibis-like birds circling the light column. The flock quickens on the email step. */
export function Birds() {
  const tier = useTier();
  const left = useRef<THREE.InstancedMesh>(null);
  const right = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const n = tier === "full" ? 14 : 6;
  const wing = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.35, 1.3, 0, -0.1, 0.1, 0, -0.45], 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f6efe0", roughness: 0.8, side: THREE.DoubleSide }), []);
  const flock = useMemo(() => {
    const r = rng(14);
    return Array.from({ length: n }, () => ({ R: 9 + r() * 12, y: 9 + r() * 7, sp: 0.18 + r() * 0.12, ph: r() * 6.28, fl: 7 + r() * 3 }));
  }, [n]);
  const speed = useRef(1);
  const phase = useRef(0);
  useEffect(() => () => { wing.dispose(); mat.dispose(); }, [wing, mat]);

  useSceneFrame((s, dt) => {
    speed.current = approach(speed.current, step() === 0 ? 2.2 : 1);
    phase.current += dt * speed.current;
    const t = phase.current;
    flock.forEach((b, i) => {
      const a = t * b.sp * 2 + b.ph;
      const x = Math.cos(a) * b.R, z = -6 + Math.sin(a) * b.R * 0.7;
      const heading = Math.atan2(-Math.sin(a) * b.R, Math.cos(a) * b.R * 0.7) ;
      const flap = Math.sin(s.clock.elapsedTime * b.fl + b.ph) * 0.7;
      dummy.position.set(x, b.y + Math.sin(a * 2) * 0.8, z);
      dummy.scale.set(0.7, 0.7, 0.7);
      dummy.rotation.set(0, heading, flap, "YXZ");
      dummy.updateMatrix();
      right.current!.setMatrixAt(i, dummy.matrix);
      dummy.scale.set(-0.7, 0.7, 0.7);
      dummy.rotation.set(0, heading, -flap, "YXZ");
      dummy.updateMatrix();
      left.current!.setMatrixAt(i, dummy.matrix);
    });
    left.current!.instanceMatrix.needsUpdate = true;
    right.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <instancedMesh ref={left} args={[wing, mat, n]} frustumCulled={false} />
      <instancedMesh ref={right} args={[wing, mat, n]} frustumCulled={false} />
    </>
  );
}

/** Rings that ripple out across the flood from the column base. Stronger on the WhatsApp and voice-agent steps. */
export function Rings() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const geo = useMemo(() => new THREE.RingGeometry(0.96, 1, 72), []);
  const mats = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) =>
        new THREE.MeshBasicMaterial({ color: i % 2 ? "#9fe8d8" : "#ffd88a", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide }),
      ),
    [],
  );
  const amp = useRef(0.25);
  useEffect(() => () => { geo.dispose(); mats.forEach((m) => m.dispose()); }, [geo, mats]);
  useSceneFrame((s) => {
    const st = step();
    amp.current = approach(amp.current, st === 1 || st === 4 ? 0.95 : 0.3);
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const u = (t / 4 + i / 2) % 1;
      m.scale.setScalar(1 + u * 34);
      mats[i].opacity = Math.pow(1 - u, 1.6) * amp.current;
    });
  });
  return (
    <>
      {mats.map((m, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} geometry={geo} material={m} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.75, -6]} />
      ))}
    </>
  );
}

/** Gold sparks thrown up from the column base like a launch. Strongest on the drops step. */
export function Sparks() {
  const tier = useTier();
  const count = tier === "full" ? 140 : 50;
  const { geo, mat } = useMemo(() => {
    const r = rng(52);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([0, 1, -6], i * 3);
      seed.set([r(), r(), r()], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uAmt: { value: 0.2 } },
      vertexShader: `
        attribute vec3 aSeed; uniform float uTime, uAmt; varying float vA;
        void main(){
          float t = fract(uTime*.35 + aSeed.x) * 2.4;
          float a = aSeed.y * 6.2832;
          float sp = (2. + aSeed.z * 6.) * (.4 + uAmt);
          vec3 p = position + vec3(cos(a)*sp*t*.5, (7. + aSeed.z*9.)*(.5 + uAmt*.7)*t - 4.*t*t, sin(a)*sp*t*.5);
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_PointSize = (1. - t/2.4) * (26. + 40.*uAmt) / -mv.z;
          vA = (1. - t/2.4) * (.25 + .75*uAmt);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord-.5); gl_FragColor = vec4(1., .82, .42, smoothstep(.5, 0., d) * vA); }`,
    });
    return { geo: g, mat: m };
  }, [count]);
  const amt = useRef(0.2);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useSceneFrame((s) => {
    amt.current = approach(amt.current, step() === 3 ? 1 : 0.2);
    mat.uniforms.uTime.value = s.clock.elapsedTime;
    mat.uniforms.uAmt.value = amt.current;
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}
