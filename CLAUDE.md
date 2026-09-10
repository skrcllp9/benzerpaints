# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Benzer Paints, built with React 19 + Vite (JS, not TS). No state library beyond React context (`AdminAuthContext`). Most pages are still a single long scroll page with no nested routing, but blogs and job postings are now backed by Supabase (Postgres + Auth + Storage) instead of static data, with an authenticated `/admin` panel to publish them — see "Backend (Supabase)" below.

## Commands

```bash
npm run dev       # start Vite dev server (default port 5173, falls back to 5174 if busy)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint over the whole repo
```

There is no test suite/runner configured. Verification is done by running the dev server and checking behavior in a real browser (see below).

## Architecture

- `src/main.jsx` mounts `<App />` and, critically, side-effect-imports `custom.css`, `responsive.css`, `custom.js`, and `animation.js` in that order — global styles/behavior are wired here, not per-component.
- `src/animation.js` is a singleton: it creates one `Lenis` smooth-scroll instance, registers GSAP's `ScrollTrigger`, and wires `Lenis` → `ScrollTrigger` → `gsap.ticker` together, plus a native `window` scroll listener as a fallback for scroll changes Lenis doesn't itself intercept (keyboard scroll, browser back/forward restoration, in-page anchors). It exports the `lenis` instance as default; components import it directly (e.g. `Header.jsx` calls `lenis.stop()`/`lenis.start()` to lock scroll while the mobile menu is open) instead of creating their own instance.
- `src/App.jsx` wraps everything in `BrowserRouter` with `<Header />`/`<Footer />` outside `<Routes>` and route pages (`Homepage`, `ContactPage`, `DealerInquiryPage`, all under `src/pages/`) switched inside it. Adding a page means adding both a `<Route>` here and a nav entry in `Header.jsx`'s `NAV_LINKS`. `vercel.json` rewrites all paths to `/index.html` so client-side routes work on refresh/deep-link in production — keep that in sync with any new top-level route.
- In `Header.jsx`'s `NAV_LINKS`, an `href` of `"/..."` is a real route rendered via `<Link>` (no full reload); `"#"` marks a nav entry for a page that doesn't exist yet. Don't turn a `"#"` into a real link without also adding the route in `App.jsx`.
- Components live under `src/components/<Name>/<Name>.jsx` each paired with a co-located `<name>.css` imported directly by the component (e.g. `header.css`, `footer.css`, `hero-banner.css`). Page-level sections (`src/pages/Homepage.jsx`, `ContactPage.jsx`, `DealerInquiryPage.jsx`) instead rely on the global `src/custom.css` / `src/index.css` for styling rather than a co-located stylesheet.
- Global CSS custom properties (brand colors, font stacks) are defined once in `:root` in `src/index.css` (`--text-brown`, `--head-black`, `--blue`, `--beige`, etc.) — reuse these tokens rather than hardcoding colors.
- Static reference data (e.g. the state → city cascade for the dealer inquiry form) lives in `src/data/*.js` as plain exported objects/arrays, not fetched from anywhere.
- Scroll-driven animation is built with raw GSAP `ScrollTrigger` timelines inside `useEffect` + `gsap.context(...)` (for scoped cleanup via `ctx.revert()`), not a declarative animation library. See `Homepage.jsx` and `HeroBanner.jsx` for non-trivial patterns worth understanding before touching them:
  - The hero (`HeroBanner.jsx`) uses a manually reserved `.hero-scroll-space` element (sized in CSS) instead of GSAP's `pin: true`, and toggles the hero between `fixed`/`absolute` itself inside the timeline's `onUpdate`, to avoid double-reserving scroll space. It also respects `prefers-reduced-motion` by short-circuiting to a static layout.
  - The product gallery in `Homepage.jsx` is a pinned horizontal-scroll track driven entirely by vertical scroll (`ScrollTrigger` with `pin: true` translating `x` on the track) — there is no native horizontal overflow anywhere.
  - Both use `gsap.context()` scoped to a ref and `return () => ctx.revert()` for cleanup — follow this pattern for any new scroll animation to avoid leaking ScrollTriggers on remount (relevant under `StrictMode`, which double-invokes effects in dev).
  - The header's mobile menu reveal (`Header.jsx`) animates a `progress` ref via GSAP rather than a CSS `transition`, specifically to avoid mobile-browser timing quirks on the first toggle — don't revert that to a plain CSS transition.
- Static assets (images, icons, fonts, favicons) live in `public/` and are referenced by root-relative path (e.g. `/images/interior.avif`, `/icons/benzer-logo.png`) — not imported through the JS module graph.
- `dist/` is a committed-looking build output directory but is git-ignored; don't hand-edit it.

## Backend (Supabase)

- `supabase/schema.sql` is the source of truth for the database — tables (`blogs`, `jobs`, `job_applications`, `admins`), Row Level Security policies, and the `blog-images`/`resumes` storage buckets. It's applied by hand via the Supabase Dashboard SQL Editor, not a migration tool — if you change the schema, update this file and tell the user to re-run the new statements themselves. `supabase/seed.sql` is optional demo content, safe to ignore.
- Access control is entirely RLS-based, not app-level: `public.is_admin()` (a `security definer` SQL function) checks the caller's JWT email against `public.admins`, and every admin-only policy calls it. There is no service-role key anywhere in this app — the client only ever uses the anon key (`src/lib/supabaseClient.js`, from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` in `.env.local`, gitignored). Never add a service-role key to client code.
- `src/lib/blogs.js` and `src/lib/jobs.js` are the only modules that call `supabase.from(...)` for those tables — public pages use the `fetchPublished*` functions (subject to the `published = true` policy), admin pages use the `fetchAll*Admin`/`create*`/`update*`/`delete*` functions (subject to `is_admin()`). Keep new data access going through these rather than calling `supabase` directly from a component.
- `src/context/AdminAuthContext.jsx` holds the Supabase auth session + admin-check state; the actual hook (`useAdminAuth`) and context object live in `src/context/adminAuthStore.js` instead, split out solely so `AdminAuthContext.jsx` exports only the `AdminAuthProvider` component (`react-refresh/only-export-components` fails a mixed-export file otherwise). `src/components/AdminGuard/AdminGuard.jsx` is the route guard used in `App.jsx` around every `/admin` route.
- A blog's `content` column is a JSON array of `{type: "paragraph", text}` / `{type: "image", src, caption}` blocks — `AdminBlogEditorPage.jsx`'s block editor produces this shape directly, and `BlogInnerPage.jsx` renders it directly; don't introduce a different content format (e.g. Markdown) without updating both ends.
- Job applications are intentionally one-way: anyone can `insert` into `job_applications` (anonymous resume upload + form submit from `JobApplicationPage.jsx`), but only `is_admin()` can `select` — there's no public "my applications" view, and there shouldn't be one without revisiting that policy.

## Working with the animation code

When changing hero/scroll-pin behavior, verify in an actual browser (`npm run dev`, resize to mobile width too) — GSAP/ScrollTrigger/Lenis interplay (fixed/absolute swaps, pin math, reduced-motion fallback) isn't caught by lint. Past work in this repo iterated using small throwaway Playwright/Node scripts to check hero geometry, mobile menu timing, image dimensions (`sips -g pixelWidth -g pixelHeight ...`), and scroll handoff jitter — prefer that kind of direct, scripted visual verification over assuming CSS/JS changes behave correctly.
