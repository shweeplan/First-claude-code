"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { type Car, carName } from "@/data/fleet";
import { useApp } from "@/components/Providers";
import { L } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { CarImage } from "./CarImage";

export const StatusDot = ({ status }: { status: Car["status"] }) => {
  const { t } = useApp();
  const color = status === "available" ? "bg-emerald-400" : status === "limited" ? "bg-amber-400" : "bg-rose-400";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-ink/90">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {t(`common.${status}`)}
    </span>
  );
};

export const CarCard = forwardRef<HTMLElement, { car: Car; priority?: boolean }>(function CarCard({ car, priority }, ref) {
  const { t, money } = useApp();
  return (
    <motion.article
      ref={ref as React.Ref<HTMLElement>}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-500 hover:border-accent/50"
    >
      <L href={`/fleet/${car.slug}`} className="block focus-visible:outline-offset-[-3px]" aria-label={`${carName(car)} — ${t("common.viewDetails")}`}>
        <div className="relative">
          <CarImage car={car} priority={priority} className="aspect-[16/10] transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-[1.04]" />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[0.7rem] tracking-wider text-ink/90 backdrop-blur-md">{t(`common.${car.category}`)}</span>
            <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-md"><StatusDot status={car.status} /></span>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl leading-tight"><bdi>{carName(car)}</bdi></h3>
            <span className="text-sm text-muted">{car.year}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8rem] text-muted">
            <li className="inline-flex items-center gap-1.5"><Icon name="user" size={14} />{t("common.seats", { n: car.seats })}</li>
            <li className="inline-flex items-center gap-1.5"><Icon name="gear" size={14} />{t("common.Automatic")}</li>
            <li className="inline-flex items-center gap-1.5"><Icon name="fuel" size={14} />{t(`common.${car.fuel}`)}</li>
          </ul>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-muted">{t("common.from")}</p>
              <p className="mt-0.5 whitespace-nowrap">
                <span className="font-display text-2xl text-accent-soft">{money(car.daily)}</span>{" "}
                <span className="text-xs text-muted">{t("common.perDay")}</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-ink transition-colors group-hover:text-accent">
              {t("common.viewDetails")}
              <Icon name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </L>
    </motion.article>
  );
});
