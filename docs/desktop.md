# Desktop UI Engineering Rules (1280px+)

> **The contract:** Desktop = everything at or above `xl:` (1280px). It is the **bento grid** — a two-dimensional, height-locked command deck (GridHero). It is not the mobile column, and it is not a tablet. The homepage is the only page that carries the grid; sub-pages (`/projects`, `/experience`, `/about`, `/resume`) are ordinary scroll pages that live outside this contract. Desktop is where the mouse exists, where hover means something, and where the layout is *allowed* to lock to the viewport — but only under two strict height modes. Below 1280px is mobile's job (`mobile.md`).

```
   1280px ───────────────────────────────────────────────────────▶
   DESKTOP BENTO GRID   columns: [minmax(0,1fr) · 240px · 240px · 240px]
   ┌─────────────────────────────────────────────────────────────┐
   │  Height mode A (≥768px tall):   LOCKED DECK                 │
   │    h-dvh · overflow-hidden      rows minmax(0,2fr)/minmax(0,1fr)
   │    capped at max-h-[900px]      all scrolling delegated inward
   │  Height mode B (≤767px tall):   SCROLL DECK                 │
   │    rows minmax(250px,55vh)_auto · the page scrolls          │
   └─────────────────────────────────────────────────────────────┘
```

These are **engineering rules** — the constraints that prevent the regret you already paid for on desktop (hardcoded heights, magic numbers, brittle layout math). Design is free; these rules are not.

---

## 1. Architecture & Structure

- **D1.1** `GridHero` (`app/components/GridHero.tsx`) is the only desktop shell. It composes the bento cells — `HeroSection`, `ExperienceCard`, `ProjectsDrawer`, `CommitFeed`, `GithubCalendar`, `LeetCodeWidget`, `CodeforcesWidget`, `GithubStatsWidget`. Widgets are leaves passed in as props (donut pattern), never imported into the shell and never composing each other.
- **D1.2** `app/page.tsx` is the single responsive switch between the desktop grid and the mobile shell — desktop behind `xl:`, mobile behind `xl:hidden`. No other file may decide which world renders. When both exist, `page.tsx` renders one inside the other's class gate and nothing else.
- **D1.3** One component per file. A widget's layout is its own; no widget contains another widget's grid or column.
- **D1.4** Widgets are **server components by default** — they fetch and render with zero client JS. Only interactive leaves (`GridHero`, `AnimatedCell`, `RetroCard`, `ProjectsDrawer`, `GithubCalendarUI`, `MagneticWrap`, `HeroSection`) get `"use client"`.
- **D1.5** Dead code gets deleted. If a component isn't wired into `page.tsx`, remove it — orphaned client components still ship JS and still get linted forever.

## 2. Sizing — Nothing Hardcoded

- **D2.1** The only fixed sizes in the whole system are deliberate grid constants: the **3×240px widget columns**, the **`max-h-[900px]` deck cap**, and the **`h-dvh`/`min-h-dvh` floor**. Everything else is fluid or clamped.
- **D2.2** Zero hardcoded content heights. A widget's height comes from its grid cell (the row track), never from `h-[400px]`. Content that outgrows its cell scrolls inside (`overflow-y-auto` + `min-h-0`); it never expands the track.
- **D2.3** Zero percentage heights on cells unless the track is definite. The old `style={{ height: "64%" }}` column stack (in the removed `Hero`) is the exact pain to never resurrect — a percentage against an `auto` parent collapses.
- **D2.4** Clamped fluid sizing is the desktop type system: `clamp(min, vh-driven, max)` for type and padding that must track deck height. Every `clamp()` **min is a `rem` value** so browser zoom scales it (WCAG 1.4.4 / MDN clamp guidance). Never a bare `vh` size.
- **D2.5** Spacing rhythm comes from the Tailwind scale and `globals.css` `@theme` tokens — never a per-component magic number.
- **D2.6** Fixed-pixel "instrument internals" — calendar 10px cells, LCD 9.5px segments, the calendar's `min-w-[640px]` canvas, `w-[30px]` axis gutter — are *constants inside a component of known width*, not layout. Their containers must be fluid (`w-full`, `min-w-0`).
- **D2.7** `min-w-0` on every flex/grid child that can hold long content (commit messages, repo names, URLs). The single most common missing piece that causes desktop overflow.

## 3. Breakpoint Discipline

- **D3.1** Exactly three structural gates: the `xl:` width gate (desktop vs mobile) and the two height-mode queries — `[@media(min-height:768px)]` (locked deck) and `[@media(max-height:767px)]` (scroll deck). No other gate may change the grid.
- **D3.2** `sm:`/`md:`/`lg:` inside desktop components are for **intra-widget detail** (stacking a widget's internal rows, `sm:flex-row`, `md:grid-cols-2` on sub-pages). They must never restructure the bento.
- **D3.3** Never add a new breakpoint to fix a widget that overflows. Fix the widget: `min-w-0`, fluid widths, internal scroll. A new breakpoint is a tablet layout in disguise.
- **D3.4** The bento degrades gracefully: below `xl:` the grid is `grid-cols-1`, so if the `xl:` gate is removed the deck still lays out as a single column.

## 4. Height Discipline — the 2fr/1fr Lesson

- **D4.1** The deck is **height-locked, not height-perfect**. When locked (mode A), the page itself does not scroll (`overflow-hidden`); all scrolling is delegated inward to widget scroll containers.
- **D4.2** Grid rows use `minmax(0, Xfr)` — never bare `fr` for the hero row. `2fr/1fr` with `auto` minimums is exactly what lets one tall widget blow out the whole deck. `minmax(0,2fr)` makes the track shrinkable.
- **D4.3** Every level between the viewport and a widget's scroll container carries `min-h-0`. Miss one link in the chain and the overflow escapes upward and the whole page scrolls — the classic `min-height: auto` flex/grid trap.
- **D4.4** The `max-h-[900px]` cap is non-negotiable: it stops the deck from stretching infinitely on large monitors. The deck always fits `min(viewport height, 900px)`.
- **D4.5** Widgets fill their cell: `h-full w-full`, content top-aligned, footer pinned via flex, middle region scrolls. A widget never sets its own height.

## 5. Viewport Units & Height Modes

- **D5.1** Never `100vh` on desktop. The deck shell uses `h-dvh`/`min-h-dvh`/`max-h-dvh` so it tracks the *visible* viewport (desktop browser chrome is real).
- **D5.2** The two height modes are a feature, not a hack: mode A (≥768px tall) → locked deck (`h-dvh`, `overflow-hidden`, rows `2fr/1fr`, cap 900px); mode B (≤767px tall) → scroll deck (`rows minmax(250px,55vh) auto`, page scrolls). Both must be tested at the boundary, 768px exactly.
- **D5.3** `min-h-svh` for anything that must fit the smallest viewport on load; `dvh` when a section should track live browser chrome.
- **D5.4** Safe-area insets (`env(safe-area-inset-*)`) are mobile concerns. Never let them leak into desktop paddings.

## 6. Pointer & Keyboard Interaction

- **D6.1** Desktop is mouse-first but never mouse-only. Every `:hover` change has a matching `:focus-visible`/`:focus-within` state. Hover is a preview; focus is a promise.
- **D6.2** Reveal-on-hover is allowed for *decoration only*. Anything that is information or a control — the ProjectsDrawer "EXPAND MONITOR" overlay, the calendar tooltip — must be discoverable without hover: visible by default, or reachable on keyboard focus. WCAG 1.4.13 (dismissible / hoverable / persistent).
- **D6.3** Never remove focus indicators. `focus:outline-none` on an interactive element is forbidden unless a custom focus style replaces it.
- **D6.4** Magnetic/nudge effects (`MagneticWrap`, translate-on-hover) are `transform`-only, spring-damped, and must never trap the pointer or move the hit area off the element.
- **D6.5** Hover shadow offsets (the `3px_3px_0_0` brand shadows) are `box-shadow` only — never layout-affecting properties — and are clipped with the `clip-margin-5` utility (`overflow: clip; overflow-clip-margin: 5px`) so they can't cause scrollbars.
- **D6.6** Animate only `transform` and `opacity`. No `top/left/width/height` transitions.

## 7. Performance — Core Web Vitals

- **D7.1** Targets (2026 thresholds, aim under not at): **LCP < 2.5s, INP < 200ms, CLS < 0.1**. Desktop is the first impression on recruiter laptops; it is also the ranking baseline Google uses for desktop queries.
- **D7.2** The desktop LCP is the hero name — text, not an image. Keep it in the initial SSR HTML: don't gate it behind client JS, and don't let framer-motion springs or the deck's `overflow-hidden` delay first paint.
- **D7.3** Autoplay video is the #1 desktop bandwidth killer. Any autoplay `<video>` must be: `muted` + `loop` + `playsinline` + a `poster` image, `preload="metadata"` (or gated behind an IntersectionObserver), WebM **and** MP4 sources, audio track stripped (`ffmpeg -an`), and **≤ 1–2MB**. A 13MB mp4 in the initial DOM is a self-inflicted LCP/INP tax (web.dev video-performance).
- **D7.4** Gate desktop-only heavy widgets (the project video previews) behind `matchMedia("(min-width: 1280px)")` so mobile never downloads them, and behind `prefers-reduced-motion: reduce` so the autoplay loop respects the user.
- **D7.5** First-load JS budget **< 200KB gzipped** (aim < 100KB). Track with `@next/bundle-analyzer` after each feature. One deck entrance animation, not a spring per cell.
- **D7.6** No long tasks. `GithubCalendarUI` recomputes ~365 days × weeks per platform switch — chunk or memoize heavy recomputes; every scroll/tap/mousemove handler is passive or throttled.
- **D7.7** Keep DOM lean: flat structure, < 1,500 nodes, selector depth ≤ 3. The calendar alone renders ~400 cells; every extra wrapper costs.

## 8. Images

- **D8.1** Use `next/image` for every raster image (there are none today — keep it that way). Never a raw `<img>`.
- **D8.2** Every image carries explicit `width` + `height` (or `fill` inside a sized `relative` parent). Missing dimensions = CLS.
- **D8.3** `sizes` on every responsive image matching the real cells (~240px columns, the fluid hero column) — never let the browser fetch a 2048px variant into a 240px cell.
- **D8.4** Configure `images.deviceSizes` in `next.config.ts` to match reality, and set `remotePatterns` narrowly. An empty `next.config.ts` means the defaults (huge device sizes, any remote image) are in force.
- **D8.5** Videos are the desktop's real "images". No poster today, single mp4, 13MB — poster + WebM + ≤1MB + `preload="metadata"` is the floor (see D7.3).

## 9. Fonts

- **D9.1** Keep `next/font` (`layout.tsx`: Inter, Playfair Display, Pirata One) — self-hosted, `font-display` swap with size-adjusted fallbacks, preloaded. This is the correct Next.js font system.
- **D9.2** DSEG7/DSEG14 (digital clock fonts) are decorative, self-hosted via `@font-face` in `globals.css` — fine, but they never block body text or the LCP.
- **D9.3** Desktop type scales with `clamp()`, and every clamp floor is `rem` so 200% browser zoom works. **No `text-[8px]`/`text-[9px]` magic values** — micro-labels below 1rem fall under the WCAG zoom floor; put them on a token scale with a rem minimum.
- **D9.4** Limit to the faces actually used above the fold. Every extra face competes with the LCP.

## 10. Overflow Prevention

- **D10.1** Never `100vw` where `100%` works. `100vw` includes the scrollbar and causes horizontal page scroll.
- **D10.2** `min-height: 0` on every flex/grid child in the height chain (repeat of D4.3) and `min-width: 0` on every long-content child (repeat of D2.7).
- **D10.3** Internal scroll containers: `overflow-y-auto` on the widget body, `overflow-x-auto` on the calendar's `min-w-[640px]` canvas. The scrollbar lives inside the widget, never the page.
- **D10.4** Long unbroken strings (commit messages, URLs, IDs) get `overflow-wrap: anywhere`, or `truncate` where single-line is required.
- **D10.5** One guard at the deck: `overflow-x-clip`/`overflow-x-hidden` as a safety net — but find and fix the real culprit, don't mask it.
- **D10.6** Debug ritual: test 1280×768, 1440×900, 1920×1080, 3840×2160, and 768px height exactly. Log every element wider than `document.documentElement.clientWidth`; fix the widest offender, never blanket `overflow-x: hidden`.

## 11. Server/Client Boundary (Next.js)

- **D11.1** Widgets are server components — they fetch and render with zero client JS (`CommitFeed`, `GithubStatsWidget`, `LeetCodeWidget`, `CodeforcesWidget`, `GithubCalendar` are all async server components).
- **D11.2** `"use client"` goes as deep as possible. `GridHero` is client only because it orchestrates motion; the data widgets stay server and are passed in as props (donut).
- **D11.3** No data fetching in `useEffect`. All fetches live in server components or `app/lib/api-fetchers.ts`.
- **D11.4** Heavy interactive things (the `GenieModal` + YouTube iframe) load with `next/dynamic` + `ssr: false` so they're not in the initial bundle.

## 12. Data — Single Source of Truth

- **D12.1** All content comes from `app/data/profile.ts` and `app/lib/api-fetchers.ts`. Zero content hardcoded in components.
- **D12.2** No hardcoded fallbacks in component files. Mock commits, default language bars, fake LeetCode totals, and hardcoded handles belong in `app/lib`/`app/data`, never in JSX.
- **D12.3** Derived shapes are derived in `app/data` or a lib constant — never inline magic values in JSX (e.g. the title→video-file mapping, or YouTube-id parsing duplicated across two components).

---

## First 3 Steps to Actually Start (Verify the Existing Deck)

1. **Run the height-mode matrix** — Test 1280×767 (mode B: scroll deck, rows `minmax(250px,55vh) auto`, page scrolls) and 1280×768 (mode A: locked deck, `h-dvh`, `overflow-hidden`, `2fr/1fr`, cap 900px). Both must render without clipping and without page-level scroll leaking into the deck. These two cases *are* the desktop contract.
2. **Audit the media budget** — DevTools Network at 1440×900. The project videos (`public/videos/jansamadhan.mp4` ≈ 13.6MB, `nyayaai.mp4` ≈ 2.8MB) must not download fully on first paint. Add `poster`, `preload="metadata"`, gate behind `matchMedia("(min-width: 1280px)")` + `prefers-reduced-motion`, strip audio, re-encode ≤1MB, and ship WebM+MP4.
3. **Harden the grid + a11y pass** — Walk every cell and confirm the `min-h-0` chain is unbroken (D4.3). Tab through the whole deck: every hover state has a focus-visible twin (D6.1), no `focus:outline-none` without a replacement (D6.3), and the "EXPAND MONITOR" overlay is keyboard-discoverable (D6.2). Then `npm run lint`, `tsc --noEmit`, and check the bundle with the analyzer before moving on.

> **Final guardrail:** when you're done, the mental test is — *delete every `[@media(min-height…)]`, `[@media(max-height…)]`, and `xl:` variant. If the grid still lays out as a usable single column, the desktop contract is holding.*
