"use client";

import { type Car, carName, fleet } from "@/data/fleet";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { CarCard, StatusDot } from "./CarCard";
import { CarGallery } from "./CarGallery";
import { CarInquiry } from "./CarInquiry";

const pct = (rate: number, days: number, daily: number) => Math.round((1 - rate / (daily * days)) * 100);

export function CarDetail({ car }: { car: Car }) {
  const { t, raw, money, currency } = useApp();
  const use = t(`car.use${car.category}`);
  const specs: { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar", label: t("car.year"), value: String(car.year) },
    { icon: "road", label: t("car.category"), value: t(`common.${car.category}`) },
    { icon: "gear", label: t("car.transmission"), value: t("common.Automatic") },
    { icon: "fuel", label: t("car.fuel"), value: t(`common.${car.fuel}`) },
    { icon: "wheel", label: t("car.engine"), value: car.engine },
    { icon: "star", label: t("car.power"), value: car.power },
    { icon: "seat", label: t("car.seats"), value: String(car.seats) },
  ];
  const rows = [
    { key: "daily", price: car.daily, unit: t("common.perDay"), eq: null as string | null, save: 0 },
    { key: "weekly", price: car.weekly, unit: t("common.perWeek"), eq: t("car.perDayEq", { price: money(Math.round(car.weekly / 7)) }), save: pct(car.weekly, 7, car.daily) },
    { key: "monthly", price: car.monthly, unit: t("common.perMonth"), eq: t("car.perDayEq", { price: money(Math.round(car.monthly / 30)) }), save: pct(car.monthly, 30, car.daily) },
  ];
  const similar = fleet.filter((c) => c.slug !== car.slug && c.category === car.category).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-28 sm:px-8 sm:pt-32">
        <L href="/fleet" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent">
          <Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />{t("car.back")}
        </L>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        <Reveal><CarGallery car={car} /></Reveal>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t(`common.${car.category}`)}</span>
              <StatusDot status={car.status} />
            </div>
            <h1 className="h-display mt-5 text-5xl sm:text-6xl"><bdi>{carName(car)}</bdi></h1>
            <p className="mt-5 leading-relaxed text-muted">{t("car.description", { car: carName(car), power: car.power, use })}</p>
            <div className="mt-8 flex items-end justify-between border-y border-line py-6">
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-muted">{t("common.from")}</p>
                <p className="mt-1"><span className="font-display text-4xl text-accent-soft">{money(car.daily)}</span> <span className="text-sm text-muted">{t("common.perDay")}</span></p>
              </div>
              <ul className="space-y-1.5 text-end text-sm text-muted">
                <li>{t("common.seats", { n: car.seats })}</li>
                <li>{t(`common.${car.fuel}`)} · {t("common.Automatic")}</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <L href={`/booking?car=${car.slug}`} className={`${btn.primary} flex-1`}>{t("common.bookNow")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></L>
              <a href="#reserve" className={`${btn.ghost} flex-1`}>{t("car.bookTitle")}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl">{t("car.specs")}</h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-4">
                <dt className="inline-flex items-center gap-3 text-sm text-muted"><Icon name={s.icon} size={17} className="text-accent" />{s.label}</dt>
                <dd className="text-sm"><bdi>{s.value}</bdi></dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl">{t("car.pricing")}</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-start">
              <caption className="sr-only">{t("car.pricing")}</caption>
              <thead>
                <tr className="border-b border-line bg-surface text-xs uppercase tracking-widest text-muted">
                  <th scope="col" className="px-5 py-3 text-start font-medium">{t("car.rate")}</th>
                  <th scope="col" className="px-5 py-3 text-end font-medium">{currency}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-5 text-start font-normal">
                      <span className="block">{t(`common.${r.key}`)}</span>
                      {r.eq && <span className="mt-0.5 block text-xs text-muted">{r.eq}</span>}
                    </th>
                    <td className="px-5 py-5 text-end">
                      <span className="font-display text-2xl text-accent-soft">{money(r.price)}</span>
                      <span className="ms-1.5 text-xs text-muted">{r.unit}</span>
                      {r.save > 0 && <span className="mt-1 block text-xs text-emerald-400">{t("car.save", { pct: r.save })}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">{t("car.pricingNote")}</p>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl">{t("car.included")}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {car.features.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm">
                <span className="text-accent"><Icon name="check" size={17} /></span>{t(`features.${f}`)}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-muted">{t("car.includedInRate")}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
            {raw<string[]>("car.inclusions").map((x) => <li key={x} className="flex gap-3"><Icon name="shield" size={17} className="mt-0.5 shrink-0 text-accent" />{x}</li>)}
          </ul>
        </Reveal>
        <Reveal delay={0.1}><div id="reserve" className="scroll-mt-28"><CarInquiry car={car} /></div></Reveal>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl">{t("car.similar")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((c) => <CarCard key={c.slug} car={c} />)}</div>
        </section>
      )}
    </>
  );
}
