import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { siteConfig } from "@/config/site";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

export type Dict = typeof en;
export const dictionaries: Record<Locale, Dict> = { en, ar: ar as Dict };

export const brandName = (l: Locale) => (l === "ar" ? siteConfig.nameAr : siteConfig.name);

/* eslint-disable @typescript-eslint/no-explicit-any */
export function lookup(dict: Dict, key: string): any {
  return key.split(".").reduce<any>((o, k) => (o == null ? o : o[k]), dict);
}

export function translate(
  dict: Dict,
  locale: Locale,
  key: string,
  vars: Record<string, string | number> = {},
): string {
  const v = lookup(dict, key);
  if (typeof v !== "string") return key;
  const all: Record<string, string | number> = { name: brandName(locale), ...vars };
  return v.replace(/\{(\w+)\}/g, (_, k) => String(all[k] ?? `{${k}}`));
}

export const localePath = (locale: Locale, href: string) =>
  `/${locale}${href === "/" ? "" : href}`;
