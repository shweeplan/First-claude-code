"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mailLink, siteConfig, telLink, whatsappLink } from "@/config/site";
import { isEmail, isPhone, makeRef } from "@/lib/validate";
import { useApp } from "@/components/Providers";
import { btn } from "@/components/ui/Link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function ContactForm() {
  const { t, raw } = useApp();
  const [v, setV] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [er, setEr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ ref: string; name: string } | null>(null);
  const subjects = raw<string[]>("contact.subjects");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setV((p) => ({ ...p, [k]: e.target.value })); setEr((p) => ({ ...p, [k]: "" })); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (v.name.trim().length < 2) x.name = t("form.errName");
    if (!isPhone(v.phone)) x.phone = t("form.errPhone");
    if (!isEmail(v.email)) x.email = t("form.errEmail");
    if (v.message.trim().length < 5) x.message = t("form.errMessage");
    setEr(x);
    if (!Object.keys(x).length) setDone({ ref: makeRef("MSG"), name: v.name.trim().split(" ")[0] });
  };
  const label = "mb-1.5 block text-xs text-muted";
  const E = ({ k }: { k: string }) => er[k] ? <p id={`c-${k}-err`} role="alert" className="mt-1.5 text-xs text-[#e08b80]">{er[k]}</p> : null;
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-9">
      <h2 className="font-display text-3xl">{t("contact.formTitle")}</h2>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center" role="status">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent text-accent"><Icon name="check" size={26} /></span>
            <h3 className="mt-6 font-display text-3xl">{t("form.successTitle")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-muted">{t("form.successText", { name: done.name })}</p>
            <p className="mt-5 text-sm text-muted">{t("form.reference")}: <span dir="ltr" className="text-accent-soft">{done.ref}</span></p>
            <p className="mt-2 text-xs text-muted/70">{t("form.demoNote")}</p>
            <button type="button" className={`${btn.ghost} mt-8`} onClick={() => { setDone(null); setV({ name: "", phone: "", email: "", subject: "", message: "" }); }}>{t("form.another")}</button>
          </motion.div>
        ) : (
          <motion.form key="f" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="c-name" className={label}>{t("form.name")}</label><input id="c-name" className="field" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!er.name} aria-describedby={er.name ? "c-name-err" : undefined} /><E k="name" /></div>
            <div><label htmlFor="c-phone" className={label}>{t("form.phone")}</label><input id="c-phone" type="tel" dir="ltr" className="field text-start" autoComplete="tel" value={v.phone} onChange={set("phone")} aria-invalid={!!er.phone} aria-describedby={er.phone ? "c-phone-err" : undefined} /><E k="phone" /></div>
            <div><label htmlFor="c-email" className={label}>{t("form.email")}</label><input id="c-email" type="email" dir="ltr" className="field text-start" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!er.email} aria-describedby={er.email ? "c-email-err" : undefined} /><E k="email" /></div>
            <div><label htmlFor="c-subj" className={label}>{t("contact.subject")}</label><select id="c-subj" className="field" value={v.subject} onChange={set("subject")}><option value="">—</option>{subjects.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="sm:col-span-2"><label htmlFor="c-msg" className={label}>{t("contact.message")}</label><textarea id="c-msg" rows={5} className="field" value={v.message} onChange={set("message")} aria-invalid={!!er.message} aria-describedby={er.message ? "c-message-err" : undefined} /><E k="message" /></div>
            <div className="sm:col-span-2"><button type="submit" className={`${btn.primary} w-full sm:w-auto`}>{t("form.send")}<Icon name="arrow" size={16} className="rtl:rotate-180" /></button></div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const { t, raw } = useApp();
  const items = raw<{ q: string; a: string }[]>("contact.faq.items");
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-4xl px-5 pt-28 sm:px-8">
      <SectionHeading eyebrow={t("contact.faq.eyebrow")} title={t("contact.faq.title")} align="center" />
      <div className="mt-14 divide-y divide-line border-y border-line">
        {items.map((it, i) => {
          const on = open === i;
          return (
            <div key={it.q}>
              <h3>
                <button type="button" id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-start transition-colors hover:text-accent-soft">
                  <span className="font-display text-xl sm:text-2xl">{it.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-accent text-accent" : "border-line text-muted"}`}><Icon name="plus" size={16} /></span>
                </button>
              </h3>
              <motion.div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} initial={false} animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                <p className="max-w-2xl pb-7 leading-relaxed text-muted">{it.a}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ContactBody() {
  const { t, locale, brand } = useApp();
  const c = siteConfig.contact;
  const wa = whatsappLink(siteConfig.whatsappMessage[locale].replace("{name}", brand));
  const cards: { icon: IconName; label: string; value: string; href?: string; ltr?: boolean }[] = [
    { icon: "phone", label: t("contact.phone"), value: c.phone, href: telLink(), ltr: true },
    { icon: "whatsapp", label: t("contact.whatsapp"), value: c.whatsapp, href: wa, ltr: true },
    { icon: "instagram", label: "Instagram", value: siteConfig.social.instagramHandle, href: siteConfig.social.instagram, ltr: true },
    { icon: "mail", label: t("contact.email"), value: c.email, href: mailLink(), ltr: true },
    { icon: "pin", label: t("contact.address"), value: locale === "ar" ? c.addressAr : c.address },
    { icon: "clock", label: t("contact.hours"), value: t("contact.hoursValue", { hours: c.hours }) },
  ];
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {cards.map((k) => {
              const inner = (
                <span className="group flex items-center gap-5 py-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-accent transition-colors group-hover:border-accent">{<Icon name={k.icon} size={k.icon === "whatsapp" ? 20 : 19} />}</span>
                  <span className="min-w-0"><span className="block text-xs uppercase tracking-widest text-muted">{k.label}</span><span dir={k.ltr ? "ltr" : undefined} className="mt-1 block break-words text-lg">{k.value}</span></span>
                </span>
              );
              return <li key={k.label}>{k.href ? <a href={k.href} {...(k.icon === "whatsapp" || k.icon === "instagram" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block">{inner}</a> : inner}</li>;
            })}
          </ul>
          <p className="mt-6 text-sm text-muted">{t("contact.support")}</p>
        </Reveal>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </section>
      <FAQ />
    </>
  );
}
