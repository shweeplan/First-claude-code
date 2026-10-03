"use client";

import type { Car } from "@/data/fleet";
import { carName } from "@/data/fleet";
import { extras, type ExtraId } from "@/data/extras";
import { extrasTotal, rentalBreakdown } from "@/lib/pricing";
import { useApp } from "@/components/Providers";

export function Estimate({ car, days, selected }: { car?: Car; days: number; selected: ExtraId[] }) {
  const { t, money } = useApp();
  const d = Math.max(days, 1);
  const rental = car ? rentalBreakdown(car, d) : null;
  const ex = extrasTotal(selected, d);
  const total = (rental?.total ?? 0) + ex;
  const row = "flex items-baseline justify-between gap-4 py-2.5 text-sm";
  return (
    <div className="rounded-2xl border border-line bg-surface p-6" aria-live="polite">
      <h2 className="eyebrow">{t("booking.calc.title")}</h2>
      {!car ? (
        <p className="mt-6 text-sm text-muted">{t("booking.calc.selectCar")}</p>
      ) : (
        <>
          <p className="mt-4 font-display text-2xl"><bdi>{carName(car)}</bdi></p>
          <p className="text-xs text-muted">{days > 0 ? (days === 1 ? t("common.day") : t("common.days", { n: days })) : "—"}</p>
          <dl className="mt-4 divide-y divide-line border-t border-line">
            {rental && days > 0 && (
              <>
                {rental.months > 0 && <div className={row}><dt className="text-muted">{t("booking.calc.months", { n: rental.months })}</dt><dd>{money(rental.months * car.monthly)}</dd></div>}
                {rental.weeks > 0 && <div className={row}><dt className="text-muted">{t("booking.calc.weeks", { n: rental.weeks })}</dt><dd>{money(rental.weeks * car.weekly)}</dd></div>}
                {rental.days > 0 && <div className={row}><dt className="text-muted">{t("booking.calc.daysRate", { n: rental.days })}</dt><dd>{money(rental.days * car.daily)}</dd></div>}
              </>
            )}
            {selected.map((id) => {
              const e = extras.find((x) => x.id === id)!;
              return (
                <div key={id} className={row}>
                  <dt className="text-muted">{t(`booking.extras.${id}.title`)}</dt>
                  <dd>{money(e.unit === "perDay" ? e.price * d : e.price)}</dd>
                </div>
              );
            })}
            {rental && rental.saved > 0 && (
              <div className={row}><dt className="text-emerald-400">{t("booking.calc.savings")}</dt><dd className="text-emerald-400">−{money(rental.saved)}</dd></div>
            )}
          </dl>
          <div className="mt-2 flex items-baseline justify-between border-t border-accent/40 pt-5">
            <span className="text-sm">{t("booking.calc.total")}</span>
            <span className="font-display text-3xl text-accent-soft">{money(total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{t("booking.calc.tax")}</p>
        </>
      )}
    </div>
  );
}
