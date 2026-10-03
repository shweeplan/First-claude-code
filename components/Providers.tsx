"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { siteConfig } from "@/config/site";
import {
  type Dict, type Locale, brandName, localePath as lp, lookup, translate,
} from "@/lib/i18n";

type Currency = "EGP" | "USD";
interface Ctx {
  locale: Locale;
  dict: Dict;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Returns an array/object entry from the dictionary (lists, nested items). */
  raw: <T = unknown>(key: string) => T;
  path: (href: string) => string;
  brand: string;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  money: (egp: number) => string;
}

const AppContext = createContext<Ctx | null>(null);

export function Providers({
  locale, dict, children,
}: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EGP");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currency");
      if (saved === "USD" || saved === "EGP") setCurrencyState(saved);
    } catch {}
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("currency", c); } catch {}
  }, []);

  const value = useMemo<Ctx>(() => {
    const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US", { maximumFractionDigits: 0 });
    return {
      locale, dict,
      t: (key, vars) => translate(dict, locale, key, vars),
      raw: <T,>(key: string) => lookup(dict, key) as T,
      path: (href) => lp(locale, href),
      brand: brandName(locale),
      currency, setCurrency,
      money: (egp) =>
        currency === "USD"
          ? `$${nf.format(Math.round(egp / siteConfig.usdRate))}`
          : locale === "ar" ? `${nf.format(egp)} ج.م` : `EGP ${nf.format(egp)}`,
    };
  }, [locale, dict, currency, setCurrency]);

  return (
    <AppContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AppContext.Provider>
  );
}

export function useApp() {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be used inside <Providers>");
  return c;
}
