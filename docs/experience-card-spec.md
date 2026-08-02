# Experience Card — Interaction Spec

**Component:** Homepage Experience preview card
**Status:** Structure locked, visual polish TBD
**Last updated:** Aug 2026

---

## 1. Overview

The Experience card has two states:

1. **Normal state** — a static, readable list (default, always shown on mobile, default on desktop too)
2. **Game state** — a Tetris-inspired building + collapsing block toy (desktop only, opt-in via a Play button)

The normal state is the source of truth for content. The game state is a delight layer on top — it never gates access to information, it's purely for engagement.

---

## 2. Normal Card (default state — desktop + mobile)

Visually similar to the existing "Projects Cabinet" drawer pattern already on the site.

**Contents per experience entry:**
- Title (company/org name)
- Short description (1 line)
- Tools/stack used (tags)
- Certificate hyperlinks (if any)
- "View Details" link → `/experience`

**Behavior:**
- This is the card as it appears by default on both desktop and mobile.
- No animation, no game — fully scannable in a glance, matching how the Projects Cabinet card currently behaves.
- Identical on mobile — the game layer is **not** built for mobile, since a full interactive block game was judged too heavy/overwhelming for a small touch screen and a recruiter skimming quickly.

**Desktop-only addition:** a **Play** button on this card, which triggers the transition into Game State.

---

## 3. Transition: Card → Game

- Trigger: user clicks **Play** on the normal card (desktop only).
- Animation: the card **flips** (like a physical card turning over) to reveal the game view on its reverse face.
- After the flip completes, the game view is the only thing visible in that card's bounds — no leftover UI chrome, no terminal styling, no extra buttons. Just the game screen.

*(Open item, not blocking: whether there's a way to flip back to the normal card without navigating away — worth deciding during build, doesn't affect this spec.)*

---

## 4. Game State — Build Phase

### 4.1 Block shapes
- Inspired by Tetris, **not** using strict Tetris rules.
- Allowed shapes: **I, O, T, L, J**
- **S and Z are excluded** — their zigzag silhouette doesn't hold a clean horizontal engraving well, and excluding them was a deliberate simplification, not an oversight.

### 4.2 Block content
- Each block is engraved with **one company/experience name**, e.g. `DRDO`, `GEMINID`, `MEITY/AIKOSH`.
- Engraving text is **horizontal**, running straight across the piece's bounding box — it does not follow the piece's notch/elbow shape. This keeps implementation simple and keeps text legible regardless of which of the 5 shapes is used.
- No content lives "inside a sub-box" on the piece — the engraving treats the whole piece silhouette as the surface (like text engraved into a nameplate, not text boxed inside a shape).

### 4.3 Color
- **Randomized neo-brutalist palette on every load** — each time the game view is triggered, blocks get bold, flat, saturated colors reassigned at random (no fixed per-company branding).
- Colors are flat fills, black hard outlines, hard-offset shadows — consistent with the rest of the site's neo-brutalist language (see existing card treatments on homepage).

### 4.4 Auto-fall behavior
- On entering the game view, blocks **auto-drop from the top**, one at a time, and arrange into a stacked layout — loosely Tetris-like positioning, but with **no line-clearing** and **no "game over" state**.
- **This animation replays every time the card is flipped into game view** — it is not a once-per-session thing. Every visit to the game state = a fresh drop sequence with a freshly randomized color palette.
- The stack **stops generating once all experience entries have dropped** — there's no infinite fill, no risk of "topping out." The end state is simply: every experience is now a settled block on the board.

### 4.5 Internal scroll (scalability)
- As the stack height crosses **~75% of the card's visible height**, internal scrolling silently activates within the card (scrollbar hidden, scroll behavior still functional).
- This means the card scales gracefully as more experience entries are added over time, without needing to shrink block size or cut content.

---

## 5. Game State — Collapse Phase (interaction)

- **Trigger:** user clicks any settled block on the board.
- **Effect:** the **entire stack** collapses at once — full physics-style dramatic tumble/fall of all blocks together (not just the clicked block, not a partial collapse). Think: one nudge, whole structure gives way at once — a deliberate destructive flourish, not tied to any specific game's "removal" ruleset.
- **Navigation:** once the collapse plays out, the user is taken to the `**/experience**` page, **scrolled/anchored directly to the section for the specific company whose block was clicked** (not a generic landing on top of the page).
- The collapse animation doubles as a page-transition curtain — while blocks are tumbling, the destination page/section can be pre-fetched underneath so the transition feels instant once collapse finishes.

---

## 6. Mobile Behavior

- Mobile shows **only the Normal Card** (Section 2) — no Play button, no game view, no flip.
- Rationale: the block game requires screen real estate and drag/attention that doesn't translate well to a quick mobile scroll session; keeping mobile to the scannable list avoids overwhelming a smaller, faster-moving audience.

---

## 7. Design Rationale (for future reference)

Quick log of *why* key decisions were made, so this doesn't need to be re-litigated later:

- **Tetris over Jenga/Lego for the game shell:** Tetris has no real-world physical counterpart, so there's no tactile "muscle memory" to contradict when defining custom build/collapse physics. Jenga's actual rule is *removal*, not building — using it for an auto-*building* phase fights its own logic. Lego's stud-lock mechanic means real bricks resist separation; a one-click full collapse would read as "broken," not "dramatic," to anyone who's touched real Lego.
- **No line-clearing, no "game over":** a rising stack that can top out and end the game subconsciously reads as "losing," which is the wrong association for a growing career/experience list. Removing that state keeps the metaphor purely additive.
- **Collapse-as-transition:** since destruction was never bound to a specific game's rules to begin with, it's used purely as a physics-driven page-transition effect — dramatic, but semantically just "moving to the next page," not "erasing an accomplishment."
- **S/Z excluded:** kept purely for cleaner horizontal engraving across all block shapes.

---

## 8. Open Items (non-blocking, revisit during build)

- Exact flip-back mechanism from game view to normal card (if any), or whether navigating away is the only exit.
- Whether blocks drop in a fixed order (e.g. reverse-chronological) or randomized order each replay.
- Sound design (drop thuds, collapse crash) — visual-only vs. audio-supported.
- Exact easing/timing values for drop, settle, and collapse animations.
