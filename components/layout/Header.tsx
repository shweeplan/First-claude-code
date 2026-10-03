"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/", key: "home" },
  { href: "/fleet", key: "fleet" },
  { href: "/services", key: "services" },
  { href: "/locations", key: "locations" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function Toggles({ stacked = false }: { stacked?: boolean }) {
  const { t, locale, currency, setCurrency } = useApp();
  const pathname = usePathname() ?? "/";
  const other = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);
  return (
    <div className={`flex items-center gap-2 ${stacked ? "" : ""}`}>
      <div role="group" aria-label={t("nav.currencyLabel")} className="flex rounded-full border border-line p-0.5 text-xs">
        {(["EGP", "USD"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={currency === c}
            onClick={() => setCurrency(c)}
            className={`min-h-9 rounded-full px-3 font-medium transition-colors ${currency === c ? "bg-accent text-[#14110b]" : "text-muted hover:text-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <Link
        href={switchHref}
        hrefLang={other}
        lang={other}
        aria-label={t("nav.languageLabel")}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Icon name="globe" size={15} />
        {t("nav.language")}
      </Link>
    </div>
  );
}

export function Header() {
  const { t, path } = useApp();
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    const p = path(href);
    return href === "/" ? pathname === p : pathname.startsWith(p);
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-black">
        {t("nav.skip")}
      </a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "border-b border-line/70 bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Wordmark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <L
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative px-3.5 py-2 text-sm transition-colors ${isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {t(`nav.${l.key}`)}
                {isActive(l.href) && <motion.span layoutId="nav-dot" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent" />}
              </L>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Toggles />
            <L href="/booking" className={`${btn.primary} !min-h-10 !px-5`}>{t("nav.book")}</L>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-[4.5rem] lg:hidden"
          >
            <nav aria-label="Mobile" className="flex min-h-full flex-col px-6 pb-10 pt-8">
              <ul className="flex-1">
                {links.map((l, i) => (
                  <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.5 }} className="border-b border-line">
                    <L href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={`flex items-center justify-between py-5 font-display text-3xl ${isActive(l.href) ? "text-accent" : "text-ink"}`}>
                      {t(`nav.${l.key}`)}
                      <Icon name="arrow" className="rtl:rotate-180 text-muted" />
                    </L>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-5">
                <Toggles stacked />
                <L href="/booking" className={btn.primary}>{t("nav.book")}</L>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
