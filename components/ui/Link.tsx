"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useApp } from "@/components/Providers";

/** next/link that automatically prefixes the active locale. */
export function L({ href, ...props }: ComponentProps<typeof NextLink> & { href: string }) {
  const { path } = useApp();
  const external = /^(https?:|mailto:|tel:|#)/.test(href);
  return <NextLink href={external ? href : path(href)} {...props} />;
}

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 min-h-12 text-sm font-medium tracking-wide transition-all duration-500 ease-[var(--ease-lux)] whitespace-nowrap";
export const btn = {
  primary: `${base} bg-accent text-[#14110b] hover:bg-accent-soft hover:shadow-[0_8px_40px_-8px_rgba(201,169,110,.55)]`,
  ghost: `${base} border border-white/20 text-ink hover:border-accent hover:text-accent`,
  dark: `${base} bg-surface-2 border border-line text-ink hover:border-accent`,
};
