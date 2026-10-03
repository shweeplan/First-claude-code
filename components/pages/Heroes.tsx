"use client";

import { useApp } from "@/components/Providers";
import { PageHero } from "@/components/ui/PageHero";

type K = "fleet" | "services" | "locations" | "about" | "contact" | "booking";
function make(k: K) {
  return function Hero() {
    const { t } = useApp();
    return <PageHero eyebrow={t(`${k}.eyebrow`)} title={t(`${k}.title`)} subtitle={t(`${k}.subtitle`)} />;
  };
}
export const FleetHero = make("fleet");
export const ServicesHero = make("services");
export const LocationsHero = make("locations");
export const ContactHero = make("contact");
export const BookingHero = make("booking");
export function AboutHero() {
  const { t } = useApp();
  return <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} subtitle={t("about.lead")} />;
}
