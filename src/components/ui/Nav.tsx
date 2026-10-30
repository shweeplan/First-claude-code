"use client";
import { useEffect, useState } from "react";
import { chapters } from "@/config/site";
import MagneticButton from "./MagneticButton";
import Wordmark from "./Wordmark";
import ChapterNumeral from "./ChapterNumeral";

/** Sticky chapter nav (side on desktop, bottom strip on mobile) plus a persistent CTA. */
export default function Nav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-chapter]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.chapter!)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-papyrus/80 px-5 py-3 backdrop-blur lg:bg-transparent lg:px-8 lg:py-4 lg:backdrop-blur-none">
        <a href="#hero" aria-label="SHWY Studio, back to top" className="rounded-full bg-papyrus/80 px-4 py-1 backdrop-blur">
          <Wordmark className="text-3xl" />
        </a>
        <MagneticButton href="#start" className="!min-h-10 !px-5 !py-2 text-xs shadow-lg">
          Start a project
        </MagneticButton>
      </header>

      <nav aria-label="Chapters" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <ol className="space-y-1 rounded-2xl bg-papyrus/80 p-2 backdrop-blur">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={active === c.id ? "true" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-1.5 font-display text-sm transition-all ${active === c.id ? "bg-[#1c110a] text-gold-light shadow-[inset_0_0_0_2px_#c9973e]" : "bg-[#3b2415]/90 text-gold hover:bg-[#1c110a]"}`}
              >
                <span className="flex w-8 justify-end"><ChapterNumeral n={c.n} className="h-5" compact /></span>
                <span className="max-w-0 overflow-hidden whitespace-nowrap text-gold-light opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
                  {c.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav aria-label="Chapters" className="fixed inset-x-0 bottom-0 z-40 overflow-x-auto bg-papyrus/90 backdrop-blur lg:hidden">
        <ol className="flex min-w-max gap-1 px-3 py-2">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={active === c.id ? "true" : undefined}
                className={`block rounded-lg bg-[#3b2415] px-3 py-1.5 ${active === c.id ? "shadow-[inset_0_0_0_2px_#ebc77e]" : "opacity-80"}`}
              >
                <ChapterNumeral n={c.n} className="h-5" compact />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
