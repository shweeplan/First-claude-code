"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { brands, categories, fleet, priceBounds, type Category } from "@/data/fleet";
import { useApp } from "@/components/Providers";
import { Icon } from "@/components/ui/Icon";
import { CarCard } from "@/components/car/CarCard";

type Sort = "featured" | "priceAsc" | "priceDesc" | "newest";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 text-sm transition-all duration-300 ${active ? "border-accent bg-accent text-[#14110b]" : "border-line text-muted hover:border-accent/60 hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

export function FleetBrowser() {
  const { t, money } = useApp();
  const params = useSearchParams();
  const initialCat = params.get("category");
  const [cats, setCats] = useState<Category[]>(categories.includes(initialCat as Category) ? [initialCat as Category] : []);
  const [brs, setBrs] = useState<string[]>([]);
  const [seats, setSeats] = useState(0);
  const [max, setMax] = useState(priceBounds.max);
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState(false);

  const toggle = <T,>(list: T[], v: T, set: (l: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const dirty = cats.length > 0 || brs.length > 0 || seats > 0 || max < priceBounds.max;
  const reset = () => { setCats([]); setBrs([]); setSeats(0); setMax(priceBounds.max); };

  const list = useMemo(() => {
    const l = fleet.filter((c) => (!cats.length || cats.includes(c.category)) && (!brs.length || brs.includes(c.brand)) && c.seats >= seats && c.daily <= max);
    const by: Record<Sort, (a: (typeof fleet)[0], b: (typeof fleet)[0]) => number> = {
      featured: () => 0,
      priceAsc: (a, b) => a.daily - b.daily,
      priceDesc: (a, b) => b.daily - a.daily,
      newest: (a, b) => b.year - a.year,
    };
    return [...l].sort(by[sort]);
  }, [cats, brs, seats, max, sort]);

  const label = "mb-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted";
  const panel = (
    <div className="space-y-8">
      <fieldset>
        <legend className={label}>{t("fleet.category")}</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => <Chip key={c} active={cats.includes(c)} onClick={() => toggle(cats, c, setCats)}>{t(`common.${c}`)}</Chip>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className={label}>{t("fleet.brand")}</legend>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => <Chip key={b} active={brs.includes(b)} onClick={() => toggle(brs, b, setBrs)}>{b}</Chip>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className={label}>{t("fleet.seats")}</legend>
        <div className="flex gap-2">
          {[0, 5, 7].map((n) => <Chip key={n} active={seats === n} onClick={() => setSeats(n)}>{n === 0 ? t("fleet.seatsAny") : t("fleet.seatsPlus", { n })}</Chip>)}
        </div>
      </fieldset>
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <label htmlFor="max-price" className={`${label} !mb-0`}>{t("fleet.maxPrice")}</label>
          <output htmlFor="max-price" className="font-display text-xl text-accent-soft">{money(max)}</output>
        </div>
        <input id="max-price" type="range" min={priceBounds.min} max={priceBounds.max} step={500} value={max} onChange={(e) => setMax(Number(e.target.value))} />
      </div>
      {dirty && <button type="button" onClick={reset} className="text-sm text-accent underline-offset-4 hover:underline">{t("fleet.reset")}</button>}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-14">
        <aside aria-label={t("fleet.filters")}>
          <button type="button" aria-expanded={open} aria-controls="filters" onClick={() => setOpen((o) => !o)} className="flex min-h-12 w-full items-center justify-between rounded-xl border border-line px-5 text-sm lg:hidden">
            <span className="inline-flex items-center gap-2"><Icon name="filter" size={16} />{t("fleet.filters")}{dirty && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}</span>
            <Icon name="chevron" size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <div id="filters" className={`${open ? "mt-6 block" : "hidden"} lg:sticky lg:top-28 lg:mt-0 lg:block`}>{panel}</div>
        </aside>

        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="text-sm text-muted" aria-live="polite">{list.length === 1 ? t("fleet.result1") : t("fleet.results", { n: list.length })}</p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-muted">{t("fleet.sortBy")}</label>
              <select id="sort" className="field !min-h-10 !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {(["featured", "priceAsc", "priceDesc", "newest"] as Sort[]).map((s) => <option key={s} value={s}>{t(`fleet.sort.${s}`)}</option>)}
              </select>
            </div>
          </div>
          <LayoutGroup>
            <motion.div layout className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((c, i) => <CarCard key={c.slug} car={c} priority={i < 3} />)}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line py-20 text-center">
              <p className="font-display text-3xl">{t("fleet.none")}</p>
              <p className="mt-3 text-muted">{t("fleet.noneHint")}</p>
              <button type="button" onClick={reset} className="mt-6 text-accent underline-offset-4 hover:underline">{t("fleet.reset")}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
