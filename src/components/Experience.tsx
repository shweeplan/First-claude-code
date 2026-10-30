"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { detectTier, type Tier } from "@/lib/env";
import { scrollState } from "@/lib/scroll";
import Loader from "./ui/Loader";

const World = dynamic(() => import("./canvas/World"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/** Owns smooth scroll, GSAP reveals, scene anchors, tier detection and the loader. */
export default function Experience({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<{ tier: Tier; reduced: boolean } | null>(null);
  const [progress, setProgress] = useState(0.05);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  const step = useCallback((to: number) => setProgress((p) => Math.max(p, to)), []);

  useEffect(() => {
    const m = detectTier();
    setMode(m);
    document.documentElement.dataset.motion = m.reduced || m.tier === "static" ? "reduced" : "full";
    step(0.2);
    document.fonts.ready.then(() => step(m.tier === "static" ? 1 : 0.5));
    if (m.tier === "static") setReady(true);
  }, [step]);

  // World calls this after its first rendered frame.
  const onFrame = useCallback(() => {
    step(1);
    setReady(true);
  }, [step]);

  // Scene anchors: normalised start/end of every chapter.
  useEffect(() => {
    if (!mode) return;
    const measure = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el) => {
        const top = el.offsetTop;
        scrollState.anchors[el.dataset.chapter!] = {
          start: Math.min(1, Math.max(0, (top - window.innerHeight * 0.6) / total)),
          end: Math.min(1, Math.max(0, (top + el.offsetHeight - window.innerHeight * 0.6) / total)),
        };
      });
      ScrollTrigger.refresh();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [mode]);

  // Smooth scroll + GSAP.
  useEffect(() => {
    if (!mode) return;
    const update = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollState.velocity = window.scrollY - scrollState.y;
      scrollState.y = window.scrollY;
      scrollState.progress = Math.min(1, Math.max(0, window.scrollY / total));
      if (bar.current) bar.current.style.transform = `scaleX(${scrollState.progress})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });

    if (mode.reduced) return () => window.removeEventListener("scroll", update);

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // hero is held hidden until the loader leaves
      gsap.set("[data-hero]", { opacity: 0, y: 40 });
      gsap.set("[data-hero-lines] .reveal-line > span", { yPercent: 110 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 48, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        gsap.from(el.querySelectorAll(".reveal-line > span"), {
          yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax) || -12, ease: "none",
          scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" },
        });
      });
    });

    // In-page links go through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -20 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", update);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [mode]);

  // hero entrance plays once the loader is gone
  useEffect(() => {
    if (!done || !mode || mode.reduced) return;
    gsap.to("[data-hero-lines] .reveal-line > span", { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.14 });
    gsap.to("[data-hero]", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.5 });
  }, [done, mode]);

  const canvasOn = mode && mode.tier !== "static";
  return (
    <>
      <div ref={bar} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gold" aria-hidden="true" />
      {canvasOn && <World tier={mode.tier} reduced={mode.reduced} started={ready} onFrame={onFrame} />}
      {mode?.tier === "static" && <div className="no-webgl-bg fixed inset-0 z-0" aria-hidden="true" />}
      {!done && <Loader progress={progress} ready={ready} reduced={!!mode?.reduced} onDone={() => setDone(true)} />}
      <div className="relative z-10">{children}</div>
    </>
  );
}
