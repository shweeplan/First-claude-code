import { budgetRanges } from "@/config/site";

export type ContactInput = {
  name: string;
  email: string;
  business: string;
  sells: string;
  deadline: string;
  budget: string;
};
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form (client) and the API route (server). */
export function validateContact(input: Partial<Record<keyof ContactInput, unknown>>): {
  ok: boolean;
  errors: ContactErrors;
  data: ContactInput;
} {
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactInput = {
    name: s(input.name),
    email: s(input.email),
    business: s(input.business),
    sells: s(input.sells),
    deadline: s(input.deadline),
    budget: s(input.budget),
  };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100) errors.name = "Please enter your name.";
  if (!EMAIL.test(data.email) || data.email.length > 200) errors.email = "Please enter a valid email.";
  if (data.business.length < 2 || data.business.length > 150) errors.business = "Tell us your business name.";
  if (data.sells.length < 3 || data.sells.length > 600) errors.sells = "Tell us what you sell.";
  if (data.deadline.length < 2 || data.deadline.length > 100) errors.deadline = "When do you need it?";
  if (!(budgetRanges as readonly string[]).includes(data.budget)) errors.budget = "Pick a budget range.";
  return { ok: Object.keys(errors).length === 0, errors, data };
}
