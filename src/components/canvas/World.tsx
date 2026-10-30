"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ActiveContext, TierContext, SCENE_Z, skyState, quality, type SceneId } from "./shared";
import { scrollState } from "@/lib/scroll";
import type { Tier } from "@/lib/env";
import Sky from "./Sky";
import { RIGS } from "./lights";
import HeroScene, { Dunes } from "./scenes/Hero";
import Skyline from "./scenes/Skyline";
import BuildScene from "./scenes/Build";
import TrafficScene from "./scenes/Traffic";
import SellScene from "./scenes/Sell";
import GrowScene from "./scenes/Grow";
import ReportsScene from "./scenes/Reports";
import HallScene from "./scenes/Hall";
import WhoScene from "./scenes/Who";

let introStartMs: number | null = null;

const ORDER: SceneId[] = ["hero", "build", "traffic", "sell", "grow", "reports", "who", "start"];

/** Per scene: horizon colour, zenith colour, sun strength, sun height. Dawn, day, gold noon, blue hour, sunset, afterglow, dusk, night. */
const SKY = [
  ["#f4b98a", "#5f86c4", 1, 0.16],
  ["#f3dcae", "#4f86cf", 0.9, 0.42],
  ["#efd8a6", "#4a7fc4", 0.9, 0.5],
  ["#c98f7a", "#1f2f66", 0.35, 0.08],
  ["#f08a5a", "#3b4080", 1, 0.06],
  ["#b46a6a", "#2b2552", 0.4, 0.03],
  ["#6a4a63", "#17143a", 0.1, 0.0],
  ["#1b120d", "#070510", 0, -0.2],
].map(([h, z, a, y]) => ({ h: new THREE.Color(h as string), z: new THREE.Color(z as string), a: a as number, y: y as number }));

/** Camera flies down a spline: two keyframes (enter/leave) per scene. */
function useRail() {
  return useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const look: THREE.Vector3[] = [];
    ORDER.forEach((id, i) => {
      const z = SCENE_Z[id];
      const sway = i % 2 ? 5 : -5;
      const lift = id === "start" ? 6 : id === "reports" ? 7 : 4.5;
      pos.push(new THREE.Vector3(sway, lift, z + 22), new THREE.Vector3(-sway * 0.6, lift + 1, z + 9));
      look.push(new THREE.Vector3(0, lift * 0.8, z - 6), new THREE.Vector3(0, lift * 0.9, z - 14));
    });
    return { pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"), look: new THREE.CatmullRomCurve3(look, false, "centripetal") };
  }, []);
}

function Rig({ reduced, started, onNear, onFrame }: { reduced: boolean; started: boolean; onNear: (near: Set<SceneId>) => void; onFrame: () => void }) {
  const rail = useRail();
  const { camera, scene, invalidate } = useThree();
  const cur = useRef({ t: 0 });
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpL = useMemo(() => new THREE.Vector3(), []);
  const lastKey = useRef("");
  const reported = useRef(false);

  // Map page progress -> rail parameter using each chapter's DOM anchors (enter/leave keyframes).
  const targetT = () => {
    const pts: number[] = [];
    ORDER.forEach((id) => {
      const a = scrollState.anchors[id];
      pts.push(a ? a.start : 0, a ? a.end : 1);
    });
    pts[0] = 0;
    pts[pts.length - 1] = 1;
    const p = scrollState.progress;
    for (let i = 0; i < pts.length - 1; i++) {
      if (p <= pts[i + 1] || i === pts.length - 2) {
        const span = Math.max(1e-5, pts[i + 1] - pts[i]);
        const f = Math.min(1, Math.max(0, (p - pts[i]) / span));
        return (i + f) / (pts.length - 1);
      }
    }
    return 1;
  };

  useFrame(({ clock }, dt) => {
    if (started && introStartMs === null) introStartMs = performance.now();
    // Every scene is visible for the first 1.4s so shaders and textures compile behind the loader, not mid-scroll.
    const warm = clock.elapsedTime < 1.4;
    if (!warm && !reported.current) {
      reported.current = true;
      onFrame();
    }
    const goal = reduced ? 0 : targetT();
    cur.current.t += (goal - cur.current.t) * Math.min(1, dt * 5);
    const t = Math.min(0.9999, Math.max(0, cur.current.t));
    rail.pos.getPoint(t, tmpP);
    rail.look.getPoint(t, tmpL);
    // opening dolly: pull in from far and low once the loader leaves
    const k = reduced ? 1 : introStartMs === null ? 0 : Math.min(1, (performance.now() - introStartMs) / 4000);
    const intro = Math.pow(1 - k, 3);
    tmpP.z += intro * 28;
    tmpP.y -= intro * 2.5;
    // cursor parallax
    tmpP.x += scrollState.pointer.x * 1.2;
    tmpP.y += scrollState.pointer.y * 0.6;
    camera.position.copy(tmpP);
    camera.lookAt(tmpL);

    // scroll speed widens the lens a little, so fast scrolling feels like flying
    const cam = camera as THREE.PerspectiveCamera;
    scrollState.velocity *= 0.92;
    const fov = 52 + Math.min(9, Math.abs(scrollState.velocity) * 0.06);
    if (Math.abs(cam.fov - fov) > 0.02) {
      cam.fov += (fov - cam.fov) * 0.12;
      cam.updateProjectionMatrix();
    }

    // sky, fog and sun follow the journey
    const f = t * (ORDER.length - 1);
    const i = Math.min(ORDER.length - 2, Math.floor(f));
    const m = f - i;
    skyState.horizon.copy(SKY[i].h).lerp(SKY[i + 1].h, m);
    skyState.zenith.copy(SKY[i].z).lerp(SKY[i + 1].z, m);
    skyState.sunAmt = SKY[i].a + (SKY[i + 1].a - SKY[i].a) * m;
    skyState.sunY = SKY[i].y + (SKY[i + 1].y - SKY[i].y) * m;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(skyState.horizon);

    // which scenes are near enough to mount
    const near = new Set<SceneId>();
    ORDER.forEach((id) => {
      if (warm || Math.abs(camera.position.z - SCENE_Z[id]) < 100) near.add(id);
    });
    const key = [...near].join(",");
    if (key !== lastKey.current) {
      lastKey.current = key;
      onNear(near);
    }
    if (reduced) invalidate();
  });
  return null;
}

/** Keeps a scene mounted but hidden and idle when the camera is far away. */
function Scene({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <ActiveContext.Provider value={active}>
      <group visible={active}>{children}</group>
    </ActiveContext.Provider>
  );
}

/** Watches frame time. If the machine cannot hold ~40fps twice in a row: full drops to lite, lite drops its resolution. */
function Adaptive({ onSlow }: { onSlow: () => void }) {
  const a = useRef({ warm: 0, t: 0, n: 0, strikes: 0 });
  useFrame((_, dt) => {
    const s = a.current;
    s.warm += dt;
    if (s.warm < 3 || dt > 1) return; // skip warm-up and real stalls only; a slow machine must still count
    s.t += dt;
    s.n++;
    if (s.t >= 2) {
      const fps = s.n / s.t;
      s.t = 0;
      s.n = 0;
      s.strikes = fps < 40 ? s.strikes + 1 : 0;
      if (s.strikes >= 2) onSlow();
    }
  });
  return null;
}

/** The fixed pool of 3 point lights, glued to whichever scene the camera is nearest. */
function LightPool() {
  const refs = [useRef<THREE.PointLight>(null), useRef<THREE.PointLight>(null), useRef<THREE.PointLight>(null)];
  const target = useMemo(() => new THREE.Vector3(), []);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame(({ camera, clock }) => {
    let best: SceneId = "hero";
    let bd = Infinity;
    for (const id of ORDER) {
      const d = Math.abs(camera.position.z - SCENE_Z[id]);
      if (d < bd) { bd = d; best = id; }
    }
    const rig = RIGS[best];
    const t = clock.elapsedTime;
    refs.forEach((ref, k) => {
      const l = ref.current;
      if (!l) return;
      const slot = rig[k];
      if (slot) {
        target.set(...slot.p);
        if (best === "hero" && k === 0) target.set(scrollState.pointer.x * 10, 6 + scrollState.pointer.y * 4, 6);
        const flick = slot.flicker ? 1 + Math.sin(t * 9 + k * 2) * 0.1 + Math.sin(t * 17 + k) * 0.06 : 1;
        l.position.lerp(target, 0.08);
        l.intensity += (slot.i * flick - l.intensity) * 0.08;
        l.distance += (slot.d - l.distance) * 0.08;
        l.color.lerp(color.set(slot.c), 0.08);
      } else {
        l.intensity += (0 - l.intensity) * 0.08;
      }
    });
  });
  return <>{refs.map((r, i) => <pointLight key={i} ref={r} intensity={0} distance={40} />)}</>;
}

/** `?debug` overlay: fps, draw calls, triangles, textures, shader programs. Screenshot it and send it over. */
function DebugStats({ tier, active }: { tier: string; active: string }) {
  const { gl, scene } = useThree();
  const el = useRef<HTMLDivElement | null>(null);
  const acc = useRef({ t: 0, n: 0 });
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const d = document.createElement("div");
    d.style.cssText = "position:fixed;left:8px;bottom:60px;z-index:9999;font:12px/1.4 monospace;color:#0f0;background:rgba(0,0,0,.75);padding:6px 8px;border-radius:6px;white-space:pre;pointer-events:none";
    document.body.appendChild(d);
    el.current = d;
    return () => d.remove();
  }, []);
  useFrame((_, dt) => {
    const a = acc.current;
    a.t += dt;
    a.n++;
    if (a.t < 0.5 || !el.current) return;
    let lights = 0;
    scene.traverseVisible((o) => { if ((o as THREE.Light).isLight) lights++; });
    const i = gl.info;
    el.current.textContent =
      `fps ${(a.n / a.t).toFixed(0)}  tier ${tier}\n` +
      `calls ${i.render.calls}  tris ${(i.render.triangles / 1000).toFixed(0)}k\n` +
      `geo ${i.memory.geometries}  tex ${i.memory.textures}  prog ${i.programs?.length ?? "?"}\n` +
      `lights ${lights}  active ${activeRef.current}`;
    a.t = 0;
    a.n = 0;
  });
  return null;
}

/** Hemisphere fill plus a low sun that casts shadows (desktop tier only) and tracks the camera. */
function Lights({ shadows }: { shadows: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const l = sun.current;
    if (!l) return;
    const dir = new THREE.Vector3(0.4, Math.max(0.12, skyState.sunY + 0.25), -0.9).normalize();
    l.position.set(camera.position.x - dir.x * 70, camera.position.y + 35 + skyState.sunY * 40, camera.position.z - dir.z * 70);
    target.position.set(camera.position.x, 0, camera.position.z - 30);
    l.target = target;
    l.intensity = 0.5 + 2.6 * skyState.sunAmt;
    l.color.copy(skyState.horizon).lerp(new THREE.Color("#fff1d6"), 0.5);
    if (hemi.current) {
      hemi.current.intensity = 0.45 + 0.6 * skyState.sunAmt;
      hemi.current.color.copy(skyState.zenith).lerp(new THREE.Color("#ffffff"), 0.35);
      hemi.current.groundColor.copy(skyState.horizon).multiplyScalar(0.55);
    }
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#cfe0ff", "#8a6a45", 0.9]} />
      <primitive object={target} />
      <directionalLight
        ref={sun}
        castShadow={shadows}
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0004}
        shadow-normalBias={0.4}
      />
    </>
  );
}

export default function World({ tier: tierIn, reduced, started, onFrame }: { tier: Tier; reduced: boolean; started: boolean; onFrame: () => void }) {
  const [near, setNear] = useState<Set<SceneId>>(new Set(ORDER));
  const [slow, setSlow] = useState(false);
  const [lowRes, setLowRes] = useState(false);
  const [debug] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug"));
  const tier: Tier = slow ? "lite" : tierIn;
  const full = tier === "full" && !reduced;
  quality.bump = full; // read by materials created while scenes render

  // Cursor position for parallax / reactive light.
  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      scrollState.pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);

  const show = (id: SceneId) => near.has(id);
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        key={tier}
        shadows={full}
        frameloop={reduced ? "demand" : "always"}
        dpr={lowRes ? 0.6 : full ? [1, 1.5] : 1}
        camera={{ fov: 52, near: 0.5, far: 400, position: [-5, 4.5, 22] }}
        gl={{ antialias: !full, powerPreference: "high-performance", alpha: false }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color("#f4b98a");
          scene.fog = new THREE.Fog("#f4b98a", 50, 230);
        }}
      >
        <TierContext.Provider value={tier}>
          <Suspense fallback={null}>
            <Sky />
            <Lights shadows={full} />
            <LightPool />
            {debug && <DebugStats tier={tier + (lowRes ? "/lowres" : "")} active={[...near].join(",")} />}
            {!reduced && !lowRes && <Adaptive key={tier} onSlow={() => (tier === "full" ? setSlow(true) : setLowRes(true))} />}
            <Rig reduced={reduced} started={started} onNear={setNear} onFrame={onFrame} />
            <Dunes />
            <Skyline />
            <Scene active={show("hero")}><HeroScene /></Scene>
            {!reduced && <Scene active={show("build")}><BuildScene /></Scene>}
            {!reduced && <Scene active={show("traffic")}><TrafficScene /></Scene>}
            {!reduced && <Scene active={show("sell")}><SellScene /></Scene>}
            {!reduced && <Scene active={show("grow")}><GrowScene /></Scene>}
            {!reduced && <Scene active={show("reports")}><ReportsScene /></Scene>}
            {!reduced && <Scene active={show("who")}><WhoScene /></Scene>}
            {!reduced && <Scene active={show("start")}><HallScene /></Scene>}
            {full && (
              <EffectComposer multisampling={2}>
                <Bloom intensity={0.5} luminanceThreshold={1.05} mipmapBlur />
                <Vignette eskil={false} offset={0.25} darkness={0.5} />
                <Noise opacity={0.035} />
              </EffectComposer>
            )}
          </Suspense>
        </TierContext.Provider>
      </Canvas>
    </div>
  );
}
