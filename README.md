# Premium Car Rental — Demo Website (EN / AR)

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion. Bilingual (English + Arabic RTL), no backend.

## Run locally

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Change the business name & contact details

Edit **one file: [`config/site.ts`](config/site.ts)**: name (EN/AR), phone, WhatsApp, email, address, social links, USD rate and the WhatsApp greeting.
Replace the remaining `[PHONE_NUMBER]`, `[EMAIL]`, … placeholders. Nothing else hardcodes the brand.

Other content:

| What | Where |
| --- | --- |
| Fleet, prices, features, availability, **car photos** | `data/fleet.ts` (`images: ["/cars/x.jpg"]`, files in `public/cars/`) |
| Extras pricing (chauffeur, child seat, …) | `data/extras.ts` |
| All copy / translations | `messages/en.json`, `messages/ar.json` |
| Colours & fonts | `app/globals.css` (`@theme`), `app/[locale]/layout.tsx` |

## Deploy (Vercel)

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`) in the Vercel project for correct SEO / Open Graph URLs.
