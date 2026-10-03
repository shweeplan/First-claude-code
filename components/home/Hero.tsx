"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useApp } from "@/components/Providers";
import { L, btn } from "@/components/ui/Link";
import { CarArt } from "@/components/car/CarArt";
import { BookingWidget } from "./BookingWidget";

export function Hero() {
  const { t, locale, raw } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const carX = useTransform(scrollYProgress, [0, 1], [0, locale === "ar" ? -140 : 140]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const words = t("hero.title").split(" ");
  const stats = raw<{ value: string; label: string }[]>("hero.stats");
  const enter = locale === "ar" ? -260 : 260;

  return (
    <section ref={ref} className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* backdrop */}
      <motion.div aria-hidden="true" style={{ y: glowY }} className="absolute inset-0 -z-20 bg-[radial-gradient(55%_60%_at_72%_42%,rgba(201,169,110,.22),transparent_70%),radial-gradient(40%_50%_at_10%_90%,rgba(201,169,110,.08),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-gradient-to-b from-[#0e0e10] via-bg to-bg" />
      {/* light streaks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {[22, 38, 61].map((top, i) => (
          <span key={top} className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60" style={{ top: `${top}%`, animation: `sweep ${9 + i * 3}s ${i * 2.4}s linear infinite` }} />
        ))}
      </div>
      {/* floor */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-[linear-gradient(to_top,rgba(0,0,0,.9),transparent),repeating-linear-gradient(90deg,rgba(255,255,255,.035)_0_1px,transparent_1px_90px)] [mask-image:linear-gradient(to_top,black,transparent)]" />

      {/* car */}
      <motion.div
        aria-hidden="true"
        style={{ x: carX }}
        className="pointer-events-none absolute bottom-[26%] end-[-4%] -z-10 hidden w-[78%] sm:block lg:end-[1%] lg:bottom-[20%] lg:w-[56%]"
      >
        <motion.div initial={{ x: enter, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}>
          <CarArt body="suv" color="#26272b" view={locale === "ar" ? "side" : "rear"} className="h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,.7)]" />
        </motion.div>
      </motion.div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-10 pt-32 sm:px-8 lg:pt-36">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-6">
          {t("hero.eyebrow")}
        </motion.p>
        <h1 className="h-display max-w-3xl text-[3.1rem] leading-[1.02] text-balance sm:text-7xl lg:text-[6.5rem]" aria-label={t("hero.title")}>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }} className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {t("hero.subtitle")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9 }} className="mt-9 flex flex-wrap gap-3">
          <L href="/fleet" className={btn.primary}>{t("hero.ctaPrimary")}</L>
          <L href="/contact" className={btn.ghost}>{t("hero.ctaSecondary")}</L>
        </motion.div>
        <motion.div aria-hidden="true" initial={{ x: enter / 2, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className="-mx-3 mt-10 sm:hidden">
          <CarArt body="suv" color="#2c2d32" view={locale === "ar" ? "side" : "rear"} className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.7)]" />
        </motion.div>
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} className="mt-12 hidden gap-12 sm:flex">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd><span className="font-display text-4xl text-accent-soft">{s.value}</span><span className="mt-1 block text-xs tracking-wider text-muted">{s.label}</span></dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 sm:pb-12">
        <BookingWidget />
      </motion.div>
    </section>
  );
}
