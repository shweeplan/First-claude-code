import type { Chapter as C } from "@/config/site";
import Cartouche from "../ui/Cartouche";
import Glyph from "../ui/Glyph";

/** Editorial chapter: sticky title column, scrolling two-column feature rows. */
export default function Chapter({ c, dark = false, children, after }: { c: C; dark?: boolean; children?: React.ReactNode; after?: React.ReactNode }) {
  const panel = dark ? "bg-night/80 text-papyrus on-dark" : "bg-papyrus/92 text-ink";
  return (
    <section id={c.id} data-chapter={c.id} aria-labelledby={`${c.id}-h`} className="relative min-h-[150vh] px-5 py-24 lg:pl-40 lg:pr-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className={`grain relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm ${panel}`}>
            <Cartouche dark={dark}>{c.numeral}</Cartouche>
            <p className={`mt-6 font-display text-xs tracking-[0.3em] ${dark ? "text-gold-light" : "text-brown"}`}>{c.kicker.toUpperCase()}</p>
            <h2 id={`${c.id}-h`} data-lines className="mt-2 font-display text-5xl font-semibold leading-none sm:text-6xl">
              <span className="reveal-line"><span>{c.title}</span></span>
            </h2>
            <p className="mt-5 text-lg">{c.intro}</p>
          </div>
        </div>
        <div className="space-y-6 lg:pt-40">
          {c.items.length > 0 && (
            <ul className={`grain relative overflow-hidden rounded-3xl px-6 backdrop-blur-sm ${panel}`}>
              {c.items.map((it, i) => (
                <li key={it.title} data-reveal className={`grid gap-3 py-8 sm:grid-cols-2 sm:gap-8 ${i ? `border-t ${dark ? "border-gold/30" : "border-gold/40"}` : ""}`}>
                  <h3 className="flex items-start gap-3 font-display text-xl font-semibold">
                    <Glyph name={it.glyph} className={`mt-0.5 h-8 w-8 shrink-0 ${dark ? "text-gold-light" : "text-gold"}`} />
                    {it.title}
                  </h3>
                  <p>{it.body}</p>
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
      {after}
    </section>
  );
}
