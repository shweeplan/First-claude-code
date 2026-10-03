"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { type Car, carName, categories, fleet, getCar } from "@/data/fleet";
import { extras, type ExtraId } from "@/data/extras";
import { pickupOptions } from "@/data/locations";
import { siteConfig, whatsappLink } from "@/config/site";
import { addDaysISO, daysBetween, extrasTotal, rentalBreakdown, todayISO } from "@/lib/pricing";
import { isEmail, isPhone, makeRef } from "@/lib/validate";
import { useApp } from "@/components/Providers";
import { btn } from "@/components/ui/Link";
import { Icon } from "@/components/ui/Icon";
import { CarArt } from "@/components/car/CarArt";
import { StatusDot } from "@/components/car/CarCard";
import { Estimate } from "./Estimate";

const times = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

interface Form {
  carSlug: string; category: string; pickup: string; returnLoc: string; from: string; to: string; time: string;
  extras: ExtraId[]; name: string; phone: string; email: string; licence: "local" | "intl"; age: boolean; notes: string;
}

export function BookingFlow() {
  const { t, raw, money, locale } = useApp();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ ref: string } | null>(null);
  const [f, setF] = useState<Form>({
    carSlug: getCar(params.get("car") ?? "")?.slug ?? "",
    category: categories.includes(params.get("category") as never) ? (params.get("category") as string) : "",
    pickup: pickupOptions.includes(params.get("location") ?? "") ? (params.get("location") as string) : "",
    returnLoc: "same", from: params.get("pickup") ?? "", to: params.get("return") ?? "", time: "10:00",
    extras: [], name: "", phone: "", email: "", licence: "local", age: false, notes: "",
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStep = useRef(step);
  const steps = raw<string[]>("booking.steps");

  useEffect(() => {
    setF((p) => {
      if (p.from && p.to) return p;
      const a = p.from || addDaysISO(todayISO(), 1);
      return { ...p, from: a, to: p.to || addDaysISO(a, 3) };
    });
  }, []);

  useEffect(() => {
    if (prevStep.current === step && !done) return;
    prevStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [step, done]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const car = getCar(f.carSlug);
  const days = daysBetween(f.from, f.to);
  const list = useMemo(() => fleet.filter((c) => !f.category || c.category === f.category), [f.category]);
  const total = (car ? rentalBreakdown(car, Math.max(days, 1)).total : 0) + extrasTotal(f.extras, Math.max(days, 1));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0 && !car) e.carSlug = t("booking.errCar");
    if (s === 1) {
      if (!f.pickup) e.pickup = t("form.errLocation");
      if (!f.from || !f.to || f.to < f.from) e.to = t("form.errDates");
      else if (f.from < todayISO()) e.from = t("form.errPast");
    }
    if (s === 3) {
      if (f.name.trim().length < 2) e.name = t("form.errName");
      if (!isPhone(f.phone)) e.phone = t("form.errPhone");
      if (!isEmail(f.email)) e.email = t("form.errEmail");
      if (!f.age) e.age = t("booking.errAge");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => Math.min(s + 1, 4));
  const confirm = () => { if (validate(3)) setDone({ ref: makeRef("RC") }); };
  const err = (k: string) => errors[k] ? <p id={`${k}-err`} role="alert" className="mt-1.5 text-xs text-[#e08b80]">{errors[k]}</p> : null;
  const label = "mb-1.5 block text-xs text-muted";
  const locLabel = (id: string) => (id === "same" ? t("booking.sameAsPickup") : t(`locationNames.${id}`));

  /* ───────────── success ───────────── */
  if (done && car) {
    const text = t("booking.waText", { ref: done.ref, car: carName(car), from: f.from, to: f.to, pickup: locLabel(f.pickup) });
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-3xl border border-accent/30 bg-surface p-8 text-center sm:p-14" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-accent text-accent"><Icon name="check" size={30} /></span>
        <h2 ref={headingRef} tabIndex={-1} className="mt-8 font-display text-4xl outline-none sm:text-5xl">{t("booking.successTitle")}</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{t("booking.successText", { name: f.name.trim().split(" ")[0], car: carName(car) })}</p>
        <p className="mt-8 text-sm text-muted">{t("form.reference")}</p>
        <p dir="ltr" className="font-display text-3xl tracking-widest text-accent-soft">{done.ref}</p>
        <div className="mt-6 text-sm text-muted"><bdi>{carName(car)}</bdi> · {f.from} → {f.to} · {money(total)}</div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className={btn.primary}><Icon name="whatsapp" size={18} />{t("booking.confirmWhatsapp")}</a>
          <button type="button" onClick={() => { setDone(null); setStep(0); setF((p) => ({ ...p, carSlug: "", extras: [], age: false })); }} className={btn.ghost}>{t("booking.newBooking")}</button>
        </div>
        <p className="mt-8 text-xs text-muted/70">{t("form.demoNote")}</p>
      </motion.div>
    );
  }

  /* ───────────── steps ───────────── */
  const stepContent = [
    // 0 — car
    <div key="s0">
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("fleet.category")}>
        {["", ...categories].map((c) => (
          <button key={c || "all"} type="button" aria-pressed={f.category === c} onClick={() => set("category", c)} className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${f.category === c ? "border-accent bg-accent text-[#14110b]" : "border-line text-muted hover:text-ink"}`}>
            {c ? t(`common.${c}`) : t("booking.filterAll")}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label={t("booking.carTitle")} aria-describedby={errors.carSlug ? "carSlug-err" : undefined} className="grid gap-3 sm:grid-cols-2">
        {list.map((c: Car) => {
          const sel = f.carSlug === c.slug;
          const off = c.status === "reserved";
          return (
            <button key={c.slug} type="button" role="radio" aria-checked={sel} disabled={off} onClick={() => set("carSlug", c.slug)}
              className={`group flex items-center gap-4 rounded-xl border p-3 text-start transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${sel ? "border-accent bg-accent/[0.07]" : "border-line bg-surface hover:border-accent/50"}`}>
              <span className="block w-28 shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_50%_40%,#2a2824,#101011)] p-1.5"><CarArt body={c.body} color={c.color} className="h-auto w-full" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-tight"><bdi>{carName(c)}</bdi></span>
                <span className="mt-1 block text-xs text-muted">{money(c.daily)} {t("common.perDay")}</span>
                <span className="mt-1.5 block"><StatusDot status={c.status} /></span>
              </span>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${sel ? "border-accent bg-accent text-[#14110b]" : "border-line"}`}>{sel && <Icon name="check" size={14} />}</span>
            </button>
          );
        })}
      </div>
      {err("carSlug")}
    </div>,

    // 1 — dates & location
    <div key="s1" className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="b-pickup" className={label}>{t("booking.pickupLocation")}</label>
        <select id="b-pickup" className="field" value={f.pickup} onChange={(e) => set("pickup", e.target.value)} aria-invalid={!!errors.pickup} aria-describedby={errors.pickup ? "pickup-err" : undefined}>
          <option value="">{t("widget.selectLocation")}</option>
          {pickupOptions.map((o) => <option key={o} value={o}>{t(`locationNames.${o}`)}</option>)}
        </select>
        {err("pickup")}
      </div>
      <div>
        <label htmlFor="b-return" className={label}>{t("booking.returnLocation")}</label>
        <select id="b-return" className="field" value={f.returnLoc} onChange={(e) => set("returnLoc", e.target.value)}>
          <option value="same">{t("booking.sameAsPickup")}</option>
          {pickupOptions.map((o) => <option key={o} value={o}>{t(`locationNames.${o}`)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="b-from" className={label}>{t("booking.pickupDate")}</label>
        <input id="b-from" type="date" className="field" min={todayISO()} value={f.from} onChange={(e) => { set("from", e.target.value); if (f.to && e.target.value > f.to) set("to", e.target.value); }} aria-invalid={!!errors.from} aria-describedby={errors.from ? "from-err" : undefined} />
        {err("from")}
      </div>
      <div>
        <label htmlFor="b-to" className={label}>{t("booking.returnDate")}</label>
        <input id="b-to" type="date" className="field" min={f.from || todayISO()} value={f.to} onChange={(e) => set("to", e.target.value)} aria-invalid={!!errors.to} aria-describedby={errors.to ? "to-err" : undefined} />
        {err("to")}
      </div>
      <div>
        <label htmlFor="b-time" className={label}>{t("booking.pickupTime")}</label>
        <select id="b-time" className="field" value={f.time} onChange={(e) => set("time", e.target.value)}>{times.map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="flex items-end">
        <p className="flex min-h-12 w-full items-center justify-between rounded-lg border border-dashed border-line px-4 text-sm"><span className="text-muted">{t("booking.duration")}</span><span className="font-display text-xl text-accent-soft">{days > 0 ? (days === 1 ? t("common.day") : t("common.days", { n: days })) : "—"}</span></p>
      </div>
    </div>,

    // 2 — extras
    <div key="s2" className="grid gap-3">
      {extras.map((e) => {
        const on = f.extras.includes(e.id);
        const icon = ({ chauffeur: "wheel", airport: "plane", childSeat: "user", driver: "key", insurance: "shield" } as const)[e.id];
        return (
          <label key={e.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-accent sm:p-5 ${on ? "border-accent bg-accent/[0.07]" : "border-line bg-surface hover:border-accent/50"}`}>
            <input type="checkbox" className="sr-only" checked={on} onChange={() => set("extras", on ? f.extras.filter((x) => x !== e.id) : [...f.extras, e.id])} />
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${on ? "border-accent text-accent" : "border-line text-muted"}`}><Icon name={icon} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-xl">{t(`booking.extras.${e.id}.title`)}</span>
              <span className="mt-0.5 block text-sm text-muted">{t(`booking.extras.${e.id}.text`)}</span>
            </span>
            <span className="shrink-0 text-end">
              <span className="block text-sm text-accent-soft">{t(e.unit === "perDay" ? "booking.unitDay" : "booking.unitFlat", { price: money(e.price) })}</span>
              <span className={`mt-2 ms-auto grid h-6 w-6 place-items-center rounded-full border ${on ? "border-accent bg-accent text-[#14110b]" : "border-line"}`}>{on && <Icon name="check" size={14} />}</span>
            </span>
          </label>
        );
      })}
    </div>,

    // 3 — contact
    <div key="s3" className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="b-name" className={label}>{t("form.name")}</label>
        <input id="b-name" className="field" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="b-phone" className={label}>{t("form.phone")}</label>
        <input id="b-phone" type="tel" dir="ltr" className="field text-start" autoComplete="tel" placeholder="+20 1xx xxx xxxx" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-err" : undefined} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="b-email" className={label}>{t("form.email")}</label>
        <input id="b-email" type="email" dir="ltr" className="field text-start" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
        {err("email")}
      </div>
      <fieldset className="sm:col-span-2">
        <legend className={label}>{t("booking.licence")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["local", "intl"] as const).map((k) => (
            <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-sm transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-accent ${f.licence === k ? "border-accent bg-accent/[0.07]" : "border-line bg-surface"}`}>
              <input type="radio" name="licence" className="sr-only" checked={f.licence === k} onChange={() => set("licence", k)} />
              <span className={`grid h-5 w-5 place-items-center rounded-full border ${f.licence === k ? "border-accent" : "border-line"}`}>{f.licence === k && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}</span>
              {t(k === "local" ? "booking.licenceLocal" : "booking.licenceIntl")}
            </label>
          ))}
        </div>
        {f.licence === "intl" && <p className="mt-3 text-xs leading-relaxed text-muted">{t("booking.licenceHint")}</p>}
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="b-notes" className={label}>{t("form.notes")}</label>
        <textarea id="b-notes" rows={3} className="field" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-center gap-3 text-sm focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-4">
          <input type="checkbox" className="sr-only" checked={f.age} onChange={(e) => set("age", e.target.checked)} aria-describedby={errors.age ? "age-err" : undefined} />
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${f.age ? "border-accent bg-accent text-[#14110b]" : errors.age ? "border-[#c4655a]" : "border-line"}`}>{f.age && <Icon name="check" size={13} />}</span>
          {t("booking.driverAge")}
        </label>
        {err("age")}
      </div>
    </div>,

    // 4 — summary
    <div key="s4">
      {car && (
        <div className="flex items-center gap-5 rounded-xl border border-line bg-surface p-4">
          <span className="block w-32 shrink-0 rounded-lg bg-[radial-gradient(ellipse_at_50%_40%,#2a2824,#101011)] p-2"><CarArt body={car.body} color={car.color} className="h-auto w-full" /></span>
          <div><p className="font-display text-2xl"><bdi>{carName(car)}</bdi></p><p className="text-sm text-muted">{t(`common.${car.category}`)} · {car.year}</p></div>
        </div>
      )}
      <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
        {([
          ["booking.when", `${f.from} → ${f.to} · ${days === 1 ? t("common.day") : t("common.days", { n: days })}`],
          ["booking.where", `${locLabel(f.pickup)} · ${f.time}`],
          ["booking.returnTo", locLabel(f.returnLoc === "same" ? f.pickup : f.returnLoc)],
          ["booking.driver", `${f.name} · ${f.phone} · ${f.email}`],
          ["booking.extrasTitle", f.extras.length ? f.extras.map((x) => t(`booking.extras.${x}.title`)).join(" · ") : "—"],
        ] as const).map(([k, v]) => (
          <div key={k} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"><dt className="text-muted">{t(k)}</dt><dd><bdi>{v}</bdi></dd></div>
        ))}
      </dl>
      <div className="mt-6 flex items-baseline justify-between">
        <span>{t("booking.calc.total")}</span><span className="font-display text-4xl text-accent-soft">{money(total)}</span>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted">{t("booking.terms")}</p>
    </div>,
  ];

  const titles = ["carTitle", "datesTitle", "extrasTitle", "contactTitle", "summaryTitle"] as const;
  const hints = ["carHint", "", "extrasHint", "contactHint", "summaryHint"] as const;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      {/* progress */}
      <nav aria-label={t("booking.step", { n: step + 1, total: 5 })} className="mb-10">
        <ol className="grid grid-cols-5 gap-2">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className="min-w-0">
              <button type="button" disabled={i > step} onClick={() => setStep(i)} className="group w-full text-start disabled:cursor-default">
                <span className={`block h-0.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-accent" : "bg-line"}`} />
                <span className={`mt-3 block text-[0.7rem] font-medium uppercase tracking-[0.15em] ${i === step ? "text-accent" : i < step ? "text-ink" : "text-muted/60"}`}>
                  <span className="me-1.5">{String(i + 1).padStart(2, "0")}</span><span className="hidden sm:inline">{s}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted sm:hidden">{steps[step]}</p>
      </nav>

      {/* mobile live total */}
      <div className="sticky top-[4.5rem] z-30 -mx-5 mb-8 flex items-center justify-between border-y border-line bg-bg/90 px-5 py-3 backdrop-blur-lg lg:hidden">
        <span className="min-w-0 truncate text-sm text-muted">{car ? <bdi>{carName(car)}</bdi> : t("booking.calc.selectCar")}</span>
        {car && <span className="font-display text-xl text-accent-soft">{money(total)}</span>}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-4xl outline-none sm:text-5xl">{t(`booking.${titles[step]}`)}</h2>
          {hints[step] && <p className="mt-3 text-muted">{t(`booking.${hints[step]}`)}</p>}
          <div className="mt-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0, x: locale === "ar" ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === "ar" ? 24 : -24 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                {stepContent[step]}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className={`${btn.ghost} ${step === 0 ? "invisible" : ""}`} disabled={step === 0}>
              <Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />{t("common.back")}
            </button>
            {step < 4 ? (
              <button type="button" onClick={next} className={btn.primary}>{t("common.next")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></button>
            ) : (
              <button type="button" onClick={confirm} className={btn.primary}>{t("booking.confirm")}<Icon name="check" size={16} /></button>
            )}
          </div>
        </div>
        <aside><div className="lg:sticky lg:top-28"><Estimate car={car} days={days} selected={f.extras} /></div></aside>
      </div>
    </div>
  );
}
