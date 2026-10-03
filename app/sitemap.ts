import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { fleet } from "@/data/fleet";
import { locales } from "@/lib/i18n";

const pages = ["", "/fleet", "/services", "/locations", "/about", "/contact", "/booking"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...pages, ...fleet.map((c) => `/fleet/${c.slug}`)];
  return locales.flatMap((l) => paths.map((p) => ({ url: `${siteConfig.url}/${l}${p}`, lastModified: new Date() })));
}
