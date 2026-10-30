"use client";
import { useEffect, useState } from "react";
import { commentDemo as d } from "@/config/site";

/** Plain React/CSS illustration of comment-to-DM. Not a real account. */
export default function CommentDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(3);
      return;
    }
    const t = setInterval(() => setStep((s) => (s + 1) % 5), 1700);
    return () => clearInterval(t);
  }, []);
  const show = (n: number) => `transition-all duration-500 ${step >= n ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;
  return (
    <figure className="grain relative overflow-hidden rounded-3xl bg-night/85 p-6 text-papyrus on-dark" data-reveal>
      <figcaption className="mb-4 flex items-center justify-between text-xs uppercase tracking-widest text-gold-light">
        <span>Comment to DM</span>
        <span className="rounded-full border border-gold-light px-3 py-1">Illustration</span>
      </figcaption>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-ink/70 p-4">
          <p className="text-sm font-semibold">Post</p>
          <p className="mt-1 text-sm text-sand">{d.postCaption}</p>
          <div className={`mt-4 rounded-xl bg-brown/60 p-3 text-sm ${show(1)}`}>
            <b>{d.user}</b> {d.comment}
            <div className={`mt-2 border-l-2 border-gold pl-3 text-sand ${show(3)}`}><b>shwy_example</b> {d.reply}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-ink/70 p-4">
          <p className="text-sm font-semibold">Direct message</p>
          <div className={`mt-4 max-w-[90%] rounded-2xl rounded-bl-sm bg-lapis p-3 text-sm ${show(2)}`}>{d.dm}</div>
        </div>
      </div>
      <p className="mt-4 text-xs text-sand">Example only. Names and messages are made up.</p>
    </figure>
  );
}
