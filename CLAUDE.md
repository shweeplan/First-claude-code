# SHWY Studio: services website

Project context for Claude Code. Read this first. It carries over everything decided in the earlier cloud session.

## What this is

One long, scroll-driven, heavily animated 3D site that presents everything SHWY Studio offers and makes a visitor want to start a project. SHWY is a small freelance web studio that builds online stores and grows them with ads, SEO and marketing. Clients are worldwide (Gulf, Egypt, US, UK, Europe). The site is in English. Arabic is only listed as a capability (sales copy and work in Arabic), not a site language.

Inspired by the structure and feel of Shopify Editions Winter '26 (numbered chapters, sticky side nav, big display type, lots of motion). It must never copy their text, layout, assets, fonts or code. It must look like SHWY.

Tone: confident, plain-spoken, a little playful. No jargon walls. Offer in one line: Build. Get traffic. Sell. Grow. (plus Reports).

## Creative direction (decided)

- Ancient Egypt, pharaonic, refined and premium. No cartoon mummies, no kitsch, no stereotypes.
- Palette: sandstone and papyrus cream, deep brown, gold (accent and light, never big flat fills), lapis, turquoise, a little carnelian. Dark "tomb at night" sections for contrast. Brand base is warm cream and brown with a hand-drawn lowercase "shwy" wordmark with a gold underline stroke.
- Fonts (free, via Fontsource): Cinzel (display), Manrope (body), Caveat (wordmark).
- **Chapter numerals are invented carved digits 1 to 7, NOT Roman numerals.** The owner decided this because people would not understand real Egyptian numerals. Component: `src/components/ui/ChapterNumeral.tsx`, framed by `Cartouche.tsx`.
- Hieroglyph-style glyphs are decorative and never claimed to spell real words.
- The owner supplied reference photos (pyramids at dusk, Luxor pylon with colossi, Karnak ram-sphinx avenue at blue hour, a painted tomb-wall scene, Egyptian costume plate, Nile with feluccas). They are NOT in the repo (stock photos, licensing). Everything is generated in code: use them only as a mood reference, never copy or commit them.

## Chapters (exact service wording, do not add features)

Hero, then 1 Build, 2 Get traffic, 3 Sell, 4 Grow, 5 Reports, 6 Who it's for, 7 How we work + Start a project. All copy, links and colors live in `src/config/site.ts`. Edit copy there, not in components.

## Hard content rules

- Never invent clients, reviews, testimonials, case studies, logos, statistics or results. No fake numbers, no "trusted by" strip, no star ratings.
- No fixed prices anywhere. Pricing copy says we ask about business, products, deadline and budget before quoting.
- The only project that may be shown is the SHWY Store demo (a dark fashion e-commerce store), clearly labelled as a demo project made by SHWY, not a client.
- No claims of awards, certifications or partnerships.
- Every placeholder must be obviously a placeholder. Keep the list below current.
- Content is real HTML text, never baked into the canvas.

## Stack and layout

Next.js 15 App Router, TypeScript, Tailwind 3, three + React Three Fiber + drei + postprocessing, GSAP ScrollTrigger, Lenis.

- `src/config/site.ts`: copy, links, colors, chapters (single source of truth).
- `src/components/Experience.tsx`: Lenis + GSAP, tier detection, loader, sets `html[data-motion]`.
- `src/components/sections/`: HTML chapters. `Chapter.tsx` + `StageDriver.tsx` make each chapter a pinned scroll story (title card, then one feature per scroll step).
- `src/components/canvas/World.tsx`: one persistent canvas, camera rail through the world, sky, shadows, 3-light pool, adaptive quality, `?debug` overlay.
- `src/components/canvas/scenes/`: one scene per chapter (Hero, Build, Traffic, Sell, Grow + GrowLife, Reports, Who, Hall, Skyline).
- `src/components/canvas/Props.tsx`: stepped pyramids, carved obelisk, temple pylons, colossi, palms.
- `src/components/canvas/textures.ts`: procedural stone, relief, sand and painted-wall textures (no image files).
- `src/components/canvas/water.ts`, `Sky.tsx`, `lights.ts`: Nile shader, sky dome, fixed light pool.
- `src/app/api/contact/route.ts` + `src/lib/validate.ts`: contact form, validated on client and server.

Test modes by query string: `?tier=lite` (mobile look), `?tier=static` (no WebGL), `?tier=reduced` (reduced motion), `?debug` (fps, draw calls, triangles, textures, programs overlay).

Quality tiers: full (desktop), lite (touch, narrow, 4 or fewer cores), reduced motion, static. The page also downgrades itself: if full cannot hold about 40fps twice in a row it drops to lite, then lowers resolution.

## Placeholders (all still open)

1. Instagram handle `shwyystudio` is a guess (`links` in `src/config/site.ts`, also `instagramDm`).
2. LinkedIn URL is a fake placeholder.
3. Budget ranges in the form are "Not sure yet / Small / Medium / Large" with no amounts.
4. The contact form does NOT send anything: the API route validates, then only logs. Needs an email service (Resend, Postmark, SendGrid) or a webhook; the intended recipient is `links.email` (shweeplan@gmail.com). Add the key as an environment variable. Consider rate limiting or a captcha.
5. The comment-to-DM demo names and messages are made up and labelled as an illustration.
6. The SHWY Store mockup is an abstract stylised device, not a real site.
7. `CREDITS.md` lists fonts and libraries; everything else is generated in code.

The public contact email is shweeplan@gmail.com (owner requested it be shown). Everything else stays a placeholder until the owner supplies the real value.

## Known issues and open work

- **Performance is the main open problem.** The owner reports big fps drops after chapter 4 on a Windows PC (real GPU) and when scrolling fast. Already done: persistent hidden scenes with a shader warm-up behind the loader, no `backdrop-filter` blur, cached chapter metrics, a fixed pool of 3 point lights (`lights.ts`), cheaper Grow and hall, adaptive quality. Not yet verified on a real GPU. Next step: open `http://localhost:3000/?debug`, scroll to chapters 4 to 7, read fps, calls, triangles, textures and programs, and profile with Chrome DevTools Performance. Likely suspects: full-screen shaders (sky clouds, water, additive layers), shadows, bloom, high pixel ratio.
- Weak spots: sphinx heads read a bit like pots; the Reports scribe is crude blocks; the Who chapter shows part of the final hall behind it; the finished temple in Build hides behind the feature card at the last step; mobile views of the newer scenes are unchecked; Lighthouse not run.
- Quality comparisons made so far used a software renderer (no GPU). Real fps was never measured. Do not trust those numbers.

## Working rules

- Develop on branch `claude/brave-ramanujan-rjyjff`; commit with clear messages and push. Do not open a pull request unless asked. `main` only has the README.
- Before finishing: `npx tsc --noEmit`, `npx eslint .`, `npm run build` must all pass.
- On Windows PowerShell use `npm.cmd` (script execution is blocked): `npm.cmd install`, `npm.cmd run dev`.
- Do not deploy without asking.
- Match the surrounding code style. Keep changes small and finish every part of a task.

## Deployment (Vercel)

- Project `shwy-studio` (team scope `shweeplan-8619`). It was deployed from the GitHub repo `shweeplan/first-claude-code`, branch `claude/brave-ramanujan-rjyjff`.
- Vercel Authentication is ON, so the main address is behind a Vercel login wall. The owner shares the site privately through Vercel "shareable links" (the link carries a secret, never paste one into the repo). A new deployment needs a new shareable link.
- Do not make the site public until the placeholders above are resolved, unless the owner says so.
- Locally, deploy with the Vercel CLI (`npx vercel`) after the owner logs in, and only when asked.
