"use client";
import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";

/** Intro screen: sun disk rises over a pyramid while a real progress value fills. */
export default function Loader({ progress, ready, reduced, onDone }: { progress: number; ready: boolean; reduced: boolean; onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const start = useRef(0);

  useEffect(() => {
    start.current = performance.now();
  }, []);

  useEffect(() => {
    setShown((s) => Math.max(s, Math.round(progress * 100)));
  }, [progress]);

  useEffect(() => {
    if (!ready) return;
    // keep the intro up for at least 1.4s so it reads as a moment, not a flash
    const wait = reduced ? 0 : Math.max(0, 1400 - (performance.now() - start.current));
    const a = setTimeout(() => setLeaving(true), wait);
    const b = setTimeout(onDone, wait + 800);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready, reduced, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${shown} percent`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night text-papyrus transition-opacity duration-700 ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <svg viewBox="0 0 200 120" className="h-40 w-64" aria-hidden="true">
        <defs>
          <clipPath id="horizon"><rect x="0" y="0" width="200" height="96" /></clipPath>
        </defs>
        <g clipPath="url(#horizon)">
          <circle cx="100" cy={96 - shown * 0.7} r="26" fill="#ebc77e" style={{ transition: "cy .3s" }} />
        </g>
        <path d="M30 96L100 28l70 68z" fill="#5a3a22" />
        <path d="M100 28l70 68h-35z" fill="#3a2414" />
        <path d="M0 96h200" stroke="#c9973e" strokeWidth="2" />
      </svg>
      <Wordmark className="mt-4 text-6xl" light />
      <div className="mt-8 h-[3px] w-56 overflow-hidden rounded bg-brown/60">
        <div className="h-full bg-gold" style={{ width: `${shown}%`, transition: "width .3s" }} />
      </div>
      <p className="mt-3 font-display text-sm tracking-[0.3em] text-gold-light">{shown}%</p>
    </div>
  );
}
