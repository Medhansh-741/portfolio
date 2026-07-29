# CSS Refactor Plan

## Goal
Replace brittle flexbox + hardcoded percentage heights with a CSS Grid layout, adding internal card scrolling. Keep Lenis root scroll — no viewport locking.

```
+-------------------------------------------------------------------------+
|                              NAVBAR                                     |
+-------------------------------------------------------------------------+

                <----------- max-w-[1392px] container ----------->
 
    Col 1 (1fr, fluid)      Col 2 (240px)   Col 3 (240px)   Col 4 (240px)
+------------------------+ +-------------+ +-------------+ +-------------+
|                        | |             | |             | |             |
|                        | |             | |             | |             |
|      HeroSection       | |             | |             | |             | Row 1
|      (Bio, Tagline,    | | Experience  | | Projects    | | Commit      | (2fr)
|       Buttons)         | | Card        | | Drawer      | | Feed        | ~66% H
|                        | |             | |             | |             |
|                        | |             | |             | |             |
|                        | |             | |             | |             |
+------------------------+ +-------------+ +-------------+ +-------------+
|                        | |             | |             | |             |
|     AnimatedCell       | | LeetCode    | | Codeforces  | | Git Stats   | Row 2
|    (GithubCalendar)    | | Widget      | | Widget      | | Widget      | (1fr)
|                        | |             | |             | |             | ~33% H
+------------------------+ +-------------+ +-------------+ +-------------+

+-------------------------------------------------------------------------+
|                 SKILL STRIP FOOTER (hidden xl:block)                    |
+-------------------------------------------------------------------------+
```


---

## What Stays the Same

| File | Reason |
|------|--------|
| `layout.tsx` | Structure stays `min-h-dvh flex flex-col` + Navbar. Only adds `SkillStrip` at bottom |
| `ReactLenisProvider.tsx` | Stays `<ReactLenis root>` — no change |
| `globals.css` | No viewport locking. Only removes `marquee-vertical` animation |
| `Navbar.tsx` | `sticky top-0` works as-is |
| `MagneticWrap.tsx` | No changes |
| `ThemeProvider.tsx` | No changes |
| `GithubCalendar.tsx` | No changes (async server component, stays as-is) |
| `GithubCalendarUI.tsx` | No changes ("use client" calendar UI) |
| `SkillStrip.tsx` | Moves to layout but component code unchanged |

---

## Phase 1 — Layout Gets a Footer

**File: `app/layout.tsx`**

Add import at top:
```tsx
import SkillStrip from "./components/SkillStrip";
```

Add `<SkillStrip />` inside the flex column, after `{children}`. Wrap it in a `hidden lg:block` div to hide it on small screens for now:
```tsx
<ThemeProvider>
  <ReactLenisProvider>
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      {children}
      <div className="hidden xl:block mt-auto">
        <SkillStrip />
      </div>
    </div>
  </ReactLenisProvider>
  <Analytics />
</ThemeProvider>
```

`SkillStrip` (marquee) now acts as the site-wide footer on desktop routes.

---

## Phase 2 — Homepage: Flex → CSS Grid

**File: `app/page.tsx`**

Full rewrite. Remove `<Hero>` wrapper and `<SkillStrip>`. Replace with 4-col × 2-row CSS Grid:

```tsx
import HeroSection from "./components/HeroSection";
import GithubCalendar from "./components/GithubCalendar";
import ExperienceCard from "./components/ExperienceCard";
import ProjectsDrawer from "./components/ProjectsDrawer";
import CommitFeed from "./components/CommitFeed";
import LeetCodeWidget from "./components/LeetCodeWidget";
import CodeforcesWidget from "./components/CodeforcesWidget";
import GithubStatsWidget from "./components/GithubStatsWidget";
import AnimatedCell from "./components/AnimatedCell";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden">
      <div className="flex-1 p-4 lg:py-6 lg:px-0">
        <div className="max-w-[1392px] mx-auto h-full">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_repeat(3,240px)] xl:grid-rows-[2fr_1fr] gap-4 xl:gap-6 h-full min-h-0">

            {/* Row 1 */}
            <div className="min-h-0 flex flex-col">
              <HeroSection />
            </div>
            <ExperienceCard delay={0.5} />
            <ProjectsDrawer delay={0.6} />
            <CommitFeed delay={0.7} />

            {/* Row 2 */}
            <div className="min-h-0 flex flex-col">
              <AnimatedCell delay={0.5}>
                <GithubCalendar />
              </AnimatedCell>
            </div>
            <LeetCodeWidget delay={0.55} />
            <CodeforcesWidget delay={0.65} />
            <GithubStatsWidget delay={0.75} />

          </div>
        </div>
      </div>
    </main>
  );
}
```

**Key details:**
- `overflow-hidden` on `<main>` — safety net to contain grid overflow
- `xl:px-0` — no horizontal padding at desktop (matches current `Hero.tsx` behavior)
- Padding only on mobile (`p-4`) — content is centered via `max-w-[1392px] mx-auto`
- `grid-cols-1` on mobile → vertical stack; `xl:grid-cols-[1fr_repeat(3,240px)]` on desktop → custom 4-column layout holding exact playing card widths
- `xl:grid-rows-[2fr_1fr]` — accurately recreates your 64% (tall top) / 32% (short bottom) visual split using solid Grid math instead of brittle inline styles
- `min-h-0` — allows grid items to shrink below content height (required for internal scroll)
- Grid auto-placement handles items perfectly: items 1-4 → Row 1, items 5-8 → Row 2

---

## Phase 2b — AnimatedCell Component

**File: `app/components/AnimatedCell.tsx`** (new)

Tiny `"use client"` wrapper for the GithubCalendar entrance animation (previously handled in Hero.tsx):

```tsx
"use client";

import { motion } from "framer-motion";

interface AnimatedCellProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedCell({ children, delay = 0 }: AnimatedCellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 flex flex-col min-h-0"
    >
      {children}
    </motion.div>
  );
}
```

(The card components — ExperienceCard, ProjectsDrawer, CommitFeed, etc. — already have their own entrance animations inside `RetroCard`'s `motion.div`, so they don't need wrapper.)

---

## Phase 3 — Extract HeroSection

**File: `app/components/HeroSection.tsx`** (new)

Extract the left-column bio content from the current `Hero.tsx`. Remove props, imports for cards, and the GithubCalendar wrapper. This component fills Col 1 Row 1 of the grid.

```tsx
"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";

export default function HeroSection() {
  return (
    <div className="h-full flex flex-col items-center lg:items-start justify-between gap-4">
      <div className="flex flex-col items-center lg:items-start w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-[2px] border-border shadow-sm mb-4"
        >
          <span className="w-1.5 h-1.5 bg-black animate-pulse" />
          Open to Internships & Full-Time Roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-gothic text-5xl md:text-7xl font-normal tracking-wide text-black dark:text-white leading-[0.9] cursor-default select-none"
        >
          {"Medhansh".split("").map((char, index) => (
            <span
              key={index}
              className="transition-all duration-300 hover:[text-shadow:0_0_15px_rgba(220,38,38,0.55)] dark:hover:[text-shadow:0_0_15px_rgba(0,255,65,0.75)]"
            >
              {char}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base font-bold tracking-widest text-muted-foreground uppercase mt-3"
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-3 text-left"
        >
          I build by jumping in headfirst — every project is an excuse to explore a stack I haven&apos;t mastered yet, a problem that feels just out of reach, or an architecture I haven&apos;t tried. I think in systems, not features: connecting ideas across AI, infrastructure, and full-stack to build solutions that hold up under pressure. I don&apos;t stay comfortable. I learn by doing, I ship fast, and I believe code should scale beyond its first use case.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4"
        >
          <MagneticWrap>
            <a href={`mailto:${profile.email}`}
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
            >
              <FiMail size={16} /> Contact Me
            </a>
          </MagneticWrap>
          <MagneticWrap>
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
            >
              <FiGithub size={16} /> GitHub
            </a>
          </MagneticWrap>
          <MagneticWrap>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
            >
              <FiLinkedin size={16} /> LinkedIn
            </a>
          </MagneticWrap>
        </motion.div>
      </div>
    </div>
  );
}
```

**File: `app/components/Hero.tsx`** — Delete (replaced by HeroSection.tsx).

---

## Phase 4 — RetroCard + Internal Card Scroll

### 4a. RetroCard

**File: `app/components/ui/RetroCard.tsx`**

Since the CSS Grid parent now dictates the exactly 240px width, remove the hardcoded `md:w-60` and rely on `w-full` and `h-full` so it fills its grid cell perfectly:
```tsx
className={`w-full h-full bg-card border-[3px] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--card-accent)] ${padding} flex flex-col justify-between overflow-hidden transition-all duration-200 select-none relative ${className}`}
```

### 4b. Universal scroll pattern

Every card wrapper now follows this structure:
```tsx
<RetroCard ...>
  <div className="flex flex-col h-full">
    <CardHeader ... />                         {/* flex-shrink-0 */}
    <div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent>
      {/* card body — scrolls when content exceeds cell height */}
    </div>
    <CardFooter ... />                         {/* flex-shrink-0 */}
  </div>
</RetroCard>
```

### 4c. Per-card changes

**ExperienceCard** (`app/components/ExperienceCard.tsx`):
- Wrap directory listings in `<div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent>`
- Content structure: CardHeader → scrollable dir list → CardFooter

**ProjectsDrawer** (`app/components/ProjectsDrawer.tsx`):
- Remove the inner div's `h-[calc(100%-80px)]` and its `overflow-y-auto no-scrollbar`
- Remove `data-lenis-prevent` from the old inner div
- The new flex pattern in the outer wrapper now handles scrolling
- Remove duplicate `mt-3` from the scrollable area (RetroCard padding handles that)

**CommitFeed** (`app/components/CommitFeed.tsx`):
- Remove `marquee-vertical` class from the timeline container
- Remove the duplicated second copy of commits
- Remove `overflow-hidden` and `h-[calc(100%-80px)]` from the timeline wrapper
- Replace with `<div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent>`
- Keep the timeline line, commit entries, and relative time formatting

**LeetCodeWidget** (`app/components/LeetCodeWidget.tsx`):
- Wrap the stats content (`<div className="mt-3.5 flex flex-col gap-2 font-mono">`) in a scrollable area
- Content is small enough that scrollbar won't show normally — this is a safety net

**CodeforcesWidget** (`app/components/CodeforcesWidget.tsx`):
- Same pattern as LeetCodeWidget

**GithubStatsWidget** (`app/components/GithubStatsWidget.tsx`):
- Same pattern as LeetCodeWidget

---

## Phase 5 — Route Page Cleanup

Every sub-page uses `<main>` which conflicts with the fact that `layout.tsx` wraps children in a flex column. Change `<main>` to `<div>` and remove `min-h-screen`.

| File | Before | After |
|------|--------|-------|
| `about/page.tsx` | `<main className="min-h-screen bg-background">` | `<div className="bg-background">` |
| `projects/page.tsx` | `<main className="min-h-screen bg-background">` | `<div className="bg-background">` |
| `experience/page.tsx` | `<main className="min-h-screen bg-background">` | `<div className="bg-background">` |
| `resume/page.tsx` | `<main className="min-h-screen bg-muted">` | `<div className="bg-muted">` |
| `error.tsx` | `<main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">` | `<div className="bg-background flex items-center justify-center px-6 py-16">` |
| `not-found.tsx` | `<main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">` | `<div className="bg-background flex items-center justify-center px-6 py-16">` |

These pages now scroll within the existing Lenis root scroll.

---

## Phase 6 — Dead Code Removal

| Action | Detail |
|--------|--------|
| Delete `app/components/Hero.tsx` | Replaced by `HeroSection.tsx` |
| Delete `app/components/HomeNav.tsx` | Dead code — defined but never imported anywhere |
| Remove `@keyframes marquee-vertical` from `globals.css` | Lines 138-149. CommitFeed no longer uses marquee. Keep `marquee` (horizontal) — used by SkillStrip. |
| Remove `.marquee-vertical` class rules from `globals.css` | Lines 142-149. |
| Remove unused imports from `page.tsx` | `Hero`, `SkillStrip` no longer imported |

---

## Complete File Change Matrix

| # | File | Action | Complexity |
|---|------|--------|-----------|
| 1 | `app/layout.tsx` | Edit — add `import SkillStrip`, render after children | 🟢 |
| 2 | `app/page.tsx` | Rewrite — CSS Grid, new imports | 🔴 |
| 3 | `app/components/HeroSection.tsx` | **New** — extracted bio from Hero.tsx | 🟡 |
| 4 | `app/components/AnimatedCell.tsx` | **New** — "use client" motion wrapper | 🟢 |
| 5 | `app/components/Hero.tsx` | **Delete** | 🟢 |
| 6 | `app/components/HomeNav.tsx` | **Delete** | 🟢 |
| 7 | `app/components/ui/RetroCard.tsx` | Edit — add `h-full` | 🟢 |
| 8 | `app/components/ExperienceCard.tsx` | Edit — add scrollable content area | 🟡 |
| 9 | `app/components/ProjectsDrawer.tsx` | Edit — remove hardcoded heights, use flex scroll | 🟡 |
| 10 | `app/components/CommitFeed.tsx` | Edit — marquee → scrollable timeline | 🟡 |
| 11 | `app/components/LeetCodeWidget.tsx` | Edit — wrap in scrollable area | 🟢 |
| 12 | `app/components/CodeforcesWidget.tsx` | Edit — wrap in scrollable area | 🟢 |
| 13 | `app/components/GithubStatsWidget.tsx` | Edit — wrap in scrollable area | 🟢 |
| 14 | `app/about/page.tsx` | Edit — `<main>` → `<div>`, remove `min-h-screen` | 🟢 |
| 15 | `app/projects/page.tsx` | Edit — same | 🟢 |
| 16 | `app/experience/page.tsx` | Edit — same | 🟢 |
| 17 | `app/resume/page.tsx` | Edit — same | 🟢 |
| 18 | `app/error.tsx` | Edit — same | 🟢 |
| 19 | `app/not-found.tsx` | Edit — same | 🟢 |
| 20 | `globals.css` | Edit — remove `marquee-vertical` animation block (lines 138-149) | 🟢 |

**Total: 20 items** — 3 new files, 2 deletions, 15 edits.
