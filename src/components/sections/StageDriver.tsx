"use client";
import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/scroll";

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

    // Cached page metrics: reading layout on every scroll event is what makes fast scrolling stutter.
    let top = 0;
    let total = 1;
    const measure = () => {
      top = section.getBoundingClientRect().top + window.scrollY;
      total = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    const update = () => {
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / total));
      const inIntro = p < INTRO_END;
      const phase = inIntro ? "intro" : "items";
      if (section.dataset.phase !== phase) section.dataset.phase = phase;
      const idx = inIntro ? -1 : Math.min(n - 1, Math.floor(((p - INTRO_END) / (1 - INTRO_END)) * n));
      scrollState.steps[section.id] = idx;
      items.forEach((el, i) => {
        const state = i === idx ? "active" : i < idx ? "past" : "future";
        if (el.dataset.state === state) return;
        el.dataset.state = state;
        if (state === "active") el.removeAttribute("inert");
        else el.setAttribute("inert", "");
      });
      ticks.forEach((t, i) => {
        const v = i === idx ? "true" : i < idx ? "done" : "false";
        if (t.dataset.on !== v) t.dataset.on = v;
      });
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
        measure();
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", onResize);
      } else {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", onResize);
        reset();
      }
    };
    const onResize = () => {
      measure();
      update();
    };
    // layout shifts (fonts, motion mode) change section positions
    const ro = new ResizeObserver(() => on && onResize());
    ro.observe(document.body);
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      reset();
    };
  }, []);

  return <span ref={marker} hidden />;
}
