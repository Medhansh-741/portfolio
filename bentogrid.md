# Bento Grid Fix Plan

## Problem

The 4×2 bento grid at xl+ has two failures:

1. **Outer Frame (Dead Zone):** At 1280–1392px viewport width, `xl:px-0` removes horizontal padding while `max-w-[1392px]` is wider than the viewport → grid touches screen edges with 0px breathing room.

2. **Inner Discipline:** Row 1 uses `auto` (content-sized) + a media-query wrapper instead of a bounded fr-unit; cells have no `overflow-hidden`, allowing content to push beyond their bounds.

---

## Research Summary

| Source | Key Finding |
|--------|------------|
| Brainy.ink (bento guide) | "Surrounding margin ≥ 1.5× gutter"; "Inner padding ≈ 2× gutter" |
| Multiple industry examples | Fixed per-breakpoint gap preferred over vh-based; consistency over clamp |
| Tailwind docs + best practices | `gap` on parent, not margins on children; use spacing tokens |

---

## Proposed Changes (all in `app/components/GridHero.tsx`)

### 1. Outer Frame — Horizontal Padding

**File:** `GridHero.tsx`, line 25

```
- className="w-full px-6 md:px-12 xl:px-0 pt-3 md:pt-4 pb-6 ..."
+ className="w-full px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6 ..."
```

**Rationale:** Navbar uses `px-6 md:px-12` (24px → 48px). GridHero currently matches at mobile/md but drops to 0 at xl+. Removing the `xl:px-0` override lets `md:px-12` persist through xl+, guaranteeing min 48px breathing room at all viewports. The added `xl:pt-6` creates a clean 12→16→24 scaling ramp (`pt-3` → `md:pt-4` → `xl:pt-6`), matching the existing `pb-6` for vertical symmetry at xl+.

**max-w removed:** The inner `<div>` drops `max-w-[1392px] mx-auto`. At viewports > 1392px the grid simply fills the padded section width; at viewports < 1392px the padding guarantees breathing room. The viewport is locked at xl+ (`h-dvh` in layout.tsx), so ultra-wide content is inherently screen-bounded.

### 2. Gap — Use Fixed Token

**File:** `GridHero.tsx`, line 27

```
- gap-4 xl:gap-[clamp(0.5rem,2vh,1.5rem)]
+ gap-4
```

**Rationale:** The vh-based clamp causes inconsistent row bounding (gap changes with viewport height). `gap-4` (16px) is the codebase's universal spacing token (used by RetroCard p-4, mobile grid, etc.), gives a 3:1 surrounding-margin-to-gap ratio (48px ÷ 16px), and eliminates the media query dependency.

### 3. Row 1 — Keep Gate, Use `minmax(0,2fr)` (Protects Row 2)

**File:** `GridHero.tsx`, line 27

```
- xl:grid-rows-[auto_minmax(210px,1fr)] xl:[@media(min-height:768px)]:grid-rows-[minmax(auto,2fr)_minmax(210px,1fr)]
+ xl:grid-rows-[auto_minmax(210px,1fr)] xl:[@media(min-height:768px)]:grid-rows-[minmax(0,2fr)_minmax(210px,1fr)]
```

**Rationale:** The dual-definition pattern is retained — `auto` at xl+ is the fallback for short viewports where `fr` cannot resolve (resolves to 0). The `min-height:768px` gate activates `minmax(0,2fr)` only when the viewport has enough vertical space for the `fr` unit to compute correctly. The key change: gated row 1 goes from `minmax(auto,2fr)` to `minmax(0,2fr)`, giving a hard 2fr cap that prevents HeroSection content from over-expanding and squeezing Row 2. Row 2 gets its guaranteed min 210px + remaining 1fr. This is a protective measure **for** row 2, not against it.

**Does this damage row 2?** No — it does the opposite. Currently row 1 (`auto`) has no ceiling and can squeeze row 2. With `minmax(0,2fr)`, row 1 is bounded and row 2's minimum is always respected. At 1080p (≈693px main area after navbar), row 1 gets `(693-16)*2/3 ≈ 451px` — far more than HeroSection needs — so in practice row 1 gets plenty of space while row 2 is protected.

### 3b. Row-Level Bottom Alignment (Automatic via Grid)

All 4 cells in row 1 share the same grid-row definition, so they inherently share the same bottom horizontal axis. The HeroSection cell uses `justify-start`, which positions its *content* at the top of the cell, but the cell wrapper itself (`h-full`) spans the full row height — identical to columns 2/3/4. Their bottom edges are always aligned, regardless of content differences across columns.

### 4. Cell Wrappers — Add `overflow-hidden`

**File:** `GridHero.tsx`, lines 30–57

Add `overflow-hidden` to all 8 grid cell wrapper `<div>` elements.

**Before (each cell wrapper):**
```
<div className="h-full min-h-0 flex flex-col">
```

**After:**
```
<div className="h-full min-h-0 flex flex-col overflow-hidden">
```

For the row 1 hero cell (line 30), also add `min-h-0` for consistency:
```
- <div className="h-full flex flex-col justify-start">
+ <div className="h-full min-h-0 flex flex-col justify-start overflow-hidden">
```

**Rationale:** Bounds all cell content within the grid's allocated row/column. The GithubCalendarUI's `overflow-x-auto` scroll bar will still function because it creates its own scroll container within its child bounds; the parent `overflow-hidden` clips only the parent's box, not the child's internal scrollport.

### 5. Cell 0 (Hero) — Paragraph `max-w-prose`

**File:** `HeroSection.tsx`, paragraph `<p>` element

```
- <p className="text-justify w-full ...">
+ <p className="text-justify w-full max-w-prose ...">
```

**Rationale:** Without the `max-w-[1392px]` cap on the grid, column 1 at xl+ can reach ~1700px at ultra-wide viewports, causing the hero paragraph to exceed 120 characters per line. `max-w-prose` (65ch) caps line-length at the readability limit and automatically adapts to font-size changes. The `w-full` + `max-w-prose` combination works correctly — `width: 100%` fills up to the `max-width: 65ch` bound. No extra alignment utilities needed since `lg:items-start` on the parent keeps the paragraph left-aligned at lg+.

---

## Summary of Final Tailwind Classes on GridHero `<section>` and `grid`

| Property | Before | After |
|----------|--------|-------|
| Section padding | `px-6 md:px-12 xl:px-0 pt-3 md:pt-4 pb-6` | `px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6` |
| Inner max-width | `max-w-[1392px] mx-auto` | removed |
| Grid gap | `gap-4 xl:gap-[clamp(0.5rem,2vh,1.5rem)]` | `gap-4` |
| Grid rows | `xl:grid-rows-[auto_minmax(210px,1fr)] xl:[@media(min-height:768px)]:grid-rows-[minmax(auto,2fr)_minmax(210px,1fr)]` | `xl:grid-rows-[auto_minmax(210px,1fr)] xl:[@media(min-height:768px)]:grid-rows-[minmax(0,2fr)_minmax(210px,1fr)]` |
| Cell overflow | none on wrappers | `overflow-hidden` on all 8 wrappers |
| Hero `<p>` width | `w-full` | `w-full max-w-prose` |

---

## Verification

1. **No dead zone:** At 1280px viewport width, section padding = 48px each side, grid content = 1184px — no touch.
2. **Consistent gap:** All breakpoints use `gap-4`, no vh dependency.
3. **Row bounding:** Dual-definition — `auto` fallback for short viewports, `minmax(0,2fr)` gated at `min-height:768px`.
4. **Cell overflow:** All 8 cell wrappers have `overflow-hidden`; GithubCalendarUI internal `overflow-x-auto` scroll unaffected.
5. **Horizontal scrollbar:** GithubCalendarUI `min-w-[640px]` + `overflow-x-auto` pattern preserved.
