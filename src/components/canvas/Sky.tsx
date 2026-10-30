"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { skyState, useTier } from "./shared";

/** Gradient sky dome with a sun glow and drifting clouds. Follows the camera so it never gets closer. */
export default function Sky() {
  const tier = useTier();
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        uniforms: {
          uHorizon: { value: new THREE.Color() },
          uZenith: { value: new THREE.Color() },
          uSun: { value: new THREE.Vector3(0.4, 0.2, -0.9).normalize() },
          uSunAmt: { value: 1 },
          uTime: { value: 0 },
          uClouds: { value: tier === "full" ? 1 : 0 },
        },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: /* glsl */ `
          varying vec3 vDir;
          uniform vec3 uHorizon, uZenith, uSun; uniform float uSunAmt, uTime, uClouds;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
          float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise(p); p*=2.03; a*=.5; } return s; }
          void main(){
            vec3 d = normalize(vDir);
            float h = clamp(d.y, 0., 1.);
            vec3 col = mix(uHorizon, uZenith, pow(h, .55));
            float sd = max(dot(d, normalize(uSun)), 0.);
            vec3 sunCol = mix(vec3(1.,.62,.3), vec3(1.,.9,.7), smoothstep(0., .5, uSun.y*2.));
            col += sunCol * (pow(sd, 900.)*14. + pow(sd, 60.)*.55 + pow(sd, 6.)*.22) * uSunAmt;
            if (uClouds > .5 && d.y > 0.) {
              vec2 p = d.xz / (d.y + .12) * 1.6 + vec2(uTime*.008, 0.);
              float c = smoothstep(.5, .85, fbm(p));
              float edge = smoothstep(0., .3, h);
              vec3 cc = mix(uHorizon*1.15, vec3(1.), .55) ;
              cc += sunCol * pow(sd, 8.) * .5 * uSunAmt;
              col = mix(col, cc, c * edge * .85);
            }
            // stars once the sky is dark
            float night = (1. - smoothstep(.05, .35, dot(uZenith, vec3(.299,.587,.114)))) * (1. - uSunAmt);
            if (d.y > 0. && night > 0.) {
              vec3 q = floor(d * 170.);
              float r = hash(q.xy + q.z * 17.);
              col += vec3(.9,.92,1.) * step(.9968, r) * smoothstep(0., .25, d.y) * night * (.55 + .45 * sin(uTime * 2. + r * 60.));
            }
            // keep the horizon band continuous with the ground fog
            col = mix(uHorizon, col, smoothstep(-.02, .08, d.y));
            gl_FragColor = vec4(col, 1.);
          }`,
      }),
    [tier],
  );

  useFrame(({ camera, clock }) => {
    mat.uniforms.uHorizon.value.copy(skyState.horizon);
    mat.uniforms.uZenith.value.copy(skyState.zenith);
    mat.uniforms.uSunAmt.value = skyState.sunAmt;
    (mat.uniforms.uSun.value as THREE.Vector3).set(0.4, skyState.sunY, -0.9).normalize();
    mat.uniforms.uTime.value = clock.elapsedTime;
    mesh.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={mesh} material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[220, 32, 16]} />
    </mesh>
  );
}

