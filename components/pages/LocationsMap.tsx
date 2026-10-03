"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { locations, type LocationId } from "@/data/locations";
import { useApp } from "@/components/Providers";
import { Icon } from "@/components/ui/Icon";

const X = (lon: number) => (lon - 24.5) * 44.5 + 20;
const Y = (lat: number) => (32 - lat) * 50 + 20;
const pts = (a: [number, number][]) => a.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(" ");

const outline: [number, number][] = [
  [25, 31.65], [26.5, 31.55], [28, 31.4], [29.2, 30.95], [29.9, 31.2], [30.5, 31.5], [31.2, 31.55], [32.2, 31.3], [33.5, 31.1], [34.25, 31.2],
  [34.9, 29.5], [34.65, 28.98], [34.5, 28.5], [34.25, 27.73],
  [33.6, 28.15], [33.0, 28.95], [32.65, 29.6], [32.55, 29.97],
  [32.5, 29.7], [32.75, 29.0], [33.1, 28.35], [33.6, 27.65], [33.8, 27.25], [33.95, 26.75], [34.9, 25.1], [35.48, 23.9], [36.9, 22],
  [25, 22],
];
const nile: [number, number][] = [[32.9, 24.1], [32.65, 25.7], [31.9, 26.5], [31.2, 27.2], [30.8, 28.5], [31.1, 29.4], [31.24, 30.05], [31.0, 30.8], [30.5, 31.45]];
const nile2: [number, number][] = [[31.24, 30.05], [31.6, 30.8], [31.8, 31.45]];

const alwaysLabel: LocationId[] = ["cairo", "alexandria", "hurghada", "sharm"];
const labelPos: Record<LocationId, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  cairo: { dx: 0, dy: 26, anchor: "middle" }, newCairo: { dx: 14, dy: -10, anchor: "start" }, sheikhZayed: { dx: -14, dy: -10, anchor: "end" },
  alexandria: { dx: -12, dy: -8, anchor: "end" }, hurghada: { dx: -14, dy: 4, anchor: "end" }, sharm: { dx: 14, dy: 4, anchor: "start" },
};

export function LocationsMap() {
  const { t } = useApp();
  const [sel, setSel] = useState<LocationId>("cairo");
  const cur = locations.find((l) => l.id === sel)!;

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {locations.map((l) => {
            const on = l.id === sel;
            return (
              <li key={l.id}>
                <button type="button" aria-pressed={on} onClick={() => setSel(l.id)} className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-start">
                  <span>
                    <span className={`block font-display text-3xl transition-colors duration-300 ${on ? "text-accent-soft" : "text-ink group-hover:text-accent-soft"}`}>{t(`locationNames.${l.id}`)}</span>
                    <motion.span initial={false} animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="block overflow-hidden">
                      <span className="block pt-2 text-sm leading-relaxed text-muted">{t(`locations.items.${l.id}.text`)}</span>
                      <span className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <span className="rounded-full border border-line px-3 py-1 text-muted">{t("locations.delivery")}: {l.id === "cairo" || l.id === "newCairo" || l.id === "sheikhZayed" ? t("locations.free") : t("locations.fee")}</span>
                        {l.airport && <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 text-accent"><Icon name="plane" size={13} />{t("locations.airportBadge")}</span>}
                        <a href={`https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-ink underline-offset-4 hover:text-accent hover:underline">
                          <Icon name="pin" size={13} />{t("locations.directions")}
                        </a>
                      </span>
                    </motion.span>
                  </span>
                  <Icon name="chevron" className={`text-muted transition-transform duration-500 ${on ? "rotate-180 text-accent" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative lg:sticky lg:top-28 lg:self-start">
        <div className="grain relative isolate overflow-hidden rounded-3xl border border-line bg-[radial-gradient(60%_60%_at_50%_35%,rgba(201,169,110,.1),transparent),#0e0e10] p-3 sm:p-6">
          <svg viewBox="0 0 605 565" role="img" aria-label={t("locations.mapLabel")} style={{ direction: "ltr" }} className="h-auto w-full">
            <defs>
              <pattern id="grid" width="44.5" height="50" patternUnits="userSpaceOnUse"><path d="M44.5 0H0V50" fill="none" stroke="#ffffff" strokeOpacity=".035" /></pattern>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e1e22" /><stop offset="1" stopColor="#141416" /></linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>
            <rect width="605" height="565" fill="url(#grid)" />
            <polygon points={pts(outline)} fill="url(#land)" stroke="#c9a96e" strokeOpacity=".45" strokeWidth="1.2" strokeLinejoin="round" />
            <polyline points={pts(nile)} fill="none" stroke="#c9a96e" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={pts(nile2)} fill="none" stroke="#c9a96e" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
            {locations.map((l) => {
              const on = l.id === sel;
              const lp = labelPos[l.id];
              const show = on || alwaysLabel.includes(l.id);
              return (
                <g key={l.id} onClick={() => setSel(l.id)} className="cursor-pointer" aria-hidden="true">
                  {on && <circle cx={X(l.lon)} cy={Y(l.lat)} r="14" fill="#c9a96e" opacity=".5" filter="url(#glow)" />}
                  {on && <circle cx={X(l.lon)} cy={Y(l.lat)} r="9" fill="none" stroke="#c9a96e" strokeWidth="1.2"><animate attributeName="r" values="7;18" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" /></circle>}
                  <circle cx={X(l.lon)} cy={Y(l.lat)} r={on ? 5.5 : 4} fill={on ? "#e6d3a8" : "#c9a96e"} stroke="#0b0b0c" strokeWidth="1.5" className="transition-all" />
                  {show && (
                    <text x={X(l.lon) + lp.dx} y={Y(l.lat) + lp.dy} textAnchor={lp.anchor}
                      fill={on ? "#f2efe9" : "#a39e94"} fontSize="15" fontFamily="var(--font-sans)" style={{ letterSpacing: 0 }}>
                      {t(`locationNames.${l.id}`)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-center text-xs text-muted">{t(`locationNames.${cur.id}`)} · {cur.lat.toFixed(2)}°N, {cur.lon.toFixed(2)}°E</p>
        </div>
      </div>
    </section>
  );
}
