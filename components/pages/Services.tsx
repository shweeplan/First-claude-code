"use client";

import { serviceIds } from "@/data/services";
import { siteConfig, whatsappLink } from "@/config/site";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { serviceIcon } from "@/components/home/Sections";

export function ServicesList() {
  const { t, raw, locale, brand } = useApp();
  const wa = whatsappLink(siteConfig.whatsappMessage[locale].replace("{name}", brand));
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="space-y-24 sm:space-y-32">
          {serviceIds.map((id, i) => {
            const points = raw<string[]>(`services.items.${id}.points`);
            return (
              <article key={id} id={id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                  <div className="grain relative isolate grid aspect-[5/4] place-items-center overflow-hidden rounded-3xl border border-line bg-[radial-gradient(70%_70%_at_50%_30%,rgba(201,169,110,.2),transparent),linear-gradient(160deg,#17171a,#0e0e10)]">
                    <span aria-hidden="true" className="absolute start-6 top-4 font-display text-8xl text-white/[0.05] sm:text-9xl">{String(i + 1).padStart(2, "0")}</span>
                    <span className="grid h-24 w-24 place-items-center rounded-full border border-accent/50 text-accent"><Icon name={serviceIcon[id]} size={40} strokeWidth={1.2} /></span>
                  </div>
                </Reveal>
                <Reveal delay={0.1} className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                  <h2 className="h-display text-4xl sm:text-5xl">{t(`services.items.${id}.title`)}</h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t(`services.items.${id}.text`)}</p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {points.map((p) => <li key={p} className="flex items-start gap-3 text-sm"><Icon name="check" size={17} className="mt-0.5 shrink-0 text-accent" />{p}</li>)}
                  </ul>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <L href={id === "selfDrive" || id === "airport" ? "/booking" : "/contact"} className={btn.primary}>{id === "selfDrive" || id === "airport" ? t("common.bookNow") : t("common.callUs")}</L>
                    {id === "selfDrive" && <L href="/fleet" className={btn.ghost}>{t("common.viewFleet")}</L>}
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:py-20">
            <h2 className="h-display text-4xl sm:text-5xl">{t("services.cta.title")}</h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">{t("services.cta.text")}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn.primary} mt-8`}><Icon name="whatsapp" size={18} />{t("common.whatsappUs")}</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
