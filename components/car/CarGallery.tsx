"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Car } from "@/data/fleet";
import { useApp } from "@/components/Providers";
import { CarImage } from "./CarImage";
import type { ArtView } from "./CarArt";

const views: ArtView[] = ["side", "rear", "detail"];

export function CarGallery({ car }: { car: Car }) {
  const { t } = useApp();
  const count = car.images?.length ?? views.length;
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <CarImage car={car} index={i} view={views[i] ?? "side"} priority sizes="(min-width:1024px) 60vw, 100vw" className="aspect-[16/10]" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label={t("car.gallery")}>
        {Array.from({ length: count }).map((_, k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={i === k}
            aria-label={t("car.view", { n: k + 1 })}
            onClick={() => setI(k)}
            className={`overflow-hidden rounded-xl border transition-all duration-300 ${i === k ? "border-accent" : "border-line opacity-60 hover:opacity-100"}`}
          >
            <CarImage car={car} index={k} view={views[k] ?? "side"} sizes="20vw" className="aspect-[16/10]" />
          </button>
        ))}
      </div>
    </div>
  );
}
