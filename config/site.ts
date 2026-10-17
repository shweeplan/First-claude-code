/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL BRAND DETAILS
 *  Edit this file to rebrand the whole website (EN + AR).
 *  Nothing else in the codebase hardcodes the business name.
 * ─────────────────────────────────────────────────────────────
 */
export const siteConfig = {
  name: "Shwy",
  nameAr: "Shwy",

  contact: {
    phone: "[PHONE_NUMBER]",
    whatsapp: "[WHATSAPP_NUMBER]", // digits with country code, e.g. 201001234567
    email: "[EMAIL]",
    address: "[ADDRESS]",
    addressAr: "[ADDRESS]",
    hours: "09:00 – 23:00",
  },

  social: {
    instagram: "https://instagram.com/shwyystudio",
    instagramHandle: "@shwyystudio",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
    linkedin: "https://linkedin.com/",
  },

  /** Public URL used for SEO / Open Graph. Set NEXT_PUBLIC_SITE_URL on Vercel to override. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  /** 1 USD = X EGP, used by the optional USD price display. */
  usdRate: 50,

  /** Default message pre-filled in the WhatsApp chat (English / Arabic). */
  whatsappMessage: {
    en: "Hello {name}, I'd like to enquire about renting a car.",
    ar: "مرحباً {name}، أود الاستفسار عن استئجار سيارة.",
  },
} as const;

export const digitsOnly = (v: string) => v.replace(/\D/g, "");
export const whatsappLink = (text: string) =>
  `https://wa.me/${digitsOnly(siteConfig.contact.whatsapp)}?text=${encodeURIComponent(text)}`;
export const telLink = () => `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`;
export const mailLink = () => `mailto:${siteConfig.contact.email}`;
