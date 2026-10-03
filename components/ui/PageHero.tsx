import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line/60 pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_80%_0%,rgba(201,169,110,.14),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="eyebrow mb-5">{eyebrow}</p></Reveal>
        <Reveal delay={0.08}><h1 className="h-display max-w-4xl text-5xl text-balance sm:text-6xl lg:text-7xl">{title}</h1></Reveal>
        {subtitle && <Reveal delay={0.16}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p></Reveal>}
        {children && <Reveal delay={0.24}><div className="mt-10">{children}</div></Reveal>}
      </div>
    </section>
  );
}
