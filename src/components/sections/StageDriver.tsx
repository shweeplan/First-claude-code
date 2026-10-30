"use client";
import { useEffect, useRef } from "react";

const INTRO_END = 0.14;

/**
 * Drives one pinned chapter: maps scroll position inside the section to a phase (intro/items)
 * and the active step. Writes data attributes straight to the DOM, so scrolling causes no React renders.
 */
export default function StageDriver() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest<HTMLElement>("[data-stage]");
    if (!section) return;
    const html = document.documentElement;
    const items = Array.from(section.querySelectorAll<HTMLElement>(".stage-item"));
    const ticks = Array.from(section.querySelectorAll<HTMLElement>(".stage-tick"));
    const n = items.length;

    const update = () => {
      const total = Math.max(1, section.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
      const inIntro = p < INTRO_END;
      section.dataset.phase = inIntro ? "intro" : "items";
      const idx = inIntro ? -1 : Math.min(n - 1, Math.floor(((p - INTRO_END) / (1 - INTRO_END)) * n));
      items.forEach((el, i) => {
        const state = i === idx ? "active" : i < idx ? "past" : "future";
        if (el.dataset.state === state) return;
        el.dataset.state = state;
        if (state === "active") el.removeAttribute("inert");
        else el.setAttribute("inert", "");
      });
      ticks.forEach((t, i) => (t.dataset.on = i === idx ? "true" : i < idx ? "done" : "false"));
    };

    const reset = () => {
      delete section.dataset.phase;
      items.forEach((el) => {
        delete el.dataset.state;
        el.removeAttribute("inert");
      });
    };

    let on = false;
    const sync = () => {
      const want = html.dataset.motion === "full";
      if (want === on) return;
      on = want;
      if (on) {
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
      } else {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
        reset();
      }
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reset();
    };
  }, []);

  return <span ref={marker} hidden />;
}
