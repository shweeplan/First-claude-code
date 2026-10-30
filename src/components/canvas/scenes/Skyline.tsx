"use client";
import { useTier } from "../shared";
import { PyramidMesh } from "../Props";

/** Far pyramids along both sides of the whole journey. Always mounted, so nothing pops in or out. */
const FAR: { x: number; z: number; s: number }[] = [
  { x: -60, z: -120, s: 62 }, { x: 74, z: -150, s: 50 }, { x: 110, z: -60, s: 36 },
  { x: -88, z: -260, s: 54 }, { x: 66, z: -310, s: 58 }, { x: -70, z: -390, s: 46 },
];

export default function Skyline() {
  const tier = useTier();
  const list = tier === "full" ? FAR : FAR.slice(0, 4);
  return (
    <>
      {list.map((f, i) => (
        <PyramidMesh key={i} s={f.s} steps={tier === "full" ? 22 : 12} position={[f.x, -0.4, f.z]} rotation={[0, i * 0.2, 0]} />
      ))}
    </>
  );
}
