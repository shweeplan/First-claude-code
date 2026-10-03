"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/fleet";
import { pickupOptions } from "@/data/locations";
import { addDaysISO, todayISO } from "@/lib/pricing";
import { useApp } from "@/components/Providers";
import { Icon } from "@/components/ui/Icon";
import { btn } from "@/components/ui/Link";

export function BookingWidget() {
  const { t, path } = useApp();
  const router = useRouter();
  const [loc, setLoc] = useState("cairo");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    const f = addDaysISO(todayISO(), 1);
    setFrom(f);
    setTo(addDaysISO(f, 3));
  }, []);

  const onFrom = (v: string) => {
    setFrom(v);
    if (to && v > to) setTo(addDaysISO(v, 1));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ location: loc, pickup: from, return: to });
    if (cat) q.set("category", cat);
    router.push(`${path("/booking")}?${q.toString()}`);
  };

  const label = "mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted";
  return (
    <form
      onSubmit={submit}
      aria-label={t("widget.title")}
      className="grid gap-4 rounded-2xl border border-white/10 bg-bg/70 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <div>
        <label htmlFor="w-loc" className={label}>{t("widget.pickup")}</label>
        <select id="w-loc" className="field" value={loc} onChange={(e) => setLoc(e.target.value)}>
          {pickupOptions.map((o) => <option key={o} value={o}>{t(`locationNames.${o}`)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="w-from" className={label}>{t("widget.pickupDate")}</label>
        <input id="w-from" type="date" className="field" value={from} min={todayISO()} onChange={(e) => onFrom(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="w-to" className={label}>{t("widget.returnDate")}</label>
        <input id="w-to" type="date" className="field" value={to} min={from || todayISO()} onChange={(e) => setTo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="w-cat" className={label}>{t("widget.category")}</label>
        <select id="w-cat" className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">{t("widget.anyCategory")}</option>
          {categories.map((c) => <option key={c} value={c}>{t(`common.${c}`)}</option>)}
        </select>
      </div>
      <button type="submit" className={`${btn.primary} sm:col-span-2 lg:col-span-1 lg:!min-h-12`}>
        {t("widget.search")}
        <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      </button>
    </form>
  );
}
