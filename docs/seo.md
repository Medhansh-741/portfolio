# SEO Master Checklist — medhanshk.me (On-Page + Technical, v2026)

An exhaustive, evidence-based audit checklist. Every section states the **signal**, the **rule**, and (where applicable) the **current state of this repo** with a `file:line` reference. Sources used are listed at the end.

How to read the status column:

- **DONE** — verified implemented and correct in the repo / production.
- **PARTIAL** — exists but incomplete or wrong.
- **MISSING** — not present at all.
- **N/A** — not applicable to this site (portfolio, 4 pages, no commerce, not multilingual).

> Baseline facts gathered 2026-08-09 → 2026-08-12:
> Production Lighthouse (**mobile**, throttled, LH 13.4.0) — the SEO-relevant run: Performance **93**, Accessibility **89**, Best Practices **96**, SEO **100**. LCP **2.9 s (fails the ≤2.5 s target)**, FCP 1.2 s, TBT 160 ms, CLS 0. LCP element = the `<h1>` "Medhansh".
> Production Lighthouse (**desktop**, unthrottled): Performance 97, Accessibility 88, Best Practices 96, SEO 100 — desktop numbers are UX-only; they are **not** used for ranking (mobile-only index).
> A11y failures differ by device — **mobile**: `aria-prohibited-attr` (60 skill-badge `<div aria-label>`s), `color-contrast` (1), `heading-order` (1), `svg-img-alt` (57 footer icons); **desktop**: `color-contrast` (6), `heading-order` (1), `link-name` (1), `svg-img-alt` (57).
> Best Practices dropped 100 → 96 in **both** runs: new `errors-in-console` (Minified React #418 hydration mismatch + message-port).
> `robots.txt` → **404**, `sitemap.xml` → **404** (confirmed against production via `curl`). **Lighthouse SEO 100 does not score robots.txt/sitemap/canonical/JSON-LD** — the §3.1–3.3 & §2.10 gaps still stand despite the 100.
> Production homepage has **two `<h1>`s** in the DOM (desktop + mobile variants) and **zero** `og:`, `twitter:`, `canonical`, `robots` meta, or JSON-LD tags.
> `www` → non-www (308), `http` → `https` (308). HSTS served by Vercel (but no `includeSubDomains`/`preload`). No CSP header.
> Google SERP (gl=us, 2026-08-14, live browser): bare "Medhansh Kapoor" → `medhanshk.me` **#4** (homepage) + `/resume` **#10**; "Medhansh Kapoor AI ML engineer" → **#1** (`/resume`), #3 (`/about`), #5 (`/projects`), #9 (`/experience`). **No knowledge panel.** Competing same-name entities — a medical student, a "Creative Technologist", a Delhi full-stack dev, and a filmmaker (`medhanshk.com` + Letterboxd "Whispering Shadows") — outrank the bare name, and your own LinkedIn ("India Innovates 2026 WINNER") is absent from page 1.

---

## 1. Choose the target entity & keywords first (foundation)

On-page SEO is meaningless without a target. This is a **personal-brand (entity) site**: the entity is "Medhansh Kapoor, AI/ML engineer & full-stack developer, Jaipur, India".

- [ ] One canonical identity (name + URL + handle) used identically in the site, JSON-LD, GitHub, LinkedIn, and everywhere else. Never mix "Medhansh Kapoor" / "medhansh" / "Medhansh k" on different pages.
- [ ] **Entity disambiguation is a first-class goal, not a nicety** — live Google shows 3+ other "Medhansh Kapoor" people (a medical student, a "Creative Technologist", a Delhi full-stack dev) plus a **filmmaker** who owns `medhanshk.com` + TMDB + Letterboxd ("Whispering Shadows"). You currently sit #4 for the bare name, below them. The disambiguation tools are: `Person` schema + `sameAs` + `disambiguatingDescription` (§2.10), and getting your own LinkedIn/GitHub cross-linked (`rel="me"`).
- [ ] Write down one primary keyword phrase per page:
  - `/` → "Medhansh Kapoor" (entity + brand) + secondary: "AI/ML engineer India", "portfolio".
  - `/projects` → "AI/ML projects", "full-stack projects portfolio".
  - `/experience` → "AI/ML engineer experience", "software engineering intern".
  - `/about` → "about Medhansh Kapoor", "AI engineer Jaipur".
- [ ] Pick 3–8 semantically related terms per page and place them naturally (e.g. RAG, LangGraph, geospatial, civic-tech on the appropriate pages). No keyword stuffing (density 0.5–2% is a guideline, never exceed naturally).
- [ ] Avoid keyword cannibalization: never let two pages target the same primary keyword.
- [ ] Target **search intent**: "Medhansh Kapoor" — navigational/brand intent; "AI/ML engineer India" — hiring-manager intent ("hire", portfolio, experience). Design content to answer both.
- [ ] Read the live SERP for each primary keyword before writing: note the winning content *type* (portfolio, job board, LinkedIn profile), *depth*, and *angle*; mirror the format that dominates (search-intent SERP analysis).
- [ ] Competitor keyword / content-gap analysis: pick 2–3 comparable AI/ML-engineer portfolios and record the keywords, pages, and content angles they rank for that you don't. Feed the gaps back into the keyword map above and into §5 (off-page).

---

## 2. On-page SEO checklist

### 2.1 Title tags (`<title>`)

The single highest-impact on-page element. One unique title per page; keyword near the start; 50–60 characters (≈600px); brand at the end after a pipe/dash; title should closely match the H1 to avoid Google's title-rewrite system (studies show Google rewrites a large share — ~61% in Zyppy's 2021 study — of titles that don't match the on-page content).

In Next.js App Router this is `metadata.title` (optionally `title: { template: "%s | Medhansh Kapoor" }`).

| # | Check | Status | Evidence / target |
|---|-------|--------|-------------------|
| T1 | Every page has a **unique** title, no duplicates | **PARTIAL** | `app/layout.tsx:26` sets one title; `/projects`, `/experience`, `/about` do **not** export `generateMetadata` → they inherit the homepage title → duplicate titles on 3 of 4 pages. **Live-confirmed on Google:** `/projects`, `/experience`, `/resume` all render the identical title "AI/ML Engineer & Full-Stack Developer - Medhansh Kapoor", while `/about` was rewritten by Google to "Driven by code, obsessed with craft." (pulled from its H1). |
| T2 | Primary keyword within the first 60 characters | **PARTIAL** | Home: "Medhansh Kapoor — AI/ML Engineer…" keyword is front-loaded (good). Sub-pages inherit "AI/ML Engineer & Full-Stack Developer" — not their topic. |
| T3 | Title 50–60 chars (avoid truncation) | **PARTIAL** | Home title is ~62 chars; sub-pages need their own. |
| T4 | Brand included at the end (`... \| Medhansh Kapoor`) | **MISSING** | Use a `.title` template instead of a static string. |
| T5 | Title matches H1 & body topic (reduces rewriting) | **PARTIAL** | Home H1 is "Medhansh" vs title "Medhansh Kapoor — …" (fine). Projects/About/Experience H1s ("Projects", "Driven by code…") currently have no titles at all. |
| T6 | Homepage uses `title.absolute` to avoid "Home | …" | **PARTIAL** | Not configured. |

### 2.2 Meta descriptions (CTR, not rank)

- [ ] One unique, accurate description per page, 120–160 chars (120 for mobile truncation).
- [ ] Contain the primary keyword naturally (Google bolds matches).
- [ ] Front-load the value: "AI/ML engineer building…", include a CTA ("Get in touch", "Explore the work").
- [ ] Don't repeat the title verbatim; avoid `&`, `+`, and em-dash overuse.

| # | Check | Status | Evidence |
|---|-------|--------|----------|
| M1 | Homepage description | **DONE** | `app/layout.tsx:28-29` — "Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Building production-grade AI agents, geospatial systems, and full-stack applications." (≈150 chars, good). |
| M2 | Per-page descriptions for `/projects`, `/experience`, `/about` | **MISSING** | No `generateMetadata` anywhere in `app/projects`, `app/experience`, `app/about`. |

### 2.3 URL slugs / URLs

- [ ] Short, lowercase, hyphenated, keyword-forward (`/projects` ✓, `/experience` ✓, `/about` ✓, `/resume.pdf` ✓).
- [ ] No params, hashes, uppercase, or `index.html` duplicates.
- [ ] One indexable version per URL (see canonicals / redirects in §3).
- [ ] Anchors used as deep-links have a matching `id` on the target.

| # | Status | Evidence |
|---|--------|----------|
| U1 | Slugs are clean & hierarchical | **DONE** | Routes: `/`, `/projects`, `/experience`, `/about`, `/resume.pdf`. |
| U2 | Deep links (`/projects#jansamadhan`, `/projects#nyayaai`) resolve to a real element | **MISSING** | `app/components/ProjectsDrawer.tsx:156` and `app/components/GenieModal.tsx:134` link to `/#…` but `app/projects/page.tsx` cards are `<h2>` without `id` → the anchor does nothing (no jump, no target element). |

### 2.4 Headings (H1–H6)

| Check | Rule | Status |
|-------|------|--------|
| H1 | **One H1 per page**; H1 wraps the main topic; H1 ≈ title tag ≈ keyword | **FAIL** | Homepage renders **two H1s**: desktop `app/components/HeroSection.tsx:20` (`Medhansh` split per char) and mobile `app/components/mobile/MobileHeroSection.tsx:21` (`Medhansh` per char). The mobile block is `xl:hidden` (CSS-hidden but present in DOM). `app/projects/page.tsx:30`, `app/experience/page.tsx:30`, `app/about/page.tsx:16` each have one H1 — good. |
| H2S | H2 = main sections, H3 = sub-sections; no skipped levels | **PARTIAL** | Projects/About/Experience use H2/H3 consistently; homepage content is cards using H3/H4 inside `GithubCalendarUI.tsx:265`, `GenieModal.tsx:126`, `MobileCardStackPlaceholder.tsx:40` — small structural wart; Lighthouse already listed `heading-order`. |
| H3 | Descriptive "answer-first" headings | **PARTIAL** | See §2.11 for AI-readiness version of this rule. |
| H4 | H1 visible text not hidden behind animation `opacity: 0` at parse | **DONE** | Google crawls DOM text; the per-char split is fine semantically, but keep the H1 readable in the DOM. |

### 2.5 Content quality, depth & E-E-A-T

Google's systems look for helpful, people-first content with demonstrated E-E-A-T: **Experience, Expertise, Authoritativeness, Trust** (trust is the most important). For an individual engineer site:

**Experience**
- [ ] First-person specifics you can't fake: exact stack, metrics (0.68 mAP50, SH call count), "I tried X, hit error Y, fixed by Z".
- [ ] Original artifacts: screenshots, architecture diagrams, your own benchmark numbers (your `docs/`, your GitHub numbers qualify).

**Expertise**
- [ ] Go one level deeper than generic: correct terms (LangGraph, RAG, PostGIS, YOLOv8 ONNX), caveats, "it depends on…".
- [ ] Accuracy and freshness: update broken project links, refresh "latest" claims.
- [ ] **Information gain / topical authority**: add something the top-ranking pages for your target keywords don't have (your own benchmark numbers, architecture diagrams, "I tried X, hit Y" specifics) rather than rehashing the same headings — the §1 SERP read tells you what's already covered.

**Authoritativeness**
- [ ] Named byline, face, bio on the about page; consistent identity everywhere.
- [ ] External you-channels that cross-link to `medhanshk.me`: GitHub, LinkedIn, maybe Medium, Dev.to, X. (This is off-page, but the **on-page mirror** is: `sameAs`, bylines, an `/about` that reads as a credible source.)

**Trust**
- [ ] Real contact info reachable (email + LinkedIn page). `app/data/profile.ts:4` email exists.
- [ ] Update timestamp and legal disclosure/policy pages (privacy) if you run forms.
- [ ] No dead links; each 404 (your own or external) erodes trust. Audit `resume.pdf` link and offer-letter Google Drive links — see §3.4.

| # | Status | Evidence |
|---|--------|----------|
| E1 | Author + real identity visible | **DONE** | Name on homepage and About page; email in `app/data/profile.ts:4`. |
| E2 | First-hand experience signals in content | **DONE** | `app/data/profile.ts` has detailed highlights/metrics per project/experience (0.68 mAP50, 256 tickets, SH filters, metrics). Strong E-E-A-T material — keep it on-page as visible text (it is). |
| E3 | Proof of visibility & public profile links | **PARTIAL** | Links to GitHub/LinkedIn exist as `<a>` but there is no `rel="me"` and no JSON-LD `sameAs`. |
| E4 | Press/awards mention | **PARTIAL** | `app/about/page.tsx` shows Achievements (India Innovates '26 Finalist, Prayatna 3.0) — great E-E-A-T; mirror them in schema, and in title/description where relevant. |

### 2.6 Images & media optimization

This repo has almost no `<img>` tags (all visuals are icon SVG / CSS; `next/image` import unused in `MobileCardStackPlaceholder.tsx`), but the rules apply when images are added, and **the videos need attention** (see 2.7).

- [ ] Descriptive filenames (`hero-medhansh-og.webp`, not `IMG_4512.jpg`).
- [ ] Descriptive, keyword-appropriate `alt` on meaningful images; `alt=""` for decorative ones (or `aria-hidden`).
- [ ] Explicit `width` + `height` (or CSS `aspect-ratio`) to prevent CLS.
- [ ] `srcset`/`sizes` for responsive images; `next/image` gives this free for local images.
- [ ] WebP/AVIF; compress; target ≤ ~100 KB per hero; never lazy-load the LCP image; LCP images get `fetchpriority="high"` + `<link rel="preload">`.
- [ ] **Videos**: `poster` attribute + `preload="metadata"`; below-fold videos get `loading="lazy"`; use a façade/click-to-play; the video reserves space (`aspect-video` already in `app/components/ProjectsDrawer.tsx:134`).

### 2.7 Video evidence

| # | Status | Evidence |
|---|--------|----------|
| V1 | Videos sized, compressed | **FAIL** | `public/videos/jansamadhan.mp4` ≈ 13.6 MB, `nyayaai.mp4` ≈ 2.8 MB. Raw screen-capture MP4s. `preload="auto"`, `autoPlay`, `loop` in `app/components/ProjectsDrawer.tsx:36-53` → the browser downloads both on a **desktop** homepage visit (confirmed: desktop total weight 7 MB). **Desktop-only risk** — the mobile run fetches **zero** `.mp4` (mobile total weight 439 KB, videos swapped out for a placeholder per §2.12 MO4). |
| V2 | `poster` present | **MISSING** | No `poster` attr on `<video>` (`app/components/ProjectsDrawer.tsx:36`). |
| V3 | `width`/`height` or aspect ratio | **PARTIAL** | `aspect-video` class present (good); no intrinsic sizes. |

### 2.8 Internal linking & anchor text

- [ ] Every page reachable from homepage ≤ 3 clicks. (This site: yes, all via nav.)
- [ ] Descriptive anchor text (never "click here").
- [ ] Enough, not spammy links (goal ≈ 1 link/100 words in prose).
- [ ] Highly-linked-to pages point to pages that need authority.
- [ ] No broken internal links.
- [ ] Footer/global nav includes the same accurate anchors on both desktop & mobile (mobile is a bottom bar — it mirrors desktop links, good).
- [ ] Fix the broken `#` anchors (see U2).

| # | Status | Evidence |
|---|--------|----------|
| L1 | Nav links | **DONE** | Desktop `app/components/Navbar.tsx:12-17`, mobile bottom bar `app/components/mobile/MobileBottomBar.tsx:15-21` (Home/Projects/Experience/Resume/About). |
| L2 | Home → pages CTAs | **DONE** | `app/components/HomeNav.tsx:8-12` (Projects / Experience / About), Hero CTA email/links. |
| L3 | Content-level internal links | **PARTIAL** | `GenieModal.tsx:134` + `ProjectsDrawer.tsx:156` link to `#`, but the target `<h2>` has no `id` → dead internal link (U2). |
| L4 | Anchor text descriptive | **PARTIAL** | "View Details ↗", "Return to Terminal" are fine; `Read Docs` (GenieModal) is slightly generic but acceptable. The `#` anchors break the semantic context. |

### 2.9 External/outbound links

- [ ] `target="_blank" rel="noopener noreferrer"` on every external tab (security; avoids tabnabbing + referrer leak). **Done** in most places: `HeroSection.tsx:77-78,87-88`, `Navbar.tsx:42,91-99`, `ProjectsDrawer`, `MobileHeroCTA`, `Resume.pdf` CTA, CommitFeed links, About certificate links (verified via grep for `rel="noopener noreferrer"`).
- [ ] `rel="me"` on your personal profile links (GitHub, LinkedIn) — **MISSING** (helps entity linking, §2.10).
- [ ] `rel="nofollow"` on any user-generated/comment links and affiliates (none here — N/A).
- Offer letters (Google Docs) are external, first-party-adjacent links; `nofollow` is optional.

### 2.10 Schema / structured data (JSON-LD)

Structured data is the single biggest missing SEO piece on this site. Zero `<script type="application/ld+json">` tags exist (grep returns none; production page head has none).

Recommended on this site (validate each in Google Rich Results Test):

| Type | Where | Purpose |
|------|-------|---------|
| `WebSite` + optional `SearchAction` | root layout | site identity; enables sitelinks search box |
| `Person` (with `sameAs`, `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `disambiguatingDescription`) | homepage + about | entity recognition; knowledge-panel prep; **disambiguation from the other "Medhansh Kapoor"s** (esp. the filmmaker at `medhanshk.com`); AI-search citation |
| `ProfilePage` (`mainEntity` → Person) | home/about | explicitly marks "this page is about a person" (Google's ProfilePage spec, `dateCreated`/`dateModified`) |
| `BreadcrumbList` | about/projects/experience | breadcrumbs (if you add crumbs) |
| `ItemList` / `CollectionPage` | `/projects` | lists all projects hierarchically |
| `SoftwareApplication` (per project) | `/projects` card / modal | if each project is app-like; works best for the RAG/demo tools |
| `Organization` | layout (footer) | only if you formalize a brand |
| `FAQPage` | if you add an FAQ block | note: Google deprioritized FAQ rich results in 2023 — only add if genuinely present |
| `VideoObject` | if you keep the `<video>`s | video rich result for demo videos |

Rules:
- [ ] Every node must be **valid** and validated on the live URL (Rich Results Test).
- [ ] **Schema–content alignment**: JSON-LD must match what's visible (e.g. don't mark VideoObject while the video is `preload="metadata"` and hidden; mark availability properly).
- [ ] `sameAs` list contains only URLs that genuinely identify the person (GitHub + LinkedIn).
- [ ] Use one consistent `@id` for the Person node everywhere (e.g. `https://medhanshk.me/#person`).
- [ ] Add `disambiguatingDescription: "AI/ML engineer & full-stack developer based in Jaipur, India"` so Google separates you from the filmmaker and other same-name people — and make sure your own LinkedIn profile is linked via `sameAs` (it currently doesn't surface on page 1).

| # | Status | Evidence |
|---|--------|----------|
| SS1 | Any JSON-LD anywhere | **MISSING** | Zero `ld+json` in repo or served HTML. |
| SS2 | `Person` + `Organization` + `WebSite` | **MISSING** | — |
| SS3 | Validations | **MISSING** (nothing to validate yet) | — |

### 2.11 Readability & AI/LLM + agentic-search readiness

AI search (ChatGPT Search, Perplexity, Gemini, Google AI Mode) is the new organic surface. It parses on-page formats:

- [ ] Section paragraphs start with an answer ("block-first headings") — make the first line of each H2 section answer its heading.
- [ ] Bullets, tables, short paragraphs (< ~300 words per section).
- [ ] High-level definition paragraph right after H1/H2.
- [ ] Visible dates everywhere; "last updated" visible on pages.
- [ ] Entity links `sameAs`, and define top terms.

Your content is bullet-heavy already (Experience highlights, metrics) — that's good. What's missing: visible dateModified / "last updated", and answer-first FAQ headings (nice-to-have).

### 2.12 Mobile vs desktop content parity (mobile-only indexing)

Google now indexes the mobile version only — mobile-first indexing completed its shift to **mobile-only** (2025–2026), so sites not accessible on mobile are no longer indexed. Both content trees must be identical in the DOM:

**Current bug**: the homepage has TWO H1s (desktop hero + mobile hero) — every section has strict `xl:` splits. The right fix is a single H1 in the DOM (e.g. keep the desktop H1 and mark the mobile one `sr-only`/hidden) OR share one hero. If you ever ship hi/low-content variants, mobile-first parity requires the same text, links, structured data, and images on both.

| # | Status | Evidence |
|---|--------|----------|
| MO1 | Same H1 across devices | **FAIL** | Two H1s in DOM (desktop + mobile hero). |
| MO2 | Desktop-only nav elements | **PARTIAL** | Desktop nav = links + theme toggle; mobile = bottom bar. All 5 routes exist in both DOMs (token that matters for indexing). |
| MO3 | `viewport` meta | **DONE** | Served in production (Next auto). |
| MO4 | Mobile secondary content visibility | **PARTIAL** | `MobileHome` hides desktop widgets (`GithubStatsWidget`, `ProjectsDrawer`, videos) and is swapped via `xl:hidden`; mobile shows a static card-stack placeholder instead of the real projects. Confirmed by production Lighthouse: mobile total weight = **439 KB** (0 videos) vs desktop **7 MB** — Google indexes the mobile DOM first, so mobile-served content is materially thinner than desktop. Consider serving real content to mobile too. |

### 2.13 Freshness & maintenance

- [ ] Machine-readable `lastmod` in sitemap / schema whenever a page changes (a freshness signal, cheap and effective).
- [ ] Review/add content on a cadence; for a static site, a "last updated: YYYY-MM" line per notable page is enough.
- [ ] `dateModified` as structured data (Person/ProfilePage: `dateCreated` / `dateModified`).

### 2.14 Conversion-adjacent CTR signals

- [ ] Value prop visible above the fold ("Open to Internships & Full-Time Roles" — implied in the hero; make it explicit).
- [ ] Clear contact path (mailto + LinkedIn).
- [ ] Resume accessible in-state without navigation (it is, `/resume.pdf`).

### 2.15 Accessibility & semantic HTML (a11y → SEO)

Accessibility isn't a direct ranking factor, but it is a Lighthouse "SEO" adjacency, an E-E-A-T trust signal, and (under the 2025 European Accessibility Act) a compliance matter. Lighthouse flagged four homepage issues (mobile run, the one that matters) — fix them:

- [ ] `aria-prohibited-attr` — **60 elements**: the skill badges are `<div aria-label="Python">` (etc.) with **no `role`**. A `<div>` defaults to the `generic` role, which forbids naming — either add a valid `role` (e.g. `role="img"`/`role="listitem"`) or use a semantic element. This is the biggest single a11y failure and is mobile-only (desktop passes).
- [ ] `color-contrast` — 1 element: `GIT` badge (3.68:1, `#000` on `#7c3aed`); meet WCAG AA (≥4.5:1 body, ≥3:1 large text). (Desktop shows 6 such badge/label failures.)
- [ ] `heading-order` — 1 element: `PORTFOLIO V3` `<h3>`; fix the heading hierarchy (see §2.4).
- [ ] `svg-img-alt` — **57 footer icons**: `<svg role="img">` with no `<title>`/`aria-label`; add one, or mark decorative icons `aria-hidden="true"`.
- [ ] `link-name` — **desktop-only** failure: the header GitHub `<a>` has no accessible name; add `aria-label`/visible text.

Semantic HTML & language:

- [ ] `<html lang="en">` declared (not set explicitly — add it; helps language detection + screen readers).
- [ ] Landmarks: one `<main>`, one or two `<nav>` (top nav + mobile bottom bar), one `<footer>`.
- [ ] For the duplicate desktop/mobile hero (§2.12), keep a single H1 and hide the other with `sr-only`/`aria-hidden` instead of leaving two H1s in the DOM.

### 2.16 Measurement, analytics & KPIs

SEO without measurement is guesswork. Set this up in Tier 1:

- [ ] **Google Search Console** verified (add the property; submit the §3.2 sitemap).
- [ ] **Google Analytics 4** installed (none in this repo yet) — `next/script`/`gtag`, kept off the critical path.
- [ ] Link GA4 ↔ GSC (Admin → Search Console linking) so organic query data flows into GA4.
- [ ] Track **AI-referral traffic** as a source (ChatGPT, Perplexity, etc.) — a growing share of organic-like traffic.
- [ ] Define KPIs (write them down):
  - Organic clicks to `/` and `/projects` (GSC).
  - Position for "AI/ML engineer India" and "Medhansh Kapoor" (rank tracker / GSC).
  - `resume.pdf` download events (GA4 event).
- [ ] Set up **rank tracking** for the §1 keywords (GSC position + a tracker like Ahrefs/Semrush).

---

## 3. Technical SEO checklist

### 3.1 Crawlability — robots.txt

| # | Check | Status / evidence |
|---|-------|-------------------|
| C1 | `robots.txt` returns 200 at `/robots.txt` | **FAIL** — production `/robots.txt` → **404**. |
| C2 | Must NOT block CSS/JS/JSON/fonts (`/_next/`, `/fonts`) — Google needs them to render | N/A (no robots exists) — when created, never disallow `/_next/`. |
| C3 | Declares absolute sitemap URL | N/A |
| C4 | Block parameterized/session URLs (this site has none; only `?username=` on `/api/…`) | Add `Disallow: /api/\n` or `noindex` the API responses (JSON has no value in the index). |
| C5 | **AI-bot policy**: deliberately allow `GPTBot`, `OAI-SearchBot`, `Google-Extended`, `PerplexityBot`, `ClaudeBot`, `Applebot`, and decide whether to block training scrapers | Currently default (allow everything) — fine, but make it *explicit* in the new file (2026 best practice: an explicit AI policy so bots render your content and cite you). |

**Implementation:** create `app/robots.ts` exporting `MetadataRoute.Robots` (Next.js file convention) with `rules: [{ userAgent: "*", allow: "/" }]` + `sitemap: "https://medhanshk.me/sitemap.xml"`. Do NOT block fonts/CSS.

### 3.2 Sitemap (XML)

| Check | Status |
|-------|--------|
| `sitemap.xml` exists and returns 200 | **MISSING** (404) |
| Contains every indexable URL (/, /projects, /experience, /about) | N/A |
| URLs return 200, are canonical, no redirects | N/A |
| Optional `lastmod` dates, priority home 1.0, others 0.6–0.9 | N/A |
| Submitted in GSC (and Bing Webmaster Tools) | N/A |
| **IndexNow** submitted to Bing for instant indexing pings | N/A — after the sitemap, submit via IndexNow (Bing Webmaster Tools auto-generates a key) |

**Implement:** `app/sitemap.ts` returning `[{url '/', lastModified, changeFrequency, priority}, '/projects', '/experience', '/about']`. Add the `Sitemap:` line to robots. Submit in GSC → "Sitemaps", and in Bing Webmaster Tools (IndexNow).

### 3.3 Canonicals & duplication

| Check | Status |
|--------|--------|
| Self-referencing `rel="canonical"` on every indexable page | **MISSING** (zero `canonical` meta tags; `alternates.canonical` absent from Next config) |
| One canonical form resolves HTTP/HTTPS/www (see redirects) | OK (308s) but no canonical tag emitted |
| Duplicate variants consolidated | Both `www` and `http` 308 → non-www HTTPS; DNS fine. |
| `?ref=…` params canonicalize to base (N/A — no tracked URL params) | N/A |
| Canonical via HTTP `Link` header only for non-HTML | N/A |

Fix: set **`alternates: { canonical: "…" }`** per page (or globally for the root layout). This anchors every version.

### 3.4 Redirects & status codes

Production verified via HEAD/GET:

| Check | Status |
|--------|--------|
| `http://` → `https://` 308, single hop | **DONE** (Vercel auto) |
| `www` → non-www 308 | **DONE** (Vercel `vercel.json:2-8`) |
| No redirect chains/loops | **DONE** (both single-hop) |
| No accidental **302** (temporary) redirects | **CHECK** — all current redirects are 308 (permanent); verify none are `302` (a 302 is only correct when the move is temporary) |
| 404 page returns a real 404 with helpful links | **DONE** — `app/global-error.tsx`, `app/not-found.tsx` render a styled 404 with "Return to Terminal". No `generateMetadata` for the 404; keep it `noindex` (Next default is fine). |
| `resume.pdf` returns 200 | NOTE: `X-Nextjs-Prerender` present, so presumably served; verify periodically. |
| Google Docs offer-letter + YouTube + GitHub external links return 200 (no 404s) | CHECK — links in `app/data/profile.ts` (Drive URLs, `youtu.be`, `github.com`) must not 404. |

> ⚠ Google's Dec 18 2025 JavaScript rendering update: **pages returning a non-200 status code may be skipped during rendering** ("while pages with a 200 HTTP status code are sent to rendering, this might not be the case for" non-200 pages) — test your 404/error UI; JS-only "you might like" enhancements on the 404 may never reach users. It's fine here (the 404 is styled server-side).

### 3.5 HTTPS, security & headers

| Check | Status |
|--------|--------|
| HTTPS everywhere, zero mixed content | **DONE** (Vercel; `curl` confirmed `X-Nextjs`); no mixed content detected. |
| HSTS (≥1y `Strict-Transport-Security`) | **DONE** — `max-age=63072000` from Vercel. Lighthouse still flags **no `includeSubDomains`** and **no `preload`** (Medium) — add both directives. |
| `X-Frame-Options: DENY` | **DONE** (`vercel.json:14`) |
| `X-Content-Type-Options: nosniff` | **DONE** (`vercel.json:15`) |
| `Referrer-Policy: strict-origin-when-cross-origin` | **DONE** (`vercel.json:16-19`) |
| `Cross-Origin-Opener-Policy` (origin isolation) | **MISSING** — Lighthouse `origin-isolation` flags no COOP header (High); add `Cross-Origin-Opener-Policy: same-origin`. |
| `Content-Security-Policy` (restrict inline & external origins) | **MISSING** — no CSP header. Next.js 16 can send it; consider a lenient early policy (CSP can break inline styles / React — prioritize a post-launch audit). |
| Hide `X-Powered-By: Next.js` | **PARTIAL** — shown in headers; strip for hardening (minor info leak, no SEO impact). |

### 3.6 Site architecture

- [ ] ≤3 clicks from home to anything — ✓ (everything is At the top-level nav).
- [ ] Breadcrumbs (visible + BreadcrumbList) — absent; optional on inner pages (About/Projects/Experience could add "Home → <page>").
- [ ] No orphan pages — all 4 pages linked everywhere.
- [ ] Internal linking from: side nav, bottom nav, home CTAs — ✓.

### 3.7 Mobile & UX (mobile-only index, tap targets, readability)

| Check | Status |
|--------|--------|
| Viewport meta | ✓ |
| No horizontal scroll @ mobile | Mostly ✓ (`overflow-x-clip`); verify above 375px on all pages |
| Tap targets ≥ 48px with spacing | **PARTIAL** — bottom bar uses `min-h-11` (44px) & `min-w-11`; mobile nav links ~40px; Lighthouse may flag <48px → verify |
| Visible text ≥ 16px effective | **PARTIAL** — some `text-*` too small, tiny uppercase labels (10px) low-contrast → run GSC "Mobile Usability" + Lighthouse |
| No horizontal scroll | mostly ✓ (clip + Tailwind) |

### 3.8 JavaScript / rendering & SEO

For a Next.js site, content is server-rendered then hydrated — crawlers see the full HTML. Still verify:

| Check | Status |
|--------|--------|
| Primary text present in raw HTML | ✓ (Next SSR; homepage HTML shows H1 + description). Verify each render with `view-source`. |
| All nav/link anchors real `<a>` with real `href` | **PARTIAL** — some links are `<motion.button>` open-a-modal (project cards, theme toggle) — functional, not navigational, fine; the page graph itself is `<a>`-based. |
| No soft-404s (unknown routes return 200 with empty content) | ✓ (unknown routes return a real 404) |
| JSON/API content served with 200 + `Cache-Control` | ✓ — `revalidate` + `s-maxage` present in `app/api/*`. Consider disallowing `/api/*` in robots (JSON data; not harmful). Secrets server-side, not on client. |
| No hydration errors (`errors-in-console`) | **FAIL** — production logs `Minified React error #418` (hydration mismatch) in `_next/static/chunks/1ua5armwfph8o.js`, dropping Best Practices to 96. A severe mismatch makes React discard the server HTML and re-render client-side; Googlebot may read the pre-hydration markup. Fix with `suppressHydrationWarning` or SSR-safe values (no `Date.now()`/`Math.random()`/`window` reads during render). |
| Streaming-specific metadata | N/A (static site, all prerendered) |

### 3.9 Performance / Core Web Vitals (LCP, INP, CLS)

Top perf facts from production HTML + production Lighthouse (2026-08-12):

**Measured (mobile, throttled — the ranking-relevant run):** FCP 1.2 s · **LCP 2.9 s (FAIL)** · TBT 160 ms · CLS **0** · Speed Index 1.3 s · TTI 3.2 s. Desktop (unthrottled) is not comparable: LCP 0.8 s, TBT 0 ms.

| Metric | Target (p75 mobile) | Top repo risk |
|--------|---------------------|---------------|
| **LCP** | ≤ 2.5 s | Measured **2.9 s**. LCP element = the `<h1>` "Medhansh" on mobile (intro `<p>` on desktop); render delay ≈ 708 ms (framer-motion entrance) vs TTFB 64 ms — the animation, not network, dominates. Videos (13.6 MB + 2.8 MB) are a **desktop-only** weight risk (not fetched on mobile). |
| **INP** | ≤ 200 ms | Framer-motion entrance animations on every page; heavy client JS; double-fired `/api` calls (dedupe); possible long tasks from chart widgets (GitHub calendar / contribution SVG cells). Lab TBT 160 ms (proxy). |
| **CLS** | ≤ 0.1 | Measured **0** (pass). Still flagged: DSEG `@font-face` has **no `font-display`** (`font-display-insight` est. 140 ms invisible-text savings; not a CLS issue but an FCP/LCP visibility one). |

Checklist to implement (each row already pre-validated above):
- [ ] Resize/compress/convert videos (aim < 2–3 MB each, or AV1/VP9; set `poster` + `preload="metadata"`) — desktop-only fix, but keeps desktop LCP/weight sane.
- [ ] Add `font-display: swap` (+ size-bearing metrics via `font-size-adjust`) to the DSEG `@font-face` in `app/globals.css`.
- [ ] Reduce the LCP element's render delay: the framer-motion entrance on the H1/hero is the main LCP cost (708 ms) — cut it or disable it on first paint.
- [ ] Coalesce/dedupe the four `/api/*` calls client-side (each widget fetches independently; on the dev server APIs fire up to 8× per page).
- [ ] Reduce below-fold motion-animation cost (INP).
- [ ] LCP font preload: `next/font` already preloads the 3 woff builds — leave as-is.
- [ ] Keep main JS under ~200–250 KB gzipped; monitor with Lighthouse CI.

### 3.10 Internationalization / hreflang

**N/A** (single language, no region targeting). If you ever add it: reciprocal hreflang, `x-default`, ISO-639-1 + 3166 codes (e.g. `en-IN`).

**Local SEO — N/A with a caveat:** no storefront, so no Google Business Profile. But because "Jaipur" is a target keyword (§1), if you want local knowledge-panel hints add `homeLocation` / `addressLocality: "Jaipur"` (optionally `addressCountry: "IN"`) to the `Person` schema (§2.10). Otherwise mark local SEO explicitly out of scope.

### 3.11 Structured data validation & rich results

- [ ] Add schema (§2.10) then validate the live URL in Rich Results Test.
- [ ] Monitor GSC "Enhancements" once live.
- [ ] No illegal/rejected schema patterns (FAQ moderation noted above).
- [ ] ⚠ **Don't read the Lighthouse SEO score as "done."** Production scores SEO **100** even though `robots.txt` → 404, no `sitemap.xml`, no `canonical`, and zero JSON-LD. Lighthouse's SEO category does **not** score robots.txt presence (only 5XX/invalid syntax), sitemap, canonical, or structured data (structured-data is manual and unscored). The §3.1–3.3 & §2.10 gaps remain open regardless of the 100.

### 3.12 AI crawlers & GEO (Generative Engine Optimization)

- [ ] Define an explicit robots policy for: `GPTBot` (train vs retrieve — recommend allowing both, or at least `OAI-SearchBot` for ChatGPT Search), `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bingbot`, `Applebot`.
- [ ] Content in HTML (not images/JS) — you are ✓.
- [ ] Answer-first structure, visible dates, frequent cross-links, `sameAs`.
- [ ] You're currently indexable to all bots (no robots.txt = allow everything) — correct default; make it intentional.
- [ ] Create an **`llms.txt`** at `/llms.txt` (§3.12): a plain-text file describing Medhansh Kapoor, his role, and linking to `/`, `/projects`, `/experience`, `/about`, plus GitHub/LinkedIn. This helps LLMs and agents understand and cite you.

### 3.13 Monitoring & maintenance cadence

| Check | Tool | Cadence |
|-------|------|---------|
| GSC verification + Coverage + Core Web Vitals report | Search Console | Weekly |
| Sitemap submission & green status | GSC | Until green |
| Field CrUX / PageSpeed Insights | pagespeed.web.dev / PSI | Monthly |
| Lighthouse CI with budgets | Lighthouse + CI (Vercel/GitHub Actions) | Every commit |
| Rich Results Test (each schema) | Google | On change |
| Uptime + index health | Uptime monitor + GSC | Continuous |
| Manual actions check (Security & Manual Actions) | GSC | Monthly |
| Keyword position tracking for §1 targets | GSC / Ahrefs / Semrush | Weekly |

---

## 4. Next.js-specific SEO recipes (this repo)

Next App Router — apply exactly these:

1. **Root metadata** in `app/layout.tsx` `metadata`:
   - `metadataBase: new URL("https://medhanshk.me")`
   - `title: { default: "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer", template: "%s | Medhansh Kapoor" }`
   - `description` (keep the good one)
   - `alternates: { canonical: "/" }`
   - `openGraph: { type: "website", locale: "en_IN", url: "…", siteName: "…", images: ["/opengraph-image"] }`
   - `twitter: { card: "summary_large_image" }`
   - `robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": "-1", "max-image-preview": "large" } }`
   - `manifest` (only if you add a web app manifest).
2. **Per-page metadata**: add `metadata`/`generateMetadata` to `app/projects/page.tsx`, `app/experience/page.tsx`, `app/about/page.tsx`. Crawlers rely on server-side metadata — the pages are `"use client"` components, so **move the metadata export into a colocated `metadata.ts` server module (or convert the pages to Server Components with client islands)**, because Next only reads `metadata` from Server Components. Real constraint to respect.
3. **`app/sitemap.ts`** + **`app/robots.ts`**.
4. **`app/opengraph-image.tsx`** (`ImageResponse`) for a 1200×630 OG card (+ optional per-page variants, e.g. `app/about/opengraph-image.tsx`).
5. **Icons**: `app/favicon.ico` exists; add `apple-icon.png` (180×180) + `icon.png`.
6. **JSON-LD**: inject `<script type="application/ld+json">` in the root layout and About (server components) with `Person` + `WebSite` + `ProfilePage`, stable `@id`, `sameAs` = GitHub + LinkedIn only.
7. **Canonical sanity**: `alternates.canonical` on every page.

---

## 5. Off-page (brief — relevant)

Backlinks are part of SEO; only paid ads sit outside its umbrella. For a personal brand:

- [ ] Consistency: every profile's website/link field = `https://medhanshk.me`.
- [ ] Add `rel="me"` on GitHub/LinkedIn outgoing links (and verify profile links point back).
- [ ] Awareness: mention the portfolio in your actual writing, replies, repos; ask credible pages (university, team profiles, hackathon pages for Prayatna/India Innovates) to cite the domain.
- [ ] If anyone blogs about your projects, make sure they link to `medhanshk.me`, not just the GitHub repo.
- [ ] Competitor backlink analysis / backlink-gap audit: find sites linking to comparable AI/ML-engineer profiles but not to you; request a link (directory, roundup, university, hackathon pages).
- [ ] Turn unlinked brand mentions into links: find "Medhansh Kapoor" mentions with no link and politely ask for one.
- [ ] Realistic expectations (measured, gl=us): bare "Medhansh Kapoor" → **#4** (behind three same-name LinkedIn profiles + Instagram); "Medhansh Kapoor AI ML engineer" → **#1/#3/#5/#9** (your `/resume`, `/about`, `/projects`, `/experience` already own it). The remaining lifts are (a) winning the bare name via entity disambiguation (§2.10) and (b) ranking for "AI engineer India" / "full-stack engineer Jaipur", which currently return nothing for you.

---

## 6. Complete prioritized checklist (one box at a time)

Order matters — fix **Indexability → Crawlability → Perf → On-page → AI → Measuring**, because fixing the wrong layer bleeds ROI (most-cited 2026 audit lesson).

### Tier 1 (P0 — blocking; do first)
- [ ] Create `app/robots.ts` — allow all public, disallow `/api/`, point to sitemap; never disallow `/_next/`.
- [ ] Create `app/sitemap.ts` + submit to GSC.
- [ ] Fix homepage double-H1 (one H1 in DOM for desktop + mobile slots).
- [ ] Fix deep links: add `id` to project cards.
- [ ] Canonical on every page (`alternates`).
- [ ] `metadataBase` + full root `metadata` (OG/twitter/robots).
- [ ] Set up GA4 + GSC, link them, define KPIs (§2.16).

### Tier 2 (P1 — visible result)
- [ ] Sub-page `metadata` / `generateMetadata` (must be server-side — colocate as `metadata.ts`).
- [ ] JSON-LD: `Person` + `WebSite` + `ProfilePage` on home/about.
- [ ] `opengraph-image` + `apple-touch-icon` + `icon.png`.
- [ ] Compress de-videos (13.6 MB → < 2–3 MB), add `poster`, `preload="metadata"`.
- [ ] `font-display: swap` + metrics override for DSEG fonts.
- [ ] Privacy/contact trust signals (About + footer) — optional.
- [ ] Lighthouse CI budgets (LCP < 2.5 s, INP < 200 ms, CLS < 0.1).
- [ ] `llms.txt` at `/llms.txt` (§3.12).
- [ ] Fix the 4 a11y Lighthouse failures + `<html lang>` + landmarks (§2.15).

### Tier 3 (P2 — polish/E-E-A/GEO)
- [ ] Mirror platforms/awards/stats in schema + visible text.
- [ ] Answer-first headings & (optional) FAQ block.
- [ ] `rel="me"` on profile links; `sameAs` = GitHub + LinkedIn only.
- [ ] Visible "last updated" on notable pages.
- [ ] Monitor CrUX monthly, re-run Lighthouse quarterly, re-crawl after every deploy.
- [ ] Competitor keyword/content-gap + backlink-gap analysis (§1, §5).
- [ ] Local-schema note if "Jaipur" is targeted (§3.10).

### Verify tools
- [ ] Google Rich Results Test (after adding schema).
- [ ] URL Inspection ("Test live URL", "View tested page").
- [ ] Mobile-Friendly Test.
- [ ] PageSpeed Insights (mobile) + Chrome DevTools Performance (4× CPU, Slow 4G).
- [ ] Screaming Frog (free ≤ 500 URLs) or Sitebulb for a final full crawl.
- [ ] GA4 realtime + event debugger (verify `resume.pdf` download events fire).
- [ ] Rank tracker (GSC + Ahrefs/Semrush) for the §1 keywords.

---

## 7. Evidence sources (research condensed)

This checklist synthesizes 2026 guidance from: Google Search Central (Title/Meta/OG, Core Web Vitals, robots, hreflang, helpful-content, E-E-A-T, ProfilePage/Article schema), Core Web Vitals guidance (2.5 s / 200 ms / 0.1 @ p75), the Dec 18 2025 Google rendering update (non-200 pages may be skipped during rendering), on-page SEO checklists (Ahrefs, Semrush, Backlinko, Similarweb, SEOptimer, HubSpot, WordStream), technical-SEO audits (ThatDevPro, ECOSIRE 47-point, SiteGlow 32-point audits), Next.js App Router official docs (Metadata API, `sitemap`/`robots` file conventions, `generateMetadata`, `ImageResponse`), and entity/E-E-A/GEO guides for personal sites.

Specifically: `app/layout.tsx:26-30` (global metadata only), `app/components/HeroSection.tsx:20` + `app/components/mobile/MobileHeroSection.tsx:21` (double H1 in DOM), `app/projects/page.tsx:30-33` (H1 "Projects", no `id` on cards), `app/components/ProjectsDrawer.tsx:156` + `app/components/GenieModal.tsx:134` (dangling `#` links), `app/components/ProjectsDrawer.tsx:36-53` (video `preload="auto"` + autoplay), `app/globals.css:1-27` (`@font-face` without `font-display`), `app/favicon.ico` (only icon asset), `vercel.json` (security headers + www redirect), `app/api/*` (`revalidate` + `s-maxage` present), `app/not-found.tsx` + `app/global-error.tsx` (404/error pages OK), `app/data/profile.ts` (E-E-A source of truth). Production checks via `curl` replicated the evidence above.

Cross-checked against Google's official SEO Starter Guide, Ahrefs' SEO checklist, Backlinko's complete SEO checklist (Jan 2026), and Semrush's 43-point 2026 checklist. The Dec 18 2025 Google JavaScript-rendering update (non-200 pages may be skipped during rendering) and the mobile-only indexing shift (2025–2026) are reflected in §2.12 / §3.4.

Production evidence: `docs/lighthouse.json` (desktop, unthrottled) and `docs/lighthousemobile.json` (mobile, throttled — the ranking-relevant run), both Lighthouse 13.4.0 against `https://medhanshk.me/` on 2026-08-12. Mobile: Perf 93 / A11y 89 / BP 96 / SEO 100, LCP 2.9 s, FCP 1.2 s, TBT 160 ms, CLS 0; a11y failures `aria-prohibited-attr` (60), `color-contrast` (1), `heading-order` (1), `svg-img-alt` (57). Desktop: Perf 97 / A11y 88 / BP 96 / SEO 100; failures `color-contrast` (6), `heading-order` (1), `link-name` (1), `svg-img-alt` (57). Both runs log `errors-in-console` (React #418 hydration mismatch). The `aria-prohibited-attr` (60) finding follows the WAI-ARIA `generic`-role rule: `aria-label` is prohibited on a `<div>` without a role (MDN/ARIA 1.2).

Live SERP evidence (Google, gl=us, 2026-08-14, headless-browser): bare "Medhansh Kapoor" → `medhanshk.me` #4 + `/resume` #10; "Medhansh Kapoor AI ML engineer" → #1 `/resume`, #3 `/about`, #5 `/projects`, #9 `/experience`; no knowledge panel; competing same-name entities (incl. the filmmaker `medhanshk.com`/Letterboxd) outrank `medhanshk.me`.
