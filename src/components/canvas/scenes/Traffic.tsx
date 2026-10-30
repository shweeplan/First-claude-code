"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mats, boxGeo, coneGeo, rng, useTier, SCENE_Z } from "../shared";
import { chapterProgress } from "@/lib/scroll";

const waterMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color("#1e5f7a") }, uB: { value: new THREE.Color("#7fd0c4") } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `
    varying vec2 vUv; uniform float uTime; uniform vec3 uA; uniform vec3 uB;
    void main(){
      float w = sin(vUv.y*60.-uTime*1.6 + sin(vUv.x*12.)*2.)*.5+.5;
      float edge = smoothstep(0.,.18,vUv.x)*smoothstep(1.,.82,vUv.x);
      vec3 c = mix(uA,uB,w*.45+.1);
      gl_FragColor = vec4(c, .92*edge+.05);
    }`,
  transparent: true,
});
export { waterMat };

/** River of visitors flowing to a sun-topped gate; boats stream toward it. */
export default function TrafficScene() {
  const tier = useTier();
  const boats = useRef<THREE.InstancedMesh>(null);
  const sails = useRef<THREE.InstancedMesh>(null);
  const visitors = useRef<THREE.InstancedMesh>(null);
  const beams = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nBoats = tier === "full" ? 10 : 5;
  const nVis = tier === "full" ? 90 : 30;
  const reeds = useMemo(() => {
    const r = rng(21);
    const n = tier === "full" ? 160 : 60;
    return Array.from({ length: n }, () => ({
      x: (r() > 0.5 ? 1 : -1) * (6 + r() * 4),
      z: 30 - r() * 80,
      h: 1.2 + r() * 1.6,
    }));
  }, [tier]);
  const reedRef = useRef<THREE.InstancedMesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    waterMat.uniforms.uTime.value = t;
    const p = chapterProgress("traffic");
    const speed = 0.04 + p * 0.05;
    if (boats.current && sails.current) {
      for (let i = 0; i < nBoats; i++) {
        const u = (i / nBoats + t * speed) % 1;
        const z = 30 - u * 80;
        const x = Math.sin(u * 8 + i) * 2.2 + (i % 3 - 1) * 1.6;
        dummy.position.set(x, 0.3, z);
        dummy.rotation.set(0, Math.PI, Math.sin(t + i) * 0.04);
        dummy.scale.set(1.2, 0.5, 3);
        dummy.updateMatrix();
        boats.current.setMatrixAt(i, dummy.matrix);
        dummy.position.set(x, 1.7, z);
        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.scale.set(2.2, 2.4, 0.08);
        dummy.updateMatrix();
        sails.current.setMatrixAt(i, dummy.matrix);
      }
      boats.current.instanceMatrix.needsUpdate = true;
      sails.current.instanceMatrix.needsUpdate = true;
    }
    if (visitors.current) {
      for (let i = 0; i < nVis; i++) {
        const u = (i / nVis + t * speed * 1.4) % 1;
        const z = 34 - u * 90;
        const lane = (i * 7919) % 13 / 13 - 0.5;
        dummy.position.set(lane * 9 + Math.sin(t * 0.8 + i) * 0.3, 0.7 + Math.sin(t * 2 + i) * 0.15, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(0.22 + u * 0.1);
        dummy.updateMatrix();
        visitors.current.setMatrixAt(i, dummy.matrix);
      }
      visitors.current.instanceMatrix.needsUpdate = true;
    }
    if (reedRef.current && reedRef.current.userData.done !== true) {
      reeds.forEach((r, i) => {
        dummy.position.set(r.x, r.h / 2, r.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.08, r.h, 0.08);
        dummy.updateMatrix();
        reedRef.current!.setMatrixAt(i, dummy.matrix);
      });
      reedRef.current.instanceMatrix.needsUpdate = true;
      reedRef.current.userData.done = true;
    }
    if (beams.current) beams.current.children.forEach((c, i) => (c.rotation.z = (i - 1.5) * (0.12 + p * 0.1)));
  });

  return (
    <group position={[0, 0, SCENE_Z.traffic]}>
      <mesh position={[0, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]} material={waterMat}>
        <planeGeometry args={[12, 100, 1, 1]} />
      </mesh>
      <instancedMesh ref={boats} args={[boxGeo, mats.sandDark, nBoats]} frustumCulled={false} />
      <instancedMesh ref={sails} args={[boxGeo, mats.linen, nBoats]} frustumCulled={false} />
      <instancedMesh ref={visitors} args={[new THREE.SphereGeometry(1, 8, 8), mats.glow, nVis]} frustumCulled={false} />
      <instancedMesh ref={reedRef} args={[coneGeo, mats.turquoise, reeds.length]} frustumCulled={false} />
      {/* gate */}
      <group position={[0, 0, -42]}>
        {[-7, 7].map((x) => (
          <mesh key={x} position={[x, 7, 0]} scale={[4, 14, 4]} material={mats.sandstone} geometry={boxGeo} />
        ))}
        <mesh position={[0, 13.5, 0]} scale={[18, 2, 4.4]} material={mats.sandstone} geometry={boxGeo} />
        <mesh position={[0, 17, 0]} material={mats.glow}>
          <circleGeometry args={[2.6, 40]} />
        </mesh>
        <mesh position={[0, 14.6, 0]} scale={[10, 0.35, 4.6]} material={mats.lapis} geometry={boxGeo} />
        <group ref={beams} position={[0, 17, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, -14, 8]} material={mats.beam}>
              <coneGeometry args={[4, 30, 16, 1, true]} />
            </mesh>
          ))}
        </group>
      </group>
      <pointLight position={[0, 14, -34]} intensity={140} distance={60} color="#ffcf8a" />
    </group>
  );
}
