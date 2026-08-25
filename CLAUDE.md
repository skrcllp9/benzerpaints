# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Benzer Paints, built with React 19 + Vite (JS, not TS). No router, no state library, no backend — it's a single-page scroll experience.

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
- `src/animation.js` is a singleton: it creates one `Lenis` smooth-scroll instance, registers GSAP's `ScrollTrigger`, and wires `Lenis` → `ScrollTrigger` → `gsap.ticker` together. It exports the `lenis` instance as default; components import it directly (e.g. `Header.jsx` calls `lenis.stop()`/`lenis.start()` to lock scroll while the mobile menu is open) instead of creating their own instance.
- `src/App.jsx` is just `<Header /><Homepage /><Footer />` — there's no routing; new pages/sections get added by extending this composition and `src/pages/`.
- Components live under `src/components/<Name>/<Name>.jsx` each paired with a co-located `<name>.css` imported directly by the component (e.g. `header.css`, `footer.css`). Page-level sections (`src/pages/Homepage.jsx`) instead rely on the global `src/custom.css` / `src/index.css` for styling rather than a co-located stylesheet.
- Global CSS custom properties (brand colors, font stacks) are defined once in `:root` in `src/index.css` (`--text-brown`, `--head-black`, `--blue`, `--beige`, etc.) — reuse these tokens rather than hardcoding colors.
- Scroll-driven animation is built with raw GSAP `ScrollTrigger` timelines inside `useEffect` + `gsap.context(...)` (for scoped cleanup via `ctx.revert()`), not a declarative animation library. See `Homepage.jsx` for two non-trivial patterns worth understanding before touching them:
  - The hero uses a manually reserved `.hero-scroll-space` element (sized in CSS) instead of GSAP's `pin: true`, and toggles the hero between `fixed`/`absolute` itself inside the timeline's `onUpdate`, to avoid double-reserving scroll space. It also respects `prefers-reduced-motion` by short-circuiting to a static layout.
  - The product gallery is a pinned horizontal-scroll track driven entirely by vertical scroll (`ScrollTrigger` with `pin: true` translating `x` on the track) — there is no native horizontal overflow anywhere.
  - Both use `gsap.context()` scoped to a ref and `return () => ctx.revert()` for cleanup — follow this pattern for any new scroll animation to avoid leaking ScrollTriggers on remount (relevant under `StrictMode`, which double-invokes effects in dev).
- Static assets (images, icons, fonts, favicons) live in `public/` and are referenced by root-relative path (e.g. `/images/interior.avif`, `/icons/benzer-logo.png`) — not imported through the JS module graph.
- `dist/` is a committed-looking build output directory but is git-ignored; don't hand-edit it.

## Working with the animation code

When changing hero/scroll-pin behavior, verify in an actual browser (`npm run dev`, resize to mobile width too) — GSAP/ScrollTrigger/Lenis interplay (fixed/absolute swaps, pin math, reduced-motion fallback) isn't caught by lint. Past work in this repo iterated using small throwaway Playwright/Node scripts to check hero geometry, mobile menu timing, image dimensions (`sips -g pixelWidth -g pixelHeight ...`), and scroll handoff jitter — prefer that kind of direct, scripted visual verification over assuming CSS/JS changes behave correctly.
