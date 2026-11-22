# SEO Evaluation Plan — medhanshk.me

> **Purpose:** Systematically validate every SEO implementation from [`docs/seo.md`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/docs/seo.md) against 2026 best practices.
>
> **Methodology:** Each check has three lanes — **Online Tool** (live URL validation), **Codebase Check** (source-level verification), and **Pass/Fail Criteria** (binary grading). A check passes only when *both* online and codebase lanes satisfy the criteria.
>
> **Traceability:** Every item in `docs/seo.md` (87 discrete items) maps to at least one check below. Cross-references use format `[seo.md §X.Y]`.

---

## Phase 0 — Core Baseline Audits

### 0.1 Production Lighthouse (Mobile & Desktop) `[seo.md §0]`
- **Online Tools:**
  - [PageSpeed Insights (Mobile)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmedhanshk.me) — pulls CrUX field data + lab run
  - [PageSpeed Insights (Desktop)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmedhanshk.me&form_factor=desktop)
- **CLI Check:**
  ```powershell
  npx lighthouse https://medhanshk.me --output=json,html --output-path=./lighthouse-mobile --form-factor=mobile --throttling-method=simulate
  npx lighthouse https://medhanshk.me --output=json,html --output-path=./lighthouse-desktop --preset=desktop
  ```
- **Pass/Fail Criteria:**

  | Category | Mobile Target | Desktop Target |
  |----------|--------------|----------------|
  | Performance | ≥ 90 | ≥ 95 |
  | Accessibility | ≥ 95 | ≥ 95 |
  | Best Practices | = 100 | = 100 |
  | SEO | = 100 | = 100 |
  | Agentic Browsing | ≥ 80% pass-ratio | ≥ 80% pass-ratio |

> [!IMPORTANT]
> Lighthouse lab scores are diagnostic only — Google ranks using **CrUX field data** at the 75th percentile. Always cross-reference PSI's "Origin Summary" field data section. If field data and lab data diverge, field data is the source of truth for ranking.

### 0.2 Core Web Vitals (CrUX Field Data) `[seo.md §6 targets]`
- **Online Tool:** [PageSpeed Insights → "Discover what your real users are experiencing"](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmedhanshk.me)
- **Alternative:** [CrUX Dashboard (Looker Studio)](https://lookerstudio.google.com/datasources/create?connectorId=AKfycbxk7u2UtsqzgaEHGkMGIrdO5JhAmMYOJQGZ6s7GnIPjqS4WYzO4)
- **Pass/Fail Criteria (p75 field thresholds):**

  | Metric | Good | Poor |
  |--------|------|------|
  | **LCP** (Largest Contentful Paint) | ≤ 2.5s | > 4.0s |
  | **INP** (Interaction to Next Paint) | ≤ 200ms | > 500ms |
  | **CLS** (Cumulative Layout Shift) | ≤ 0.1 | > 0.25 |
  | **FCP** (First Contentful Paint) | < 1.8s | > 3.0s |
  | **TBT** (Total Blocking Time — lab proxy for INP) | < 200ms | > 600ms |

> [!NOTE]
> **INP replaced FID in March 2024.** INP measures *all* interactions across the page lifecycle. For a Framer Motion + React site, use DevTools Performance Panel with 4× CPU slowdown to simulate mobile. If CrUX data is unavailable (low traffic), lab TBT serves as the best INP proxy.

### 0.3 Live Server Endpoints (HTTP Status Check) `[seo.md §0 live checks]`
- **Online Tool:** [HTTPStatus.io](https://httpstatus.io/)
- **CLI Check:**
  ```powershell
  @("robots.txt","sitemap.xml","llms.txt","resume.pdf","favicon.ico") | ForEach-Object { Write-Host "--- $_"; curl -sI "https://medhanshk.me/$_" | Select-String "HTTP/" }
  ```
- **Pass/Fail Criteria:** All 5 endpoints return `HTTP/2 200`.

### 0.4 Zero Console & Hydration Errors `[seo.md §0, §6.4]`
- **Online Tool:** Chrome DevTools (`F12` → Console tab on `https://medhanshk.me`).
- **Codebase Check:** Inspect [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) and all `"use client"` components for non-deterministic values (raw `Date.now()`, browser-only globals without hydration guards).
- **Pass/Fail Criteria:** Zero red errors. Zero `Minified React error #418` or `#423` hydration warnings.

### 0.5 INP Deep Diagnostic (Framer Motion Specific) `[seo.md §6.5]`
- **Tool:** Chrome DevTools → Performance Panel → Record user interaction → inspect Main Thread for Long Tasks (red corner markers)
- **Codebase Check:**
  - Verify animations in [`app/components/HeroSection.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/HeroSection.tsx) use GPU-acceleratable properties (`transform`, `opacity`) not layout-triggering ones (`width`, `height`, `top`).
  - Verify `useReducedMotion` from Framer Motion is respected (accessibility + perf).
  - Check entrance animation stagger timing isn't blocking LCP render.
- **Pass/Fail Criteria:** No interaction > 200ms to next paint. Zero Long Tasks (>50ms) during standard user interactions on 4× CPU-throttled mobile simulation.

### 0.6 Unused Import / Render Audit `[seo.md §0 — FiLinkedin]`
- **Codebase Check:**
  ```powershell
  git grep "FiLinkedin" -- "app/"
  ```
  Verify `FiLinkedin` from `react-icons` is either rendered or removed. seo.md flagged it was imported but never rendered — LinkedIn link was missing.
- **Pass/Fail Criteria:** Zero unused icon imports. LinkedIn icon is visibly rendered on every page.

---

## Phase 1 — Measurement & Verification

### 1.1 Google Search Console Verification `[seo.md §1]`
- **Online Tool:** [Google Search Console](https://search.google.com/search-console)
- **Codebase Check:** Verify DNS TXT record or HTML verification tag in [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) or DNS provider.
- **Pass/Fail Criteria:** Domain property `medhanshk.me` verified. ≥ 5 URLs submitted under `Sitemaps`. Zero "Page indexing" errors.

### 1.2 Bing Webmaster Tools & IndexNow `[seo.md §1]`
- **Online Tool:** [Bing Webmaster Tools](https://www.bing.com/webmasters)
- **Codebase Check:** Verify [`public/4acab0b6b1664896bf7d6705e9b0908f.txt`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/public/4acab0b6b1664896bf7d6705e9b0908f.txt) exists.
- **CLI Check:**
  ```powershell
  curl -sI https://medhanshk.me/4acab0b6b1664896bf7d6705e9b0908f.txt | Select-String "HTTP/"
  ```
- **Pass/Fail Criteria:** Sitemap processed in Bing with 0 errors. IndexNow key returns `200`.

### 1.3 GA4 Analytics & Event Tracking `[seo.md §1]`
- **Online Tool:** [GA4 Realtime Dashboard](https://analytics.google.com/) → DebugView
- **Codebase Check:** Verify [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) contains `<GoogleAnalytics gaId="G-D064XWFM94" />`.
- **Manual Test:** Click "Resume" download → check GA4 DebugView for `file_download` event.
- **Pass/Fail Criteria:** `file_download` event fires in GA4 Realtime within 5 seconds of click.

### 1.4 KPI Documentation `[seo.md §1]`
- **Codebase Check:** Verify a KPI baseline document or spreadsheet exists tracking:
  - Position for "Medhansh Kapoor", "AI/ML engineer India", "AI engineer Jaipur"
  - Organic clicks to `/`
  - `resume.pdf` download events
- **Pass/Fail Criteria:** KPIs are documented (even if positions are not yet tracked — the *tracking setup* must exist).

### 1.5 AI-Referral Traffic Tracking `[seo.md §1]`
- **Online Tool:** GA4 → *Reports* → *Acquisition* → *Traffic acquisition* → Filter by Session source: `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`.
- **Codebase Check:** Ensure clean canonical paths without stripping referrer parameters.
- **Pass/Fail Criteria:** AI referral sources are distinguishable in GA4 acquisition report (tracking capability must exist, even if traffic is currently zero).

### 1.6 GSC "Generative AI" Performance Report `[seo.md §11]`
- **Online Tool:** [GSC → Performance → Search type: "Generative AI"](https://search.google.com/search-console/performance/search-analytics)
- **Pass/Fail Criteria:** Report is accessible. Log baseline impressions/clicks for "Medhansh Kapoor" queries in AI surfaces.

### 1.7 Keyword Position & Cannibalization Validation `[seo.md §1 cannibalization]`
- **Online Tool:** [GSC Performance Report](https://search.google.com/search-console/performance/search-analytics) → Pages tab → filter by query "Medhansh Kapoor"
- **Codebase Check:** Compare `title` and `description` in [`app/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/page.tsx) vs [`app/about/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/page.tsx). Titles must target distinct intents.
- **Pass/Fail Criteria:** `/` ranks for brand/navigational "Medhansh Kapoor". `/about` ranks for informational queries. No two pages compete for the same primary query.

### 1.8 Keyword Map Verification `[seo.md §1 keyword map table]`
- **Codebase Check:** Verify each page's `<title>` and `<meta name="description">` align with the keyword map:

  | Page | Primary keyword (must appear in title) | Secondary terms (should appear in description) |
  |------|--------------------------------------|----------------------------------------------|
  | `/` | Medhansh Kapoor (brand/navigational) | AI/ML engineer India, portfolio |
  | `/projects` | AI/ML projects | JanSamadhan, NyayaAI, RAG, LangGraph, YOLOv8 |
  | `/experience` | AI/ML engineer experience | IndiaAI Mission MeitY, ISSA DRDO |
  | `/about` | about Medhansh Kapoor | AI engineer Jaipur, achievements, education |

- **Pass/Fail Criteria:** Primary keywords appear in each page's title. Secondary terms appear in descriptions or on-page content.

---

## Phase 2 — Indexability & Crawlability

### 2.1 `robots.ts` & AI Bot Policy `[seo.md §2.1, §8A.1]`
- **Online Tool:** [TechnicalSEO Robots.txt Tester](https://technicalseo.com/tools/robots-txt/)
- **Codebase Check:** Inspect [`app/robots.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/robots.ts).
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me/robots.txt
  ```
- **Pass/Fail Criteria:**
  - `User-agent: *` allows `/` and disallows `/api/`.
  - All AI bots explicitly allowed: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Bingbot`, `Applebot`, `CCBot`.
  - Points to `https://medhanshk.me/sitemap.xml`.
  - Does NOT block `/_next/` (critical for JS/CSS delivery).

### 2.2 `sitemap.ts` Schema & Routes `[seo.md §2.2]`
- **Online Tool:** [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- **Codebase Check:** Inspect [`app/sitemap.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/sitemap.ts).
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me/sitemap.xml
  ```
- **Pass/Fail Criteria:** Valid XML containing `/`, `/projects`, `/experience`, `/about`, `/resume.pdf` with ISO 8601 `lastModified` dates.

### 2.3 Self-Referencing Canonicals & `metadataBase` `[seo.md §2.4, §2.5]`
- **Online Tool:** [SEO Minion Extension](https://seominion.com/) or view-source inspection.
- **Codebase Check:** Verify [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) has `metadataBase: new URL("https://medhanshk.me")` and each page exports `alternates: { canonical: "..." }`.
- **CLI Check:**
  ```powershell
  @("/","/projects","/experience","/about") | ForEach-Object { Write-Host "--- $_"; curl -s "https://medhanshk.me$_" | Select-String 'rel="canonical"' }
  ```
- **Pass/Fail Criteria:** Every route has an exact, absolute, self-referencing `rel="canonical"` matching its URL. No trailing slash mismatches.

---

## Phase 3 — On-Page Metadata (Titles, Descriptions, OG)

### 3.1 Root & Sub-Page Metadata Integrity `[seo.md §3.1–3.3]`
- **Online Tool:** [Metatags.io](https://metatags.io/?url=https%3A%2F%2Fmedhanshk.me) (test each page URL)
- **Codebase Check:** Verify **Server Component** metadata exports (NOT client component — Next.js constraint) in:
  - [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) → root + `title.template: "%s | Medhansh Kapoor"`
  - [`app/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/page.tsx) → home
  - [`app/projects/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/projects/page.tsx)
  - [`app/experience/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/experience/page.tsx)
  - [`app/about/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/page.tsx)
- **Pass/Fail Criteria:**

  | Page | Title (50–60 chars, keyword-frontloaded) | Description (120–160 chars) | Unique? | Server Component? |
  |------|------------------------------------------|-----------------------------|---------|-------------------|
  | `/` | "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer" | ✓ with CTA | ✓ | ✓ |
  | `/projects` | "Projects — Medhansh Kapoor" or similar | ✓ project-specific | ✓ | ✓ |
  | `/experience` | "Experience — Medhansh Kapoor" or similar | ✓ experience-specific | ✓ | ✓ |
  | `/about` | "About — Medhansh Kapoor" or similar | ✓ bio-specific | ✓ | ✓ |

  - `title.template` in layout.tsx must be `%s | Medhansh Kapoor` (or similar template pattern).
  - Metadata must come from Server Components or colocated `metadata.ts` — NOT from `"use client"` components.

### 3.2 OpenGraph & Twitter Card Tags `[seo.md §3.4, §3.5]`
- **Online Tools:**
  - [OpenGraph.xyz Debugger](https://www.opengraph.xyz/url/https%3A%2F%2Fmedhanshk.me)
  - [Meta (Facebook) Sharing Debugger](https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fmedhanshk.me) — forces cache refresh
  - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/inspect/https%3A%2F%2Fmedhanshk.me)
  - [Twitter Card Validator (Tweetpik)](https://tweetpik.com/twitter-card-validator)
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me | Select-String 'property="og:|name="twitter:'
  ```
- **Pass/Fail Criteria (per page in SSR HTML):**

  | Tag | Required? | Present? |
  |-----|-----------|----------|
  | `og:title` | ✓ | |
  | `og:description` | ✓ | |
  | `og:url` | ✓ | |
  | `og:type` | ✓ (`website`) | |
  | `og:site_name` | ✓ | |
  | `twitter:card` | ✓ (`summary`) | |
  | `twitter:title` | ✓ | |
  | `twitter:description` | ✓ | |
  | `og:image` | DEFERRED (no photo — accepted trade-off) | |
  | `twitter:image` | DEFERRED | |

---

## Phase 4 — Structured Data (JSON-LD)

### 4.1 Multi-Layer Schema Validation `[seo.md §4]`
- **Online Tools (use ALL three — each catches different issues):**
  1. [Schema.org Validator](https://validator.schema.org/#url=https%3A%2F%2Fmedhanshk.me) — vocabulary correctness
  2. [Google Rich Results Test](https://search.google.com/test/rich-results?url=https%3A%2F%2Fmedhanshk.me) — Google feature eligibility
  3. [JSON-LD Playground](https://json-ld.org/playground/) — syntax + graph expansion
- **Codebase Check:** Inspect [`app/lib/jsonld.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/lib/jsonld.tsx) and injections:
  - `getRootGraphSchema()` in [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx)
  - `getProjectsCollectionSchema()` in [`app/projects/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/projects/page.tsx)
  - `getExperiencePageSchema()` in [`app/experience/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/experience/page.tsx)
  - `getProfilePageSchema()` & `getFaqPageSchema()` in [`app/about/page.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/page.tsx)
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me | Select-String 'application/ld\+json'
  curl -s https://medhanshk.me/about | Select-String 'application/ld\+json'
  ```
- **Pass/Fail Criteria:**

  | Check | Pass? |
  |-------|-------|
  | 0 errors, 0 warnings in Schema.org Validator | |
  | 0 errors in Rich Results Test | |
  | JSON-LD Playground parses without syntax errors | |
  | Linked `@id: "https://medhanshk.me/#person"` connects Person ↔ WebSite ↔ ProfilePage ↔ CollectionPage ↔ WebPage | |
  | `sameAs` includes GitHub, LinkedIn, X, Instagram, cal.com, Wikidata (`Q141155822`) — all 6 entries | |
  | `disambiguatingDescription` present on Person | |
  | `jobTitle`: "AI/ML Engineer & Full-Stack Developer" | |
  | `worksFor`: IndiaAI Mission (MeitY), ISSA – DRDO, Geminid Systems — all 3 entries | |
  | `alumniOf`: Manipal University Jaipur, VVDAV Public School — both entries | |
  | `addressLocality`: "Jaipur" | |
  | `knowsAbout` populated with ≥ 42 technical skills (dynamic from profile.ts) | |
  | `FAQPage` schema on `/about` matches visible Q&A exactly (content parity) | |
  | XSS-safe serialization (`\u003c` not raw `<`) | |
  | No "right property, wrong type" mismatches | |

> [!WARNING]
> Validators passing doesn't guarantee correctness on the live site. Always verify the **rendered source** (`curl` or View Source), not just template files — framework updates can silently break JSON-LD injection.

---

## Phase 5 — Entity & Content Signals

### 5.1 Single `<h1>` per Page `[seo.md §5.1]`
- **Online Tool:** [W3C Nu HTML Checker](https://validator.w3.org/nu/?doc=https%3A%2F%2Fmedhanshk.me)
- **Codebase Check:**
  ```powershell
  git grep "<h1" -- "app/"
  ```
- **Pass/Fail Criteria:** Exactly one semantic `<h1>` rendered per page in SSR HTML. Mobile and desktop share one `<h1>` (mobile-first indexing uses mobile DOM only).

### 5.2 Social Reciprocal Links & `rel="me"` Loop `[seo.md §5.2]`
- **Codebase Check:** Inspect [`app/components/HeroSection.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/HeroSection.tsx) & [`app/components/mobile/MobileHeroCTA.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/mobile/MobileHeroCTA.tsx).
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me | Select-String 'rel="me'
  ```
- **Manual Verification (reciprocal check — must visit each platform):**

  | Platform | Site → Platform link with `rel="me"` | Platform → `medhanshk.me` link |
  |----------|--------------------------------------|-------------------------------|
  | LinkedIn | | |
  | GitHub | | |
  | X (Twitter) | | |
  | Instagram | | |
  | cal.com | | |

- **Pass/Fail Criteria:** All 5 links rendered with `rel="me noopener noreferrer"`. All 5 profiles link back to `https://medhanshk.me`.

### 5.3 URL Consistency & Anchor Fragment Targets `[seo.md §5.3, §5.4, §5.11]`
- **Codebase Check:**
  - [`app/data/profile.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/data/profile.ts) — verify GitHub URL has no trailing slash mismatch.
  - [`app/projects/ProjectsView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/projects/ProjectsView.tsx) — verify project IDs match drawer hashes (`#jansamadhan`, `#nyayaai`).
  - Verify all slugs are clean lowercase: `/`, `/projects`, `/experience`, `/about`.
- **Pass/Fail Criteria:** Zero broken anchor links. Zero trailing-slash inconsistencies. All slugs are lowercase with primary keywords.

### 5.4 Heading Hierarchy (No Level Skips) `[seo.md §5.5]`
- **Online Tool:** [WAVE Accessibility Evaluation Tool](https://wave.webaim.org/report#/https://medhanshk.me)
- **Codebase Check:** Inspect heading structure across `app/components/` — verify `<h2>` follows `<h1>` without jumping to `<h4>` or `<h5>`.
- **Pass/Fail Criteria:** Strict hierarchy: `h1 → h2 → h3`. No level skips. WAVE reports 0 "Heading level skip" alerts.

### 5.5 Freshness Signals (`dateModified`) `[seo.md §5.6]`
- **Codebase Check:**
  - [`app/lib/jsonld.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/lib/jsonld.tsx) — `dateModified` is ISO 8601 format.
  - [`app/sitemap.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/sitemap.ts) — `lastModified` dates are consistent.
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me | Select-String 'dateModified'
  ```
- **Pass/Fail Criteria:** `dateModified` exists in JSON-LD. Date is ≤ 30 days old. `sitemap.xml` dates match JSON-LD dates.

### 5.6 Answer-First Definition & Image Alt Text `[seo.md §5.7, §5.8]`
- **Codebase Check:**
  - [`app/components/HeroSection.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/HeroSection.tsx) — 40–50 word self-contained entity definition under H1.
  - All images:
    ```powershell
    git grep -n "<img\|<Image" -- "app/"
    ```
- **Pass/Fail Criteria:**
  - Entity definition is self-contained (extractable by LLMs out of context).
  - Zero images with missing `alt` attributes.
  - Alt text is 80–140 chars, does NOT start with "Image of" / "Picture of".
  - LCP image (`nyayaai-poster.webp`) has keyword-rich descriptive alt.
  - Decorative images use `alt=""`.

### 5.7 Internal Linking Architecture `[seo.md §5.9]`
- **Codebase Check:** Verify cross-page links exist per the seo.md internal linking map:

  | From | To | Expected anchor text pattern |
  |------|----|----------------------------|
  | `/` (hero/projects) | `/projects` | "View all AI/ML projects" |
  | `/` (experience) | `/experience` | "Full work experience" |
  | `/projects` (JanSamadhan) | `/experience` | "Built during IndiaAI Mission" |
  | `/projects` (NyayaAI) | `/about` | "Read about the tech stack" |
  | `/experience` (IndiaAI) | `/projects` | "See JanSamadhan" |
  | `/about` (skills) | `/projects` | "Projects built with these technologies" |
  | `/about` | `/experience` | "Professional experience timeline" |
  | All sub-pages (nav) | `/` | "Medhansh Kapoor — Home" |

  Files to check: [`app/projects/ProjectsView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/projects/ProjectsView.tsx), [`app/experience/ExperienceView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/experience/ExperienceView.tsx), [`app/about/AboutView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/AboutView.tsx).
- **Pass/Fail Criteria:** Every sub-page has ≥ 2 descriptive internal links to other sections. Anchor text is keyword-rich (not generic "click here"). All 8 rows of the linking map are satisfied.

### 5.8 E-E-A-T Signals `[seo.md §5.10]`
- **Codebase Check:** Verify visible credentials/bio, contact endpoints, and verified social links in:
  - [`app/components/HeroSection.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/HeroSection.tsx) — credentials visible
  - [`app/about/AboutView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/AboutView.tsx) — full bio, education, achievements
- **Pass/Fail Criteria:** Bio snippet with employer/institution is visible on homepage. `/about` has visible credentials (education, employer, achievements). Contact method (cal.com) is accessible.

---

## Phase 6 — Performance & Core Web Vitals

### 6.1 Media Optimization `[seo.md §6.1, §6.2]`
- **Codebase Check:**
  - Verify video files in `public/videos/` are compressed with `-an` (audio stripped) and `+faststart`.
  - Verify [`app/components/ui/SharedVideoPreview.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/ui/SharedVideoPreview.tsx) uses `preload="none"` and `.webp` poster.
- **CLI Check:**
  ```powershell
  Get-ChildItem -Path "public/videos" -Recurse | Select-Object Name, @{N="SizeMB";E={[math]::Round($_.Length/1MB,2)}}
  ```
- **Pass/Fail Criteria:** Total media transferred on initial page load < 2MB. Zero double-fetching (no duplicate 206 range requests). Each video file ≤ 2MB.

### 6.2 LCP Optimization `[seo.md §6.3]`
- **Online Tool:** [WebPageTest](https://www.webpagetest.org/) (Mobile Chrome, 4G throttled)
- **Codebase Check:** Verify [`app/components/mobile/CardDeckVideo.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/mobile/CardDeckVideo.tsx) has `priority={true}` and `fetchPriority="high"` on the LCP `<img>`.
- **Pass/Fail Criteria:** LCP ≤ 2.5s on simulated mobile 4G (aim ≤ 2.0s). LCP element is correctly prioritized.

### 6.3 Font Optimization & FOIT `[seo.md §6.6]`
- **Codebase Check:** Verify [`app/layout.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/layout.tsx) has `display: "swap"` on DSEG font loaders.
- **CLI Check:**
  ```powershell
  curl -s https://medhanshk.me | Select-String 'font-display'
  ```
- **Pass/Fail Criteria:** All custom fonts use `font-display: swap`. Zero FOIT on first load.

### 6.4 Security Headers Audit `[seo.md §6.7]`
- **Online Tool:** [SecurityHeaders.com](https://securityheaders.com/?q=https%3A%2F%2Fmedhanshk.me)
- **Codebase Check:** Inspect [`next.config.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/next.config.ts) & [`vercel.json`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/vercel.json).
- **CLI Check:**
  ```powershell
  curl -sI https://medhanshk.me | Select-String "strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security-policy"
  ```
- **Pass/Fail Criteria:**

  | Header | Required Value |
  |--------|---------------|
  | `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
  | `X-Content-Type-Options` | `nosniff` |
  | `X-Frame-Options` | `DENY` |
  | `Referrer-Policy` | `strict-origin-when-cross-origin` |
  | `Permissions-Policy` | Restricts unused APIs (`camera=(), microphone=()`, etc.) |
  | `Content-Security-Policy` | Present (even if report-only initially) |
  | **SecurityHeaders.com Grade** | **A+** |

> [!TIP]
> If CSP breaks analytics/fonts, use `Content-Security-Policy-Report-Only` first to identify violations without blocking. Iterate to full enforcement.

### 6.5 Favicon SERP Compliance & Custom 404 `[seo.md §6.8, §6.9]`
- **Online Tool:** [Google Favicon Service](https://www.google.com/s2/favicons?domain=medhanshk.me&sz=48)
- **Codebase Check:**
  - [`app/favicon.ico/route.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/favicon.ico/route.tsx) — exports 48×48.
  - [`app/not-found.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/not-found.tsx) — recovery links to `/`, `/projects`, `/experience`, `/about`.
- **Pass/Fail Criteria:** Google serves your branded favicon at 48×48. 404 page has navigation back to all 4 sections.

---

## Phase 7 — Accessibility & Agentic Browsing

### 7.1 Accessibility Tree & ARIA Compliance `[seo.md §7.1–7.5]`
- **Online Tool:** [axe DevTools Extension](https://www.deque.com/axe/devtools/) (run on ALL 4 pages)
- **Codebase Check:**
  - [`app/components/mobile/MobileSkillStrip.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/mobile/MobileSkillStrip.tsx) — `role="img"` on badges `[§7.1]`.
  - All `<svg role="img">` elements have `<title>` or `aria-label` (decorative SVGs use `aria-hidden="true"`) `[§7.2]`.
  - Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (e.g., GIT badge: `#000` on `#7c3aed` was 3.68:1 — verify fix) `[§7.3]`.
  - [`app/components/CardHeader.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/CardHeader.tsx) and [`app/components/mobile/MobileExperienceCard.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/components/mobile/MobileExperienceCard.tsx) — icon buttons have `aria-label` `[§7.4]`.
  - Touch target size ≥ 48×48px on all interactive elements `[§7.5]`.
- **Pass/Fail Criteria:**

  | Check | Pass? |
  |-------|-------|
  | 0 axe critical/serious violations on all 4 pages | |
  | `role="img"` on skill badges (no `aria-prohibited-attr`) | |
  | All SVGs: decorative → `aria-hidden`, meaningful → `aria-label`/`<title>` | |
  | Color contrast ≥ 4.5:1 everywhere | |
  | All icon buttons have `aria-label` | |
  | All touch targets ≥ 48×48px | |

### 7.2 `llms.txt` Spec Compliance (v2) `[seo.md §7.6]`
- **Online Tool:** [llmstxtvalidator.org](https://llmstxtvalidator.org/) or [Spindora](https://spindorai.com/)
- **Codebase Check:** Inspect [`public/llms.txt`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/public/llms.txt) and [`app/llms.txt/route.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/llms.txt/route.ts).
- **CLI Check:**
  ```powershell
  curl -sI https://medhanshk.me/llms.txt | Select-String "content-type|HTTP/"
  curl -s https://medhanshk.me/llms.txt
  ```
- **Pass/Fail Criteria:**

  | Check | Pass? |
  |-------|-------|
  | HTTP 200 response | |
  | MIME type is `text/plain` or `text/markdown` | |
  | Contains `# Medhansh Kapoor` (H1 header) | |
  | Contains blockquote summary (`>`) | |
  | Contains `## Section` headings with annotated links | |
  | Links to `/`, `/projects`, `/experience`, `/about` | |
  | Self-contained entity Q&A ("Who is Medhansh Kapoor?") | |
  | UTF-8 encoding | |

### 7.3 WebMCP / Agentic Readiness `[seo.md §0 agentic-browsing]`
- **Online Tool:** Lighthouse Agentic Browsing category (Chrome 150+)
- **Codebase Check:** Verify clean accessibility tree — all interactive elements have programmatic names. No `aria-label` on forbidden roles.
- **Pass/Fail Criteria:**
  - Agentic Browsing pass-ratio ≥ 80%.
  - `llms.txt` audit passes.
  - CLS ≤ 0.1 (stability for agent interaction).

> [!NOTE]
> **WebMCP** is emerging — it lets sites declare "tools" for AI agents. For a portfolio site, this is low-priority but worth monitoring as the ecosystem matures.

---

## Phase 8 — AI / GEO / AEO

### 8A. Technical Foundation `[seo.md §8A.1–8A.4]`
- **Codebase Check:**
  - [`app/robots.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/robots.ts) allows all AI crawlers (cross-ref Phase 2.1).
  - SSR stream delivers entity content:
    ```powershell
    curl -s https://medhanshk.me/about | Select-String "Medhansh Kapoor is an AI/ML Engineer"
    ```
  - `SpeakableSpecification` in [`app/lib/jsonld.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/lib/jsonld.tsx) targets `#entity-definition` and `#faq-section`.
  - `dateModified` is present and recent (cross-ref Phase 5.5).
- **Pass/Fail Criteria:** Entity definition appears in raw HTML (not behind JS). `SpeakableSpecification` is valid. AI bots are unblocked. `dateModified` ≤ 30 days old.

### 8B. Content Architecture for AI Extraction `[seo.md §8B.1–8B.6]`
- **Codebase Check:** [`app/about/AboutView.tsx`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/about/AboutView.tsx) and [`app/data/profile.ts`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/app/data/profile.ts).
- **Pass/Fail Criteria:**

  | Check | Pass? |
  |-------|-------|
  | FAQ visible on `/about` with ≥ 4 questions `[§8B.1]` | |
  | Q1: "Who is Medhansh Kapoor?" | |
  | Q2: "What production AI systems has Medhansh built?" | |
  | Q3: "Where has Medhansh interned?" | |
  | Q4: "What technologies does Medhansh specialize in?" | |
  | Each FAQ answer is 40–60 words, self-contained `[§8B.1]` | |
  | No "as mentioned above" or cross-section references (modular/chunkable) `[§8B.3]` | |
  | Question-based `<h3>` headings in FAQ section `[§8B.4]` | |
  | Citable metrics present: `0.68 mAP50`, `70.3% precision`, `256 tickets`, `4,582 chunks`, `1,410 Neo4j nodes` `[§8B.5]` | |
  | Comparison positioning (GraphRAG vs generic chatbots) `[§8B.6]` | |
  | `FAQPage` JSON-LD matches visible Q&A (content parity) `[§8B.1]` | |
  | Content tone: declarative, present-tense, extractable `[§8B.2]` | |

### 8C. Anti-Pattern Check `[seo.md §8D]`
- **Codebase Check:**
  - No keyword stuffing (unnatural repetition of "Medhansh Kapoor").
  - No thin/duplicate pages.
  - No artificial chunking or fake mentions.
- **Pass/Fail Criteria:** Content reads naturally. Every page has unique, substantial content.

### 8D. AI Answer Extraction Test (Manual)
- **Method:** Copy the raw HTML output of `/about` into a clean ChatGPT/Claude session and ask: "Based on this page, who is Medhansh Kapoor?"
- **Pass/Fail Criteria:** The AI response accurately identifies Medhansh Kapoor as an AI/ML Engineer, mentions IndiaAI Mission, and references ≥ 1 project with a specific metric.

---

## Phase 9 — Off-Page SEO & Entity Disambiguation

### 9A. Profile & Entity Consistency `[seo.md §9A.1, §9A.2]`

| Platform | Check URL | Name | Title | Website | Pass? |
|----------|-----------|------|-------|---------|-------|
| LinkedIn | [Profile](https://www.linkedin.com/in/medhansh-kapoor) | `Medhansh Kapoor` | `AI/ML Engineer & Full-Stack Developer` | `https://medhanshk.me` | |
| GitHub | [Profile](https://github.com/Medhansh-741) | `Medhansh Kapoor` | — | `https://medhanshk.me` | |
| X | [Profile](https://x.com/medhansh541) | `Medhansh Kapoor` | — | `https://medhanshk.me` | |
| Instagram | [Profile](https://www.instagram.com/medhansh341/) | `Medhansh Kapoor` | — | `https://medhanshk.me` | |
| cal.com | [Profile](https://cal.com/medhansh541) | `Medhansh Kapoor` | — | — | |

- **Pass/Fail Criteria:** Identical `Name + Title + Link` across all 5. Zero inconsistencies.

### 9B. GitHub Profile README `[seo.md §9B.1–9B.3]`
- **Online Tool:** [GitHub Profile](https://github.com/Medhansh-741/Medhansh-741)
- **Reference:** [`github-profile-readme.md`](file:///c:/Users/medha/OneDrive/Desktop/portfolio/github-profile-readme.md)
- **Pass/Fail Criteria:**
  - First line: `"Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer"`.
  - Link to `https://medhanshk.me`.
  - Pinned repos: `JanSamadhan` and `NyayaAI` with READMEs, badges, and demo links.
  - Website field: `https://medhanshk.me`.

### 9C. Wikidata Entity `[seo.md §9C.1]`
- **Online Tool:** [Wikidata Q141155822](https://www.wikidata.org/wiki/Q141155822)
- **Pass/Fail Criteria:**

  | Property | Required Value | Present? |
  |----------|---------------|----------|
  | `instance of` | `human` | |
  | `occupation` | `software engineer` / `machine learning engineer` | |
  | `educated at` | `Manipal University Jaipur` | |
  | `employer` | `IndiaAI Mission (MeitY)` | |
  | `official website` | `https://medhanshk.me` | |
  | `social media` | GitHub, LinkedIn, X | |
  | `country of citizenship` | India | |
  | `residence` | Jaipur | |

### 9D. Content & Backlink Presence `[seo.md §9D.1–9D.3, §9E.1–9E.3]`

| Channel | Action | Status |
|---------|--------|--------|
| [Dev.to](https://dev.to) / [Medium](https://medium.com) / [Hashnode](https://hashnode.com) | ≥ 1 technical writeup with `canonical_url: medhanshk.me` | |
| [Devpost](https://devpost.com) | JanSamadhan / NyayaAI project listings | |
| [Product Hunt](https://www.producthunt.com) | Tool listing (optional) | |
| [Google Alerts](https://www.google.com/alerts) | Alert for `"Medhansh Kapoor"` | |
| Open-source contributions | ≥ 1 PR to notable repo with name attribution | |
| University/hackathon pages | Request backlinks from India Innovates, Prayatna, IndiaAI Mission press | |
| Hackathon event recaps | Blog post for each won hackathon | |

### 9E. Community Presence `[seo.md §9F.1–9F.3]`

| Platform | Action | Status |
|----------|--------|--------|
| Reddit | Answers in r/MachineLearning, r/webdev, r/IndianDeveloper | |
| Stack Overflow | Profile with `medhanshk.me` link, ≥ 1 quality answer | |
| Speaking / Podcasts | ≥ 1 tech talk or interview (YouTube, university, podcast) | |

- **Pass/Fail Criteria:** At least 1 blog post published. Google Alerts configured. ≥ 1 community presence established.

---

## Phase 10 — Knowledge Panel & AI Citation

### 10A. Knowledge Panel Health Check `[seo.md §10A]`
- **Manual Test:** Search Google in Incognito for `"Medhansh Kapoor"`.
- **Pass/Fail Criteria:**

  | Check | Pass? |
  |-------|-------|
  | `#1` organic result is `https://medhanshk.me` | |
  | Sitelinks appear for `/projects`, `/experience`, `/about` | |
  | Knowledge Panel visible (6–18 month timeline) | |

  **Post-panel steps (when applicable):**
  - [ ] Claim via "Claim this knowledge panel" link
  - [ ] Review for accuracy and suggest edits
  - [ ] Maintain entity consistency to prevent degradation

### 10B. AI Citation Matrix (Monthly) `[seo.md §10B]`

| # | AI Engine | Exact Prompt | Success Criteria |
|---|-----------|--------------|------------------|
| 1 | **ChatGPT** | `"Who is Medhansh Kapoor?"` | Cites `medhanshk.me`, mentions IndiaAI / DRDO & JanSamadhan / NyayaAI |
| 2 | **Perplexity** | `"Who is Medhansh Kapoor?"` | Lists `medhanshk.me`, GitHub, LinkedIn as direct numbered sources |
| 3 | **Gemini** | `"Who is Medhansh Kapoor?"` | Disambiguates from filmmaker; recognizes AI/ML engineer from Jaipur |
| 4 | **Google Search** | `"Medhansh Kapoor"` | AI Overview / Featured Snippet quotes `medhanshk.me/about` |
| 5 | **ChatGPT** | `"Best AI/ML engineer portfolio India"` | Retrieves `medhanshk.me` among top references |
| 6 | **Perplexity** | `"NyayaAI legal AI tool"` | Cites Medhansh Kapoor as creator with GraphRAG architecture |

> [!TIP]
> **Share of Model (SoM):** `SoM = (Prompts citing brand ÷ Total prompts) × 100`. Track trends over 4–6 weeks. Tools: **Peec AI**, **Rankscale AI**, **Otterly.ai** for automation.

### 10C. Training Data Breadth `[seo.md §10B training data strategy]`
- **Evaluation:** Count independent, indexed sources mentioning "Medhansh Kapoor" with consistent facts:

  | Source | Indexed? | Consistent? |
  |--------|----------|-------------|
  | `medhanshk.me` | | |
  | GitHub profile | | |
  | LinkedIn profile | | |
  | Wikidata Q141155822 | | |
  | Blog post (Dev.to / Medium) | | |
  | Devpost project listing | | |

- **Pass/Fail Criteria:** ≥ 3 independent indexed sources corroborate the entity with consistent facts.

---

## Phase 11 — Monitoring Cadence & Content Refresh `[seo.md §11]`

### Monitoring Schedule

| Frequency | Action | Tool / Link |
|-----------|--------|-------------|
| **Weekly** | Check GSC indexing errors & ranking position | [GSC Performance](https://search.google.com/search-console/performance/search-analytics) |
| **After Every Deploy** | Request Indexing for updated URLs; test robots/sitemap | [GSC URL Inspection](https://search.google.com/search-console/inspect) |
| **Monthly** | Re-run Mobile Lighthouse + CrUX field data check | [PageSpeed Insights](https://pagespeed.web.dev/) |
| **Monthly** | Run 6-query AI citation matrix (Phase 10B) | ChatGPT, Perplexity, Gemini, Google Search |
| **Monthly** | Check AI referral traffic in GA4 (Phase 1.5) | [GA4 Reports](https://analytics.google.com/) |
| **Monthly** | Check Google Alerts for unlinked brand mentions → outreach | [Google Alerts](https://www.google.com/alerts) |
| **On Schema Change** | Validate JSON-LD through all 3 validators (Phase 4.1) | Schema.org, Rich Results, JSON-LD Playground |
| **Quarterly** | Full Lighthouse re-audit + SecurityHeaders check | Lighthouse CLI + [SecurityHeaders.com](https://securityheaders.com/) |
| **Quarterly** | Review/update project metrics, dateModified, FAQ content | Codebase + sitemap.ts |
| **Quarterly** | Check GSC "Generative AI" performance report | [GSC](https://search.google.com/search-console/) |

### Content Refresh Schedule `[seo.md §11 content refresh]`

| What | Frequency | Why |
|------|-----------|-----|
| Project metrics (mAP50, precision, chunks) | Quarterly or on change | Freshness signal; LLMs cite current numbers |
| Answer-first definition (5.6) | When role/employer changes | Must reflect current truth |
| FAQ section (8B) | When new projects/roles added | Expand Q&A coverage |
| Blog posts (9D) | 1 new post every 1–2 months | Compound backlinks + training data |
| `dateModified` / "last updated" | On every content change | Machine-readable freshness signal |
| `llms.txt` (7.2) | On significant content change | Keep AI agent summary current |

---

## Scoring Summary

| Phase | Check | Pass/Fail | Notes |
|-------|-------|-----------|-------|
| **0.1** | Lighthouse Mobile Performance ≥ 90 | | |
| **0.1** | Lighthouse Mobile Accessibility ≥ 95 | | |
| **0.1** | Lighthouse Mobile Best Practices = 100 | | |
| **0.1** | Lighthouse Mobile SEO = 100 | | |
| **0.1** | Agentic Browsing ≥ 80% | | |
| **0.2** | CrUX LCP ≤ 2.5s (p75) | | |
| **0.2** | CrUX INP ≤ 200ms (p75) | | |
| **0.2** | CrUX CLS ≤ 0.1 (p75) | | |
| **0.2** | FCP < 1.8s | | |
| **0.2** | TBT < 200ms | | |
| **0.3** | All 5 endpoints HTTP 200 | | |
| **0.4** | Zero console/hydration errors | | |
| **0.5** | No INP > 200ms interactions | | |
| **0.6** | No unused icon imports; LinkedIn renders | | |
| **1.1** | GSC verified, 0 indexing errors | | |
| **1.2** | Bing sitemap processed, 0 errors | | |
| **1.3** | GA4 file_download event fires | | |
| **1.4** | KPI baseline documented | | |
| **1.7** | No keyword cannibalization | | |
| **1.8** | Keyword map alignment verified | | |
| **2.1** | robots.txt correct + 11 AI bots allowed | | |
| **2.2** | sitemap.xml valid, 5 URLs, ISO dates | | |
| **2.3** | All pages have self-referencing canonical | | |
| **3.1** | 4 pages have unique title + description + Server Component | | |
| **3.1** | title.template pattern present | | |
| **3.2** | OG + Twitter tags present in SSR HTML (all pages) | | |
| **4.1** | Schema.org Validator: 0 errors | | |
| **4.1** | Rich Results Test: 0 errors | | |
| **4.1** | JSON-LD Playground: no syntax errors | | |
| **4.1** | Entity graph linked via @id #person | | |
| **4.1** | sameAs: 6 entries (incl. Wikidata) | | |
| **4.1** | worksFor: 3 employers present | | |
| **4.1** | alumniOf: 2 institutions present | | |
| **4.1** | knowsAbout: ≥ 42 skills | | |
| **4.1** | FAQPage schema = visible Q&A (parity) | | |
| **5.1** | Single `<h1>` per page | | |
| **5.2** | 5 rel="me" links + 5 reciprocal links | | |
| **5.3** | Zero broken anchors, clean slugs | | |
| **5.4** | No heading level skips | | |
| **5.5** | dateModified present and ≤ 30 days old | | |
| **5.6** | Answer-first definition present | | |
| **5.6** | Zero missing alt attributes | | |
| **5.7** | Internal linking map: 8/8 satisfied | | |
| **5.8** | E-E-A-T: visible credentials + contact | | |
| **6.1** | Media < 2MB initial load | | |
| **6.2** | LCP ≤ 2.5s mobile | | |
| **6.3** | font-display: swap on all fonts | | |
| **6.4** | SecurityHeaders.com: A+ | | |
| **6.4** | CSP header present | | |
| **6.4** | Permissions-Policy header present | | |
| **6.5** | Favicon 48×48 served | | |
| **6.5** | 404 page has recovery links | | |
| **7.1** | 0 axe violations (all 4 pages) | | |
| **7.1** | SVG accessibility (aria-hidden / aria-label) | | |
| **7.1** | Color contrast ≥ 4.5:1 | | |
| **7.1** | Touch targets ≥ 48×48px | | |
| **7.2** | llms.txt: HTTP 200 + correct MIME + valid structure | | |
| **7.3** | Agentic Browsing ≥ 80% | | |
| **8A** | Entity definition in raw HTML (SSR) | | |
| **8A** | SpeakableSpecification valid | | |
| **8B** | FAQ: 4 questions visible + self-contained | | |
| **8B** | Content modularity (no "as mentioned above") | | |
| **8B** | Citable metrics present (5 specific numbers) | | |
| **8B** | Comparison positioning present | | |
| **8C** | No anti-patterns (no stuffing, no thin pages) | | |
| **8D** | AI extraction test passes | | |
| **9A** | 5/5 profiles consistent | | |
| **9B** | GitHub README optimized | | |
| **9C** | Wikidata: 8/8 properties populated | | |
| **9D** | ≥ 1 blog post + Google Alerts configured | | |
| **9E** | ≥ 1 community presence established | | |
| **10A** | #1 organic for "Medhansh Kapoor" | | |
| **10B** | AI citation matrix logged (6 prompts) | | |
| **10C** | ≥ 3 independent indexed sources | | |
| **11** | Monitoring schedule established | | |
| **11** | Content refresh schedule documented | | |
| **TOTAL** | **___ / 68 checks** | | |