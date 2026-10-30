import type { Chapter as C } from "@/config/site";
import Cartouche from "../ui/Cartouche";
import ChapterNumeral from "../ui/ChapterNumeral";
import Glyph from "../ui/Glyph";
import StageDriver from "./StageDriver";

/**
 * Editorial chapter. With motion on, it becomes a pinned scroll story: a giant title card,
 * then one feature per scroll step while the 3D scene plays. Without motion it is a plain stacked list.
 */
export default function Chapter({ c, children }: { c: C; children?: React.ReactNode }) {
  const steps = c.items.length + (children ? 1 : 0);
  const panel = "bg-papyrus/90 text-ink";
  return (
    <section
      id={c.id}
      data-chapter={c.id}
      data-stage
      aria-labelledby={`${c.id}-h`}
      style={{ "--steps": steps } as React.CSSProperties}
      className="stage-section relative min-h-[150vh] px-5 py-24 lg:pl-40 lg:pr-12"
    >
      <div className="stage-pin">
        <div className="stage-intro px-5 lg:pl-40 lg:pr-12" aria-hidden="true">
          <div>
            <Cartouche size="lg"><ChapterNumeral n={c.n} className="h-16 sm:h-24" /></Cartouche>
            <p className="mt-6 font-display text-sm tracking-[0.4em] text-brown sm:text-base">{c.kicker.toUpperCase()}</p>
            <p className="stage-giant font-display font-semibold leading-[0.9] text-ink">{c.title}</p>
          </div>
        </div>

        <div className="stage-grid grid w-full gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <div className="lg:self-center">
            <div className={`grain relative overflow-hidden rounded-3xl p-6 backdrop-blur-sm sm:p-8 ${panel}`}>
              <Cartouche><ChapterNumeral n={c.n} className="h-7" /></Cartouche>
              <p className="stage-card-intro mt-5 font-display text-xs tracking-[0.3em] text-brown">{c.kicker.toUpperCase()}</p>
              <h2 id={`${c.id}-h`} className="mt-3 font-display text-4xl font-semibold leading-none sm:text-6xl">{c.title}</h2>
              <p className="stage-card-intro mt-4 text-lg">{c.intro}</p>
            </div>
          </div>
          <ul className={`stage-items grain relative overflow-hidden rounded-3xl px-6 backdrop-blur-sm ${panel}`}>
            {c.items.map((it, i) => (
              <li key={it.title} className="stage-item">
                <div className="stage-body">
                  <div className={`grid w-full gap-3 py-8 sm:grid-cols-2 sm:gap-8 ${i ? "border-t border-gold/40 stage-sep" : ""}`}>
                    <h3 className="flex items-start gap-3 font-display text-xl font-semibold sm:text-2xl">
                      <Glyph name={it.glyph} className="mt-0.5 h-9 w-9 shrink-0 text-gold" />
                      {it.title}
                    </h3>
                    <p className="text-base sm:text-lg">{it.body}</p>
                  </div>
                </div>
              </li>
            ))}
            {children && <li className="stage-item stage-extra border-t border-gold/40 py-6"><div className="stage-body">{children}</div></li>}
          </ul>
        </div>

        <ol className="stage-progress" aria-hidden="true">
          {Array.from({ length: steps }, (_, i) => <li key={i} className="stage-tick" />)}
        </ol>
      </div>
      <StageDriver />
    </section>
  );
}
