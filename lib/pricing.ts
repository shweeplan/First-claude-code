import type { Car } from "@/data/fleet";
import { extras, type ExtraId } from "@/data/extras";

export function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.max(1, Math.round((b - a) / 86400000));
}

/** Best-rate calculation: months, then weeks, then days. */
export function rentalBreakdown(car: Car, days: number) {
  const months = Math.floor(days / 30);
  const weeks = Math.floor((days % 30) / 7);
  const rest = (days % 30) % 7;
  const total = months * car.monthly + weeks * car.weekly + rest * car.daily;
  return { months, weeks, days: rest, total, saved: days * car.daily - total };
}

export function extrasTotal(selected: ExtraId[], days: number) {
  return selected.reduce((sum, id) => {
    const e = extras.find((x) => x.id === id)!;
    return sum + (e.unit === "perDay" ? e.price * Math.max(days, 1) : e.price);
  }, 0);
}

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const addDaysISO = (iso: string, n: number) => {
  const d = new Date(iso || todayISO());
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
