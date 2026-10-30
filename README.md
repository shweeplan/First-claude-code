# SHWY Studio: services website

One long, scroll-driven 3D page (Next.js 15, React Three Fiber, GSAP, Lenis, Tailwind).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

Test modes with query strings: `?tier=lite` (mobile scene), `?tier=static` (no WebGL), `?tier=reduced` (reduced motion).

## Edit

- **All copy, links, colors:** `src/config/site.ts`. Contact links are in `links` at the top.
- **3D scenes:** `src/components/canvas/scenes/` (one file per chapter). Scene positions: `SCENE_Z` in `shared.ts`.
- **Camera path:** `useRail()` in `src/components/canvas/World.tsx`.
- **Chapters (HTML):** `src/components/sections/`. Page order: `src/app/page.tsx`.

## Modes

| Mode | Trigger | Behaviour |
|---|---|---|
| full | desktop with WebGL | bloom, vignette, grain, dense dust, DPR up to 1.5 |
| lite | touch device, width < 820px, 4 or fewer cores | no postprocessing, fewer particles and segments, DPR 1 |
| reduced motion | `prefers-reduced-motion` | no smooth scroll, no reveals, still camera, hero scene only, render on demand |
| static | no WebGL | CSS gradient background, all content stays readable |

## Connect the contact form

`src/app/api/contact/route.ts` validates on the server (same rules as the client, in `src/lib/validate.ts`) and then only logs. It does **not** send anything. Replace the marked block with an email service (Resend, Postmark, SendGrid) or a webhook, and add its API key as a Vercel environment variable. Consider adding rate limiting or a captcha before launch.

## Deploy

Standard Vercel Next.js project, no extra config. Not deployed yet.
