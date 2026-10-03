"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Car, carName } from "@/data/fleet";
import { pickupOptions } from "@/data/locations";
import { addDaysISO, todayISO } from "@/lib/pricing";
import { isPhone, makeRef } from "@/lib/validate";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";

type Errors = Partial<Record<"name" | "phone" | "dates" | "location", string>>;

export function CarInquiry({ car }: { car: Car }) {
  const { t } = useApp();
  const [v, setV] = useState({ name: "", phone: "", from: "", to: "", location: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<{ ref: string; name: string } | null>(null);

  useEffect(() => {
    const f = addDaysISO(todayISO(), 1);
    setV((p) => ({ ...p, from: f, to: addDaysISO(f, 3) }));
  }, []);

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (v.name.trim().length < 2) er.name = t("form.errName");
    if (!isPhone(v.phone)) er.phone = t("form.errPhone");
    if (!v.location) er.location = t("form.errLocation");
    if (!v.from || !v.to || v.to < v.from) er.dates = t("form.errDates");
    else if (v.from < todayISO()) er.dates = t("form.errPast");
    setErrors(er);
    if (Object.keys(er).length === 0) setDone({ ref: makeRef("RQ"), name: v.name.trim().split(" ")[0] });
  };

  const label = "mb-1.5 block text-xs text-muted";
  const err = (id: string, m?: string) => m && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-[#e08b80]">{m}</p>;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="font-display text-3xl">{t("car.bookTitle")}</h2>
      <p className="mt-2 text-sm text-muted">{t("car.bookSubtitle")}</p>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center" role="status">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent text-accent"><Icon name="check" size={26} /></span>
            <h3 className="mt-6 font-display text-3xl">{t("form.successTitle")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-muted">{t("form.successText", { name: done.name })}</p>
            <p className="mt-5 text-sm text-muted">{t("form.reference")}: <span dir="ltr" className="font-medium text-accent-soft">{done.ref}</span> · <bdi>{carName(car)}</bdi></p>
            <p className="mt-2 text-xs text-muted/70">{t("form.demoNote")}</p>
            <button type="button" onClick={() => setDone(null)} className={`${btn.ghost} mt-8`}>{t("form.another")}</button>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ci-name" className={label}>{t("form.name")}</label>
              <input id="ci-name" className="field" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "ci-name-err" : undefined} />
              {err("ci-name", errors.name)}
            </div>
            <div>
              <label htmlFor="ci-phone" className={label}>{t("form.phone")}</label>
              <input id="ci-phone" type="tel" dir="ltr" className="field text-start" autoComplete="tel" placeholder="+20 1xx xxx xxxx" value={v.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "ci-phone-err" : undefined} />
              {err("ci-phone", errors.phone)}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ci-loc" className={label}>{t("form.location")}</label>
              <select id="ci-loc" className="field" value={v.location} onChange={set("location")} aria-invalid={!!errors.location} aria-describedby={errors.location ? "ci-loc-err" : undefined}>
                <option value="">{t("widget.selectLocation")}</option>
                {pickupOptions.map((o) => <option key={o} value={o}>{t(`locationNames.${o}`)}</option>)}
              </select>
              {err("ci-loc", errors.location)}
            </div>
            <div>
              <label htmlFor="ci-from" className={label}>{t("form.pickup")}</label>
              <input id="ci-from" type="date" className="field" min={todayISO()} value={v.from} onChange={set("from")} aria-invalid={!!errors.dates} />
            </div>
            <div>
              <label htmlFor="ci-to" className={label}>{t("form.return")}</label>
              <input id="ci-to" type="date" className="field" min={v.from || todayISO()} value={v.to} onChange={set("to")} aria-invalid={!!errors.dates} aria-describedby={errors.dates ? "ci-dates-err" : undefined} />
            </div>
            <div className="sm:col-span-2">{err("ci-dates", errors.dates)}</div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button type="submit" className={`${btn.primary} flex-1`}>{t("form.send")}</button>
              <L href={`/booking?car=${car.slug}`} className={btn.ghost}>{t("common.bookNow")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></L>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
