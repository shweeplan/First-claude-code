"use client";
import { useState } from "react";
import { budgetRanges } from "@/config/site";
import { validateContact, type ContactErrors } from "@/lib/validate";

const fields = [
  { name: "name", label: "Your name", type: "text", auto: "name" },
  { name: "email", label: "Email", type: "email", auto: "email" },
  { name: "business", label: "Business name", type: "text", auto: "organization" },
  { name: "sells", label: "What do you sell?", type: "textarea", auto: "off" },
  { name: "deadline", label: "Deadline", type: "text", auto: "off" },
] as const;

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const v = validateContact(raw);
    setErrors(v.errors);
    if (!v.ok) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v.data) });
      if (res.status === 422) {
        const j = await res.json();
        setErrors(j.errors ?? {});
        setState("idle");
        return;
      }
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <p role="status" className="rounded-2xl border-2 border-gold p-6 text-lg">
        Thanks. Your message was received. (Placeholder: the form is not connected to email yet, so please also message us on Instagram.)
      </p>
    );

  const input = "mt-1 w-full rounded-xl border-2 border-gold/50 bg-ink/60 px-4 py-3 text-papyrus placeholder:text-sand/60 focus:border-gold-light";
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Start a project">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="text-sm font-semibold">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} rows={3} className={input} aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name] ? `${f.name}-e` : undefined} />
          ) : (
            <input id={f.name} name={f.name} type={f.type} autoComplete={f.auto} className={input} aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name] ? `${f.name}-e` : undefined} />
          )}
          {errors[f.name] && <p id={`${f.name}-e`} className="mt-1 text-sm text-[#ff9b86]">{errors[f.name]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="budget" className="text-sm font-semibold">Budget range</label>
        <select id="budget" name="budget" defaultValue="" className={input} aria-invalid={!!errors.budget} aria-describedby={errors.budget ? "budget-e" : undefined}>
          <option value="" disabled>Choose one</option>
          {budgetRanges.map((b) => <option key={b} value={b} className="text-ink">{b}</option>)}
        </select>
        {errors.budget && <p id="budget-e" className="mt-1 text-sm text-[#ff9b86]">{errors.budget}</p>}
      </div>
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-gold-light disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send"}
      </button>
      {state === "error" && <p role="alert" className="text-sm text-[#ff9b86]">Something went wrong. Please try again or message us on Instagram.</p>}
    </form>
  );
}
