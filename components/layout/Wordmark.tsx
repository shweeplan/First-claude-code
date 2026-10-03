"use client";

import { useApp } from "@/components/Providers";
import { L } from "@/components/ui/Link";

/** Text-only logo. Uses the brand name from config/site.ts. */
export function Wordmark({ className = "" }: { className?: string }) {
  const { brand, t } = useApp();
  return (
    <L href="/" aria-label={`${brand} — ${t("nav.home")}`} className={`group inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/60 transition-colors duration-500 group-hover:border-accent">
        <span className="h-2 w-2 rotate-45 bg-accent transition-transform duration-500 group-hover:rotate-[225deg]" />
      </span>
      <span className="font-display text-[1.15rem] leading-none tracking-[0.22em] uppercase text-ink sm:text-[1.3rem]">{brand}</span>
    </L>
  );
}
