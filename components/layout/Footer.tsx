"use client";

import { siteConfig, mailLink, telLink } from "@/config/site";
import { useApp } from "@/components/Providers";
import { L } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "./Wordmark";

const nav = ["fleet", "services", "locations", "about", "contact"] as const;
const socials = ["instagram", "facebook", "tiktok", "linkedin"] as const;

export function Footer() {
  const { t, locale, brand } = useApp();
  const c = siteConfig.contact;
  return (
    <footer className="mt-32 border-t border-line bg-[#080809]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{t("footer.tagline")}</p>
          <p className="mt-4 text-xs text-muted/70">{t("footer.cities")}</p>
        </div>
        <div className="md:col-span-3">
          <h3 className="eyebrow mb-5">{t("footer.explore")}</h3>
          <ul className="space-y-3 text-sm">
            {nav.map((k) => (
              <li key={k}><L href={`/${k}`} className="text-muted transition-colors hover:text-ink">{t(`nav.${k}`)}</L></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="eyebrow mb-5">{t("footer.contact")}</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><a href={telLink()} className="inline-flex items-center gap-3 hover:text-ink"><Icon name="phone" size={16} /><span dir="ltr">{c.phone}</span></a></li>
            <li><a href={mailLink()} className="inline-flex items-center gap-3 hover:text-ink"><Icon name="mail" size={16} />{c.email}</a></li>
            <li className="inline-flex items-start gap-3"><Icon name="pin" size={16} className="mt-0.5 shrink-0" />{locale === "ar" ? c.addressAr : c.address}</li>
          </ul>
          <div className="mt-6 flex gap-3" aria-label={t("footer.follow")}>
            {socials.map((s) => (
              <a key={s} href={siteConfig.social[s]} target="_blank" rel="noopener noreferrer" aria-label={s} className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
                <Icon name={s} size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted/80 sm:flex-row sm:justify-between sm:px-8">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.demo")} · {brand}</p>
        </div>
      </div>
    </footer>
  );
}
