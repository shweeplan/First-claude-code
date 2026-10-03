"use client";

import { fleet } from "@/data/fleet";
import { serviceIds, type ServiceId } from "@/data/services";
import { siteConfig, whatsappLink } from "@/config/site";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarCard } from "@/components/car/CarCard";

export const serviceIcon: Record<ServiceId, IconName> = {
  selfDrive: "key", chauffeur: "wheel", airport: "plane", wedding: "rings", corporate: "briefcase",
};

const featuredSlugs = ["mercedes-s-class", "mercedes-gle", "bmw-x5", "mercedes-e-class", "range-rover-evoque", "audi-q7"];

export function Featured() {
  const { t } = useApp();
  const cars = featuredSlugs.map((s) => fleet.find((c) => c.slug === s)!);
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow={t("home.featured.eyebrow")}
        title={t("home.featured.title")}
        subtitle={t("home.featured.subtitle")}
        action={<L href="/fleet" className={btn.ghost}>{t("home.featured.cta")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></L>}
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((c) => <CarCard key={c.slug} car={c} />)}
      </div>
    </section>
  );
}

export function Why() {
  const { t, raw } = useApp();
  const items = raw<{ title: string; text: string }[]>("home.why.items");
  return (
    <section className="relative border-y border-line bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={t("home.why.eyebrow")} title={t("home.why.title")} />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.06} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-9 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr]">
              <span className="font-display text-4xl text-accent/70 transition-colors duration-500 group-hover:text-accent sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl">{it.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-muted">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServicesOverview() {
  const { t } = useApp();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow={t("home.services.eyebrow")}
        title={t("home.services.title")}
        action={<L href="/services" className={btn.ghost}>{t("home.services.cta")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></L>}
      />
      <ul className="mt-14 border-t border-line">
        {serviceIds.map((id, i) => (
          <Reveal as="li" key={id} delay={i * 0.04} className="border-b border-line">
            <L href={`/services#${id}`} className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 sm:gap-8 sm:py-9">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-accent transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-[#14110b]">
                <Icon name={serviceIcon[id]} />
              </span>
              <div>
                <h3 className="font-display text-2xl transition-transform duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 sm:text-4xl">{t(`services.items.${id}.title`)}</h3>
                <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-muted sm:block">{t(`services.items.${id}.text`)}</p>
              </div>
              <Icon name="arrow" className="text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </L>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Testimonials() {
  const { t, raw } = useApp();
  const items = raw<{ quote: string; name: string; role: string }[]>("home.testimonials.items");
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading eyebrow={t("home.testimonials.eyebrow")} title={t("home.testimonials.title")} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-bg p-8">
                <div className="flex gap-1 text-accent" role="img" aria-label="5 / 5">
                  {Array.from({ length: 5 }).map((_, k) => <Icon key={k} name="star" size={15} fill="currentColor" />)}
                </div>
                <blockquote className="mt-6 flex-1 font-display text-[1.45rem] leading-snug text-ink/90">“{it.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-sm text-accent">{it.name.trim()[0]}</span>
                  <span><span className="block text-sm">{it.name}</span><span className="block text-xs text-muted">{it.role}</span></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted/70">{t("home.testimonials.note")}</p>
      </div>
    </section>
  );
}

export function CTA() {
  const { t, locale, brand } = useApp();
  const wa = whatsappLink(siteConfig.whatsappMessage[locale].replace("{name}", brand));
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <Reveal>
        <div className="grain relative isolate overflow-hidden rounded-3xl border border-accent/30 px-6 py-20 text-center sm:px-16 sm:py-28">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(201,169,110,.22),transparent_70%),linear-gradient(#131315,#0d0d0e)]" />
          <h2 className="h-display mx-auto max-w-3xl text-4xl text-balance sm:text-6xl">{t("home.cta.title")}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{t("home.cta.text")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <L href="/booking" className={btn.primary}>{t("home.cta.primary")}</L>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.ghost}><Icon name="whatsapp" size={18} />{t("home.cta.secondary")}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
