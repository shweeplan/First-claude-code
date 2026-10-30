"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { TierContext, SCENE_Z, type SceneId } from "./shared";
import { scrollState } from "@/lib/scroll";
import type { Tier } from "@/lib/env";
import HeroScene, { Dunes } from "./scenes/Hero";
import BuildScene from "./scenes/Build";
import TrafficScene from "./scenes/Traffic";
import SellScene from "./scenes/Sell";
import GrowScene from "./scenes/Grow";
import ReportsScene from "./scenes/Reports";
import HallScene from "./scenes/Hall";

const ORDER: SceneId[] = ["hero", "build", "traffic", "sell", "grow", "reports", "start"];
const ANCHOR_KEY: Record<SceneId, string> = {
  hero: "hero", build: "build", traffic: "traffic", sell: "sell", grow: "grow", reports: "reports", start: "start",
};
/** Sky colour per scene: dawn, day, gold afternoon, dusk, river sunset, night. */
const SKY = ["#f1c58f", "#f3dcae", "#e9cf9e", "#e8b98a", "#c98d6d", "#7d5a63", "#120b07"].map((c) => new THREE.Color(c));

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
    return { pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"), look: new THREE.CatmullRomCurve3(look, false, "centripetal"), n: pos.length };
  }, []);
}

function Rig({ reduced, onNear, onFrame }: { reduced: boolean; onNear: (near: Set<SceneId>) => void; onFrame: () => void }) {
  const rail = useRail();
  const { camera, scene, invalidate } = useThree();
  const cur = useRef({ t: 0 });
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpL = useMemo(() => new THREE.Vector3(), []);
  const bg = useMemo(() => new THREE.Color(), []);
  const lastKey = useRef("");
  const firstFrame = useRef(true);

  // Map page progress -> rail parameter using each chapter's DOM anchors (enter/leave keyframes).
  const targetT = () => {
    const pts: number[] = [];
    ORDER.forEach((id) => {
      const a = scrollState.anchors[ANCHOR_KEY[id]];
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

  useFrame((_, dt) => {
    if (firstFrame.current) {
      firstFrame.current = false;
      onFrame();
    }
    const goal = reduced ? 0 : targetT();
    cur.current.t += (goal - cur.current.t) * Math.min(1, dt * 5);
    const t = Math.min(0.9999, Math.max(0, cur.current.t));
    rail.pos.getPoint(t, tmpP);
    rail.look.getPoint(t, tmpL);
    // cursor parallax
    tmpP.x += scrollState.pointer.x * 1.2;
    tmpP.y += scrollState.pointer.y * 0.6;
    camera.position.copy(tmpP);
    camera.lookAt(tmpL);

    // sky + fog follow the nearest scene
    const f = t * (ORDER.length - 1);
    const i = Math.min(ORDER.length - 2, Math.floor(f));
    bg.copy(SKY[i]).lerp(SKY[i + 1], f - i);
    (scene.background as THREE.Color).copy(bg);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg);

    // which scenes are near enough to mount
    const near = new Set<SceneId>();
    ORDER.forEach((id) => {
      if (Math.abs(camera.position.z - SCENE_Z[id]) < 85) near.add(id);
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

function Lights() {
  return (
    <>
      <hemisphereLight args={["#ffe9c4", "#8a6a45", 0.9]} />
      <directionalLight position={[-20, 30, 20]} intensity={2.2} color="#ffd9a0" />
    </>
  );
}

export default function World({ tier, reduced, onFrame }: { tier: Tier; reduced: boolean; onFrame: () => void }) {
  const [near, setNear] = useState<Set<SceneId>>(new Set(["hero", "build"]));
  const full = tier === "full" && !reduced;

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
        frameloop={reduced ? "demand" : "always"}
        dpr={full ? [1, 1.5] : [1, 1]}
        camera={{ fov: 52, near: 0.5, far: 260, position: [-5, 4.5, 22] }}
        gl={{ antialias: full, powerPreference: "high-performance", alpha: false }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color("#f1c58f");
          scene.fog = new THREE.Fog("#f1c58f", 40, 190);
        }}
      >
        <TierContext.Provider value={tier}>
          <Suspense fallback={null}>
            <Lights />
            <Rig reduced={reduced} onNear={setNear} onFrame={onFrame} />
            <Dunes />
            {show("hero") && <HeroScene />}
            {!reduced && show("build") && <BuildScene />}
            {!reduced && show("traffic") && <TrafficScene />}
            {!reduced && show("sell") && <SellScene />}
            {!reduced && show("grow") && <GrowScene />}
            {!reduced && show("reports") && <ReportsScene />}
            {!reduced && show("start") && <HallScene />}
            {full && (
              <EffectComposer multisampling={0}>
                <Bloom intensity={0.7} luminanceThreshold={0.9} mipmapBlur />
                <Vignette eskil={false} offset={0.25} darkness={0.55} />
                <Noise opacity={0.04} />
              </EffectComposer>
            )}
          </Suspense>
        </TierContext.Provider>
      </Canvas>
    </div>
  );
}
