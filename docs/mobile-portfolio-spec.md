# Mobile Portfolio — Structure & Interaction Spec

**Scope:** Mobile-first version of medhansh.kapoor
**Status:** Structure finalized, animation depth locked for card stack
**Last updated:** Aug 2026

---

## 1. Page Structure (top to bottom, homepage)

1. **Header** — clock, name, light/dark toggle (no hamburger — bottom bar covers all navigation, so a second nav mechanism would be redundant)
2. **Hero section** — intro copy + CTA buttons + Resume button
3. **Contribution graph** — with toggle (same concept as desktop widget)
4. **Playing-card stack** — dual-axis interactive Projects/Experience preview (see Section 3)
5. **Bottom bar** — persistent global navigation (see Section 2)

---

## 2. Bottom Bar (Global Navigation)

- **Persists across every page** — homepage, `/projects`, `/experience`, `/resume`, etc. Always visible, always the same four items, same position.
- **Items:** `Home` · `Resume` · `Projects` · `Experience`
- **Behavior:** each item is a full page navigation — no anchors, no scroll-jumping, no in-page state. Tapping "Resume" routes to a dedicated `/resume` page. Tapping "Projects"/"Experience" routes to their full listing pages (same destinations the card stack's "View Details" links already point to).
- **Role:** this is the accessible, always-available fallback to every gesture-based interaction elsewhere on the site. Nobody is ever gesture-locked out of content — if the card stack's swipe/tap interactions fail for any reason (motor impairment, unfamiliarity, preference), the bottom bar gets them everywhere the deck could.

---

## 3. Playing-Card Stack — Two Independent Axes

**Mental model:** not a single continuous gesture space — think of it as two separate physical actions that happen to live in the same spot on screen.

| Axis | Gesture | Meaning | Motion language |
|---|---|---|---|
| Horizontal | Swipe left/right | Next/previous **project** | "Cut the deck" — same deck, next card |
| Vertical | Swipe up/down | Switch between **Projects deck** and **Experience card** | "Swap the deck" — put this one down, pick up the other |

These two axes must *feel* different from each other so the mental model stays clean — same gesture shape (a swipe) but distinct visual language per axis.

### 3.1 Idle / Entry State
- On scroll-into-view, cards **deal in** one at a time from off-screen, settling with a slight overshoot-bounce (~150ms, ease-out-back) — not a static pop-in.
- Resting stack: top card centered and fully visible; 2nd card peeks ~10px behind at ~96% scale; 3rd card peeks further at ~92% scale. Depth over count — the goal is "there's more here," not showing an exact number.

### 3.2 Horizontal Swipe (Projects — next/previous)
- **Drag:** top card follows the finger 1:1 (translateX) with proportional rotation, capped at ~6°, for tactile "it's in my hand" feedback.
- **Release — commit:** past ~30% width *or* a fast-flick velocity threshold → card flies off in swipe direction (~200–250ms ease-in); next card scales up into position (~150ms ease-out).
- **Release — cancel:** under threshold → card springs back to center with a slight overshoot (spring physics, not a hard snap).
- **Loop, no bounce, no wall:** the card that flew off re-enters from the back of the stack on the opposite side — cycling feels like a continuous belt. A small position indicator (e.g. dots or "2/4") stays visible so looping doesn't disorient.
- **Accessibility — single-pointer alternative:** left/right arrow buttons at the card edges trigger the identical fly/settle animation on tap. Minimum touch target 44×44pt / 48dp.

### 3.3 Vertical Swipe (Projects ↔ Experience — "swap the deck")
- Deliberately distinct motion from the horizontal one — never a flip or rotation, so it can't be confused with card-to-card movement.
- **Outgoing:** current deck/card recedes — scales down to ~85%, fades, slides down and out (~200ms).
- **Incoming:** the other card/deck rises up from below into the same bounding box — slides up while fading/scaling in (~200ms), overlapping slightly with the outgoing motion for a crossfade rather than a hard cut.
- **Accessibility — single-pointer alternative:** a small "Projects | Experience" toggle/tab pair above or below the stack jumps directly, using the same recede/rise transition on tap.

### 3.4 Gesture-Hint Tutorial
- Fires **every time** the card section scrolls into view (not once-per-session).
- Runner-game style overlay: faint animated glyphs demonstrate horizontal first, then vertical. Fades after ~2.5s or on first real interaction, whichever comes first.
- Non-blocking — the deck is fully interactive underneath the hint from frame one; the hint never gates input.

### 3.5 Micro-interactions
- **Settle bounce** (~50ms overshoot) every time any card locks into place — used consistently across both axes as the universal "that landed" confirmation.
- **Self-nudge:** if no interaction occurs within ~4s of first load, the top card wiggles once on its own — a lightweight "I'm interactive" signal that doesn't require replaying the full tutorial overlay.
- **Haptic tick** (device vibration API) on release-commit, optional but recommended for real-device feel.

### 3.6 Easter Eggs
- **Rapid shuffle:** 3+ fast horizontal flicks within a second trigger a brief riffle/scatter-and-reassemble burst before resuming normal state.
- **Long-press flip:** long-pressing the top card flips it to reveal a small joke/fun-fact on the back, then flips back automatically.
- **Bounce-back reward:** swiping vertically twice in quick succession (deck → exp → deck) without pausing can trigger a small confetti/wink flourish — a reward for someone actively exploring rather than a discoverability requirement.

### 3.7 Accessibility Notes (non-negotiable, not optional polish)
- Every gesture-driven action has a tap-based equivalent achieving the identical result (arrows for horizontal, tabs for vertical) — matches WCAG 2.5.1 guidance that swipe-only interactions must ship with a single-pointer alternative.
- Minimum touch targets: 44×44pt (Apple HIG) / 48dp (Material) for all custom controls (arrows, tabs).
- The bottom bar remains a page-level fallback regardless of card-stack state — anyone who skips the deck entirely can still reach `/projects` and `/experience` directly.

---

## 4. Experience Card (within the vertical axis)

- On mobile, the Experience side of the vertical swap is the **normal list card** (title, short description, tools, cert links, "View Details" → `/experience`) — no Tetris-style game here (that's desktop-only; see separate Experience Card spec doc).
- Internally scrollable if content exceeds the card's visible height, consistent with the desktop card's scaling behavior.

---

## 5. Open Items (non-blocking, revisit during build)

- Exact icon/label styling for the bottom bar (icon-only vs. icon+label).
- Active-tab indicator style for the bottom bar.
- Whether the Home tab, when already on the homepage, scrolls to top or is a no-op.
- Exact easing curve values and durations — the numbers above are starting points, not final.
