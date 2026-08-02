# Mobile UI Engineering Rules (0–1279px)

> **The contract:** Mobile = everything below `xl:` (1280px). It is a **vertical-only, phone-first** build. No tablet layouts, no `sm:`/`md:` breakpoints inside mobile components. On any width below 1280px the design is one centered column; if the screen is wider, the column simply stays centered (ramx.in pattern). Above 1280px the existing desktop bento grid takes over.

```
0px ────────────────────────────── 1279px ──── 1280px ────────────>
  MOBILE: single centered column          DESKTOP: bento grid
  mx-auto max-w-2xl px-4                  (existing, untouched)
  NO breakpoints inside
```

These are **engineering rules** — the logical constraints that prevent the regret you had on desktop (hardcoded heights, magic numbers, brittle layout math). Design is free; these rules are not.

---

## 1. Architecture & Structure

- **R1.1** Keep desktop and mobile in separate component trees. Desktop components (`GridHero`, widgets, etc.) are not touched; mobile components live in `app/components/mobile/`.
- **R1.2** `app/page.tsx` is the **only** file that knows both worlds exist. It renders the desktop grid inside `hidden xl:flex` and the mobile shell inside `xl:hidden`. This is the single responsive switch for the whole homepage.
- **R1.3** Never create `app/mobile/` — that is a *route* (a URL), not a folder. `app/components/mobile/` is the folder.
- **R1.4** One component per file. Compose sections in `MobileHome.tsx` (the shell) — it renders sections, never the section logic itself.
- **R1.5** Do not reuse desktop widget components inside mobile just because they exist. If a widget doesn't fit the vertical narrative, build a mobile-specific one or drop it. Don't fight desktop markup into mobile slots.
- **R1.6** The shell and every section are **server components by default**. Only interactive leaves (menu toggle, any drawer, any accordion) get `"use client"`.

## 2. Sizing — Nothing Hardcoded

- **R2.1** The **only** fixed width in the entire system is the column cap. Everything inside is fluid.
- **R2.2** Zero fixed heights. No `h-[400px]`, no `h-[calc(...)]`, no `h-1/2`. Heights come from content. If a section must feel "full", use `min-h-svh` (viewport floor), never a locked height.
- **R2.3** Zero percentage heights. The desktop grid's `2fr/1fr` pain is exactly what mobile must never repeat. Single column → content defines height, always.
- **R2.4** Widths come from the column and the token scale: `w-full`, `max-w-prose`, `min-w-0`. No arbitrary `w-[123px]`.
- **R2.5** Spacing from the Tailwind scale only (`gap-4`, `py-8`, `p-4`). Any site-wide rhythm is a token in `globals.css` `@theme`, never a per-component magic number.
- **R2.6** Type mobile-first with tokens: base size first, scale up with `sm:` **only if a section genuinely needs it** (see R3.2). No `text-[15px]` magic values.
- **R2.7** `min-w-0` on every flex/grid child that can hold long content. This is the single most common missing piece that causes mobile overflow.

## 3. Breakpoint Discipline

- **R3.1** The only breakpoint in the whole system is the `xl:` desktop gate in `page.tsx`. Mobile components contain **no media queries at all**.
- **R3.2** No `sm:`/`md:` inside mobile components. If the design feels like it needs one, you are designing a tablet layout — stop and reflow the content instead. The column cap absorbs width variance for you.
- **R3.3** Rely on fluid/intrinsic behavior (flex, grid `minmax(0,1fr)`, `w-full`, `overflow-wrap`) rather than any breakpoint to absorb width changes.
- **R3.4** `hover:` styles do not exist on touch. If an interaction must be discoverable, make it visible by default — never reveal-on-hover (see Section 7).

## 4. Performance — Core Web Vitals

- **R4.1** Targets (2026 thresholds, aim under not at): **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1**. Mobile scores are 2–3x worse than desktop; mobile data is what Google ranks on.
- **R4.2** The desktop grid being `hidden xl:flex` still mounts and fetches on phones (CSS toggle tradeoff). Accept it for now; when mobile ships, gate heavy desktop widgets with a `matchMedia('(min-width: 1280px)')` mount guard (Option A+) or drop them from the mobile DOM.
- **R4.3** First-load JS budget: **< 200KB** gzipped (aim < 100KB). Track with `@next/bundle-analyzer` after each feature.
- **R4.4** No long tasks. Any handler that could run > 50ms gets chunked or deferred. Every scroll/tap handler is passive.
- **R4.5** Keep DOM lean: flat structure, < 1,500 nodes, selector depth ≤ 3. Every wrapper div costs layout time on low-end phones.
- **R4.6** `content-visibility: auto` (with `contain-intrinsic-size`) for long below-fold sections so the browser skips rendering them until near-viewport. Never skip the hero (it's the LCP).
- **R4.7** Only animate `transform` and `opacity`. Never `top/left/width/height`.

## 5. Images

- **R5.1** Use `next/image` everywhere (never raw `<img>`), except sub-1KB SVG icons/decoration.
- **R5.2** Every image carries explicit `width` + `height` (or `fill` inside a sized `relative` parent). Missing dimensions = CLS, the #1 mobile layout-shift cause.
- **R5.3** `sizes` prop on every responsive/`fill` image — e.g. `sizes="100vw"` for full-column, or `(max-width: 640px) 100vw, 42rem` matching the column cap. Without it the browser downloads desktop-sized images to phones.
- **R5.4** The LCP image (hero): `priority` (or `fetchPriority="high"`), never `loading="lazy"`, never `placeholder="blur"` (adds decode time). One priority image per page.
- **R5.5** All below-fold images: default lazy loading (built-in). Don't lazy-load the hero.
- **R5.6** Set `images.deviceSizes` in `next.config.ts` to match reality — your column caps at ~672px, so trim the huge 2048/3840 variants.
- **R5.7** Static imports for local images (auto width/height + blur placeholder). Configure `remotePatterns` narrowly, never wildcard domains.

## 6. Fonts

- **R6.1** Keep using `next/font` (already in `layout.tsx`) — it self-hosts, sets `font-display`, generates size-adjusted fallbacks, and preloads. This is the correct Next.js font system.
- **R6.2** Do **not** add `@font-face` + manual `font-display: swap` without a size-adjusted fallback — a metric-mismatched swap causes CLS.
- **R6.3** Limit to the font faces actually used above the fold. Every extra face competes with the LCP image for bandwidth on mobile.
- **R6.4** DSEG7/DSEG14 (your digital clock fonts) are already self-hosted via `@font-face` in `globals.css` — fine, but they're decorative; never let them block body text.

## 7. Touch & Interaction

- **R7.1** Touch targets: **≥ 44×44px** (Apple) / 48px (Android) for anything tappable, and ≥ 8px spacing between targets. In Tailwind: `h-11 w-11` minimum for icon buttons, `min-h-11` for inline controls. WCAG 2.5.5/2.5.8.
- **R7.2** Tap area ≠ visual size. An icon can be 16px visually inside a 44px hit area (padding on the button, not the icon).
- **R7.3** No hover-dependent UI. Anything revealed/changed by `:hover` must work by default on touch and for keyboard. Pair every `:hover` with `:focus-visible`/`:focus-within`.
- **R7.4** Use `active:`/pressed states for tap feedback, not `hover:`. A `:active` translate+shadow gives instant physical feedback.
- **R7.5** If you ever need input-capability detection, use CSS `@media (pointer: coarse)` / `any-pointer` — never user-agent sniffing. (Not needed at all if you follow R7.3.)
- **R7.6** Respect `prefers-reduced-motion`: gate the heavy framer-motion entrances behind it.

## 8. Overflow Prevention (the #1 mobile bug)

- **R8.1** Never size anything with `100vw` when `100%` will do. `100vw` includes the scrollbar and causes horizontal scroll.
- **R8.2** Global baseline already present + add as needed: `box-sizing: border-box` (Tailwind default), `img/video/iframe { max-width: 100% }`.
- **R8.3** `min-width: 0` on flex/grid children (repeat of R2.7 — it's that important).
- **R8.4** Long unbroken strings (URLs, code, IDs) get `overflow-wrap: anywhere`.
- **R8.5** Tables/code blocks scroll **inside their own wrapper** (`overflow-x-auto`), never force the page wider.
- **R8.6** One guard at the shell: `overflow-x-clip` (not `hidden`) on the mobile shell so a misbehaving child can't break the layout — but treat it as a safety net, not a fix. Find and fix the real culprit, don't mask it.
- **R8.7** Debug ritual: DevTools at ~320px, or run a snippet that logs every element wider than `document.documentElement.clientWidth`. Find the widest offender, fix its width — never blanket `overflow-x: hidden`.

## 9. Viewport Units & Safe Areas

- **R9.1** Never `100vh`. Use `100svh` for "fits the visible screen on load" or `100dvh` (with `100vh` fallback line first) when the section should track the browser chrome. On phones `100vh` is taller than the visible area → content hides behind the address bar.
- **R9.2** Prefer `min-h-svh`/`min-h-dvh` over locked heights (aligns with R2.2).
- **R9.3** Add `viewport-fit=cover` to the viewport meta and pad fixed/nav elements with `pb-[env(safe-area-inset-bottom)]` (and the other insets as needed) for notched phones. These are `0` on normal devices — safe to always apply.
- **R9.4** `overscroll-behavior: contain` on any internal scroll container (accordions, drawers) so scroll never chains to the page or triggers pull-to-refresh.
- **R9.5** The virtual keyboard does NOT resize viewport units by default. If you build forms, test on a real device; don't assume `dvh` shrinks for the keyboard.

## 10. Server/Client Boundary (Next.js)

- **R10.1** Server components by default — they ship **zero** JS to the client. Every section that just renders data stays a server component.
- **R10.2** `"use client"` goes as **deep as possible** — only the leaf that needs `useState`/effects/handlers. A `"use client"` on a wrapper turns its entire subtree into client JS. One bad directive can balloon a page from ~85KB to ~400KB.
- **R10.3** Client components render server components via the `children`/props "donut" pattern when needed. Never import a client-only library into a server component.
- **R10.4** Data fetching happens in server components or the existing `app/lib` fetchers — not in `useEffect`.
- **R10.5** Heavy interactive things (a drawer, a chart, a modal) load with `next/dynamic` + `ssr: false` so they're not in the initial bundle. Reserve `ssr: false` for things that only exist client-side.

## 11. Bundle Size & Code Splitting

- **R11.1** Import icons by name (`import { FiGithub } from "react-icons/fi"` — your codebase already does this; keep it). Never `import * as`.
- **R11.2** No barrel-file imports (`import { x } from "@/lib"` → import from the specific file).
- **R11.3** Animations: framer-motion is already a dependency (~30KB). Use it, but keep entrance animations on the hero only, and reuse the existing `AnimatedCell`/motion pattern rather than adding per-section variants. Gate behind `prefers-reduced-motion`.
- **R11.4** Every new dependency goes through bundlephobia before install. Every KB of JS ≈ 1ms of parse time on a phone.
- **R11.5** Route-based splitting is automatic. Within the homepage, split anything not visible on load with `next/dynamic`.

## 12. Data — Single Source of Truth

- **R12.1** All content comes from `app/data/profile.ts` (and the `app/lib` fetchers). Zero content hardcoded in components. Same data, new layout.
- **R12.2** If mobile needs a subset or reshaped version, derive it in `app/data` or a mobile-local constant — never inline magic values in JSX.

---

## First 3 Steps to Actually Start

1. **Create the shell** — `app/components/mobile/MobileHome.tsx`:
   ```tsx
   export default function MobileHome() {
     return (
       <div className="xl:hidden flex-1 bg-background overflow-x-clip">
         <div className="mx-auto w-full max-w-2xl px-4 py-8 flex flex-col gap-6">
           {/* build sections here — one file each, server components */}
         </div>
       </div>
     );
   }
   ```
   The `max-w-2xl mx-auto px-4` is the only fixed-width decision in the whole system. Below 1280px this is the entire skeleton.

2. **Wire the router** — `app/page.tsx` renders desktop inside `hidden xl:flex` and `<MobileHome />` beside it. Test at 1279px (mobile shell) and 1280px (desktop grid). This is the only responsive switch; from now on you never touch breakpoints again.

3. **Build sections bottom-up** — Hero → Nav → each content section, one file per section in `app/components/mobile/`, composed in `MobileHome.tsx`. Rule of thumb per section: server component, `w-full`, content-driven height, token spacing, no breakpoints, no hover-only UI, all data from `profile.ts`. Run `npm run lint` after each section and check the bundle with the analyzer before moving on.

> **Final guardrail:** when you're done, the mental test is — *disable all breakpoints in CSS. If the mobile page still works, it's genuinely mobile-first.*
