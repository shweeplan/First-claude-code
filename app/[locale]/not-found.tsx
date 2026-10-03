"use client";

import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";

export default function NotFound() {
  const { t } = useApp();
  return (
    <section className="grid min-h-[80vh] place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="h-display mt-5 text-5xl sm:text-7xl">{t("notFound.title")}</h1>
        <p className="mt-5 text-muted">{t("notFound.text")}</p>
        <L href="/" className={`${btn.primary} mt-9`}>{t("notFound.cta")}</L>
      </div>
    </section>
  );
}
