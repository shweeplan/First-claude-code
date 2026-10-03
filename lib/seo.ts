import type { Metadata } from "next";
import { dictionaries, isLocale, locales, translate, type Locale } from "@/lib/i18n";

/** Build per-page, per-language metadata (title, description, hreflang, Open Graph). */
export function pageMetadata(
  locale: string,
  page: "home" | "fleet" | "car" | "booking" | "services" | "locations" | "about" | "contact",
  path: string,
  vars: Record<string, string | number> = {},
): Metadata {
  if (!isLocale(locale)) return {};
  const l: Locale = locale;
  const title = translate(dictionaries[l], l, `meta.${page}.title`, vars);
  const description = translate(dictionaries[l], l, `meta.${page}.description`, vars);
  const suffix = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `/${l}${suffix}`,
      languages: Object.fromEntries(locales.map((x) => [x, `/${x}${suffix}`])),
    },
    openGraph: { title, description, url: `/${l}${suffix}`, locale: l === "ar" ? "ar_EG" : "en_US" },
    twitter: { title, description },
  };
}
