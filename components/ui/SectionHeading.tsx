import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow, title, subtitle, align = "start", action,
}: { eyebrow?: string; title: string; subtitle?: string; align?: "start" | "center"; action?: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${align === "center" ? "items-center text-center md:flex-col md:items-center md:justify-center" : ""}`}>
      <Reveal className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl text-balance">{title}</h2>
        {subtitle && <p className="mt-5 text-muted text-base sm:text-lg leading-relaxed max-w-xl">{subtitle}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}
