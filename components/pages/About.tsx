"use client";

import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function AboutBody() {
  const { t, raw } = useApp();
  const story = raw<string[]>("about.story");
  const values = raw<{ title: string; text: string }[]>("about.values");
  const stats = raw<{ value: string; label: string }[]>("about.stats");
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20">
        {story.map((p, i) => <Reveal key={i} delay={i * 0.1}><p className={`leading-[1.9] ${i === 0 ? "font-display text-2xl text-ink sm:text-3xl sm:leading-snug" : "text-lg text-muted"}`}>{p}</p></Reveal>)}
      </section>
      <section className="border-y border-line bg-surface/50">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 sm:px-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <dd className="font-display text-5xl text-accent-soft sm:text-6xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-line bg-surface p-8 transition-colors duration-500 hover:border-accent/50">
                <span className="font-display text-5xl text-accent/60">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 font-display text-3xl">{v.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <L href="/fleet" className={btn.primary}>{t("about.cta")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></L>
        </Reveal>
      </section>
    </>
  );
}
