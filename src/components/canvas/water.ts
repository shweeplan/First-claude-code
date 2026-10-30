import * as THREE from "three";
import { skyState } from "./shared";

type Opts = { deep: string; shallow: string; flood?: boolean };

/** Nile water: depth tint, fresnel sky reflection, ripple normals, sun glitter and bank foam. */
export function createWaterMat({ deep, shallow, flood = false }: Opts) {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(deep) },
      uShallow: { value: new THREE.Color(shallow) },
      uSky: { value: new THREE.Color() },
      uSunAmt: { value: 1 },
      uSunDir: { value: new THREE.Vector3(0.4, 0.2, -0.9) },
      uFlood: { value: flood ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv; varying vec3 vWorld;
      void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.); vWorld = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vWorld;
      uniform float uTime, uSunAmt, uFlood; uniform vec3 uDeep, uShallow, uSky, uSunDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      void main(){
        vec2 p = vWorld.xz;
        float n1 = noise(p*.35 + vec2(0.,-uTime*.45));
        float n2 = noise(p*1.3 + vec2(uTime*.3,-uTime*.7));
        float n3 = uFlood > .5 ? .5 : noise(p*3.1 + vec2(-uTime*.5, uTime*.4));
        vec3 N = normalize(vec3((n1-.5)*.3+(n2-.5)*.2+(n3-.5)*.12, 1., (noise(p*.4+9.)-.5)*.3+(n3-.5)*.12));
        vec3 V = normalize(cameraPosition - vWorld);
        float fres = pow(1.-max(dot(N,V),0.), 3.)*.8 + .08;
        float mid = abs(vUv.x-.5)*2.;
        vec3 depthCol = mix(uDeep, uShallow, smoothstep(.15, 1., mid));
        vec3 col = mix(depthCol, uSky, fres);
        vec3 H = normalize(normalize(uSunDir)+V);
        col += vec3(1.,.88,.65) * pow(max(dot(N,H),0.), 160.) * 4. * uSunAmt;
        float edge = mix(smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x), 1., uFlood);
        float foam = (1.-smoothstep(0.,.06, min(vUv.x,1.-vUv.x))) * (n2*.7+.3) * (1.-uFlood);
        col = mix(col, vec3(.96,.94,.88), foam*.7);
        gl_FragColor = vec4(col, (.95*edge + .03));
      }`,
  });
}

export function updateWater(m: THREE.ShaderMaterial, t: number) {
  m.uniforms.uTime.value = t;
  m.uniforms.uSky.value.copy(skyState.horizon);
  m.uniforms.uSunAmt.value = skyState.sunAmt;
  (m.uniforms.uSunDir.value as THREE.Vector3).set(0.4, skyState.sunY, -0.9);
}
