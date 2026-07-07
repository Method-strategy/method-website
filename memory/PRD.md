# Method — Marketing Site (PRD)

## Original Problem Statement
Marketing website for Method, a strategic marketing practice (fractional CMO-level, B2B). Visual language derived from the business card: navy dominant (#13243d), warm white (#f5f1eb), steel blue accent (#5A7D9A), body (#444444). Typography-first. No hero images. Scandia paired with Cormorant Garamond. Four pages of real copy (Home, Work, About, Connect) plus Writing at launch. Site deploys to Netlify at methodmarketinggroup.com. Marketing-only scope — single contact mechanism is email; no forms, no Calendly.

## Architecture
- Frontend-only React (CRA + craco) SPA. React Router 7.
- No backend logic used by the site (default template server.py untouched, MongoDB unused).
- Fonts: Adobe Typekit kit `https://use.typekit.net/kiu8ndx.css` (Scandia) + Cormorant Garamond via Google Fonts + Manrope fallback.
- Tailwind with custom color tokens `navy`, `cream`, `steel`, `ink`.
- Deploys to Netlify (static build).

## User Personas
1. **Established B2B firm operator** — has outgrown current market presence, seeking senior strategic help.
2. **Growth-stage founder/COO** — needs CMO function built pre-raise or pre-commercial push.
3. **Referral / warm inbound** — read the card or heard about Gary; validating the practice.

## Core Requirements (locked)
- Real copy verbatim from client-provided doc, no placeholder text.
- Business-card aesthetic on the hero (wordmark + serif tagline).
- Warm-white dominant with navy hero + navy footer.
- Editorial list treatments — no bento grids, no shadowed cards.
- No forms anywhere. Email-only contact.
- Data-testids on every interactive/informational element.

## What's Been Implemented (2025-12)
- **Routes**: `/`, `/work`, `/work/:slug` (manufacturing-performance, medtech), `/about`, `/writing`, `/writing/:slug` (8 mock posts), `/connect`.
- **Global**: fixed Nav with cream/navy variants and mobile hamburger; navy Footer (hidden on /connect).
- **Home**: navy hero (wordmark + serif tagline), opening statement (lede), The Model, Who We Work With (Situation i/ii chapter-num pattern), navy CTA band.
- **Work**: page opener, 7-capability editorial list, two case-study cards linking to detail pages.
- **Work Detail**: chapter-num opener, situation lede + body, numbered scope list, navy outcome band, next-case-study link.
- **About**: philosophy lede, stats row (2020 / 4–5 / 40 yrs / 1), Gary Hopkins bio, writing tease.
- **Writing**: featured post + 7-item editorial list.
- **Writing Detail**: title, meta strip, dek, body, byline, "More writing" list.
- **Connect**: navy full-screen page with large mailto wordmark, sub-links, and no forms.
- **Assets**: favicon from client, tagline reference to business card, no hero images.
- **Testing**: 100% pass on frontend testing agent iteration 1 (routing, testids, mailtos, mobile nav, typography, no-forms guarantee).

## Session 2026-02 — Typography Refinement Pass
- Added Cormorant Garamond italic emphasis blurbs in steel blue (About page, ≥ text-3xl per typography rules).
- Switched body copy to Akzidenz-Grotesk Next Pro via Adobe Typekit (replacing Söhne consideration for cost).
- Rebuilt hero as 2-column layout with vertical hairline divider and centered alignment.
- Discernment page added; Save-as-PDF + ShareRow on Work / Writing detail pages.
- Netlify config finalized: `/app/netlify.toml` + `/app/frontend/scripts/strip-emergent.js` post-build to strip Emergent branding.
- LinkedIn logo in navy footer (official brand bug).
- **H2 subhead leading fix (2026-02)**: scoped `h2.wordmark { line-height: 1.15 }` in `index.css` to beat Tailwind's bundled `md:text-4xl` line-height. Fixes the "characters colliding with line above" issue where `.wordmark` global 0.85 leading + Tailwind utility bundling caused 40px lh on 56px font. All H2 subheads now compute to lh ratio 1.150. Verified via `testing_agent_v3_fork` iteration 13.
- **Per-route SEO / social share meta (2026-02)**: added `/app/frontend/scripts/prerender-og.js` post-build step that generates 19 static `build/{route}/index.html` files, each with its own `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:type` (article for posts + case studies, website for index pages), `og:url`, `og:site_name`, `og:image` (1200×630), `twitter:card`, and `<link rel="canonical">`. LinkedIn / Twitter / iMessage crawlers get correct per-post unfurl cards without JS execution. Added `useDocumentTitle` hook in `/app/frontend/src/hooks/useDocumentTitle.js` so browser tab title also updates during client-side navigation. Route manifest is generated dynamically from `writing.js` + `caseStudies.js` — adding a new post automatically produces a new prerendered shell. Idempotent: uses `<meta name="method-seo-block">` sentinel tags (not HTML comments — CRA strips those during minification) so the block is replaced cleanly on every rebuild. `netlify.toml` build command chained: `yarn build → strip-emergent → prerender-og → generate-sitemap`.

- **Sitewide typographic OG image (2026-02)**: `/app/frontend/public/og-default.jpg` (1200×630, 64 KB) — real Scandia display + Cormorant italic "show up" in steel blue, on navy, with wordmark + eyebrow + hairline divider + domain in the corner. Rendered from an HTML template via Playwright/Chromium so real Typekit + Google fonts are baked in as pixels. No stock photography (per client's "images are a bit of a trap" instruction).

- **Sitemap + robots.txt (2026-02)**: `/app/frontend/scripts/generate-sitemap.js` emits `build/sitemap.xml` (19 URLs, tuned changefreq + priority) and `build/robots.txt` referencing the sitemap. Auto-discovers new writing posts on every build.

## Session 2026-02 (part 2) — Editorial finalize
- **Blog dates removed everywhere.** `writing.js` posts no longer carry `date` / `dateIso` — sequencing is now array-order only. `Writing.jsx` and `WritingDetail.jsx` stripped of every date-rendering hook. Sitemap uses build day for `lastmod`, RSS uses staggered per-post pub dates around build time.
- **Release order + Gap Series renumbering.** New canonical order: Intro → Gap No. 1 (perforations) → No. 2 (wrap rage) → PoV Bernbach → No. 3 (phone tree) → No. 4 (cancel anytime) → PoV CX religion → No. 5 (touchscreens) → No. 6 (loyalty) → No. 7 (Trader Joe's) → PoV AI (closer, hands off to Discernment). Gap Series eyebrows now read "Gap Series · No. 1..7"; PoV posts show "Point of View" with no number. Verified by testing agent iteration 14.
- **Line-spacing dialed back.** Sitewide `h2.wordmark { line-height: 1.06 }` (was 1.15 — too open). `.lede` → 1.15 (was 1.22). `.pull` → 1.18 (was 1.28). All Writing-page featured/archive H2s trimmed to `leading-[1.14]` / `leading-[1.18]` inline overrides. Verified no character collisions on any breakpoint.
- **Connect H1 fixed** to use `wordmark` (Scandia display) with a Cormorant italic accent line ("*a conversation.*" in steel blue), matching the site's H1 pattern. Was serif-only, which broke the "Scandia for display" typography rule.
- **RSS feed.** `/app/frontend/scripts/generate-rss.js` emits `build/writing/rss.xml` (11 items, full HTML in `content:encoded`, staggered pub dates, LinkedIn Newsletter–compatible). "Subscribe · RSS" link added to Writing opener.
- **ShareRow on WorkDetail.** Case study detail pages now render the same LinkedIn/X/Email/Copy-link share row + Save-as-PDF row as writing posts. Was missing per the testing agent's iteration-14 gap analysis.
- **Netlify build chain**: `yarn install && yarn build && strip-emergent → prerender-og → generate-sitemap → generate-rss`.

## Session 2026-02 (part 3) — True Static Site Generation
- **Full SSG shipped** at `/app/frontend/scripts/prerender-ssg.js`. Every page's React tree is now rendered to a static HTML string at build time via `react-dom/server` + `<StaticRouter>`, then injected into that route's `<div id="root">` shell. AI answer engines (Claude, Perplexity, ChatGPT browsing, Google AI Overview) and non-JS crawlers now see the actual page content — full essay body, case study copy, headlines, prose — instead of an empty `#root`. Verified: `/writing/wrap-rage/` static HTML is 27KB with all 10 body paragraphs baked in.
- **Client hydration**: `src/index.js` now uses `hydrateRoot` when `#root` has prerendered children, `createRoot` otherwise (keeps `yarn start` dev workflow intact).
- **SSR hardening**: SSR entry (`scripts/ssr-entry.jsx`) wraps the app in `<MotionConfig reducedMotion="user">` so framer-motion's SSR/CSR mismatch on the `useReducedMotion` hook is neutralized — zero hydration warnings verified in Chromium.
- **Refactor**: `App.js` exports `AppShell` (was inline `Shell`) so the same shell renders under BrowserRouter (client) and StaticRouter (SSG).
- **Build pipeline**: esbuild bundles the SSR entry to CJS on the fly; Node requires the bundle and calls `render(pathname)` per route. Tmp bundle is cleaned up on success.
- **Netlify build chain (final)**: `yarn install && yarn build && strip-emergent → prerender-og → prerender-ssg → generate-sitemap → generate-rss`.
- **Verified end-to-end**: served `build/` via python http.server, navigated to `/writing/wrap-rage/` — SSG content visible, React hydrated without errors, client-side nav to `/writing` updates `document.title` correctly. Curl on the same URL confirms all essay text is in the initial HTML response (26.3 KB).

## Prioritized Backlog

### P0 (must have — done)
- All four pages of copy live.
- Business-card hero fidelity.
- Navigation, mobile menu, footer.

### P1 (next moves worth considering)
- Netlify build config + `_redirects` for SPA history routing.
- Real blog CMS wiring (currently 8 mock posts in `/app/frontend/src/data/writing.js`) — swap for MDX or a headless CMS (Sanity / Contentlayer).
- Proper 404 page (currently catch-all renders Home).
- Meta / OG tags per route (`react-helmet-async`) for LinkedIn share cards.
- Client logo strip on Home or a discreet "Clients include" line on About (only if list can be shared).

### P2 (nice to have)
- Reduce-motion media query on `.reveal` animation.
- Print stylesheet for /work/:slug (case studies read well on paper).
- Sitemap.xml + robots.txt for launch SEO.
- Simple email obfuscation on the mailto to reduce scraping.

## Next Tasks List
1. ~~Confirm content of the 8 mock blog posts~~ DONE — 10 Gap Series/PoV posts finalized with author copy.
2. ~~Add OG/Twitter meta per route~~ DONE — prerender-og.js pipeline.
3. ~~Netlify deploy config~~ DONE — netlify.toml + full SSG script chain.
4. Custom domain DNS cutover (in progress by user).

## June 2026 — Deployment Finalization
- Site fully complete, SSG pipeline verified, user signed off on live Netlify deploy.
- Fixed Netlify "cancelled" deploys: added `ignore = "exit 1"` to netlify.toml [build] so builds always run despite `base = "frontend"` no-diff auto-cancel (Save-to-GitHub pushes sometimes touch no frontend files).
- User confirmed final version deployed and showing correctly on Netlify.
- DNS cutover COMPLETE: methodmarketinggroup.com live on Netlify with SSL, apex primary, www/http 301 → apex.
- Fixed canonical-domain bug: scripts preferred Netlify's `process.env.URL` (baked `.netlify.app` URLs into sitemap/RSS/canonical/OG). Removed env.URL from generate-sitemap.js, generate-rss.js, prerender-og.js — apex now hardcoded (SITE_URL env still overrides).
- Full live verification passed: sitemap, RSS, canonical, og:url/og:image, robots.txt, redirects, SSG content all correct on apex domain. SITE FULLY LAUNCHED (July 2026).
- Added styled 404 page (P1 backlog item): NotFound.jsx in Method voice ("This page doesn't exist. It may have once. Things have changed around here.") with Work/About/Writing/Connect links. Prerendered to build/404.html (noindex, real 404 status via _redirects), catch-all route now renders it instead of Home, useDocumentTitle fallback = "Page not found — Method".
- _redirects rewritten: legacy WordPress 301s (/marketing-strategy/*, /branding/*, /marketing-creative/*, /marketing-implementation/*, /how-we-work/* → /work; /whow-we-are/* + /who-we-are/* → /about; /method-marketers-blog/* → /writing; /connect-with-method-marketing/* → /connect), then /* → /404.html 404 (replaces old SPA 200 fallback — safe because every real route is prerendered).
- Legacy blog post mapping (user-approved via archived WordPress sitemap evidence): posts lived under /blog/ (not /method-marketers-blog/). Added /blog/actionable-marketing-insights-come-from-customer-journey-mapping/* → /writing/cx-became-a-religion 301, /blog/* → /writing 301.
- BingSiteAuth.xml added to frontend/public/ (serves at site root for Bing Webmaster verification).
- New /sitemap page (HTML, Method-styled, lists all pages + case studies + writing) and /privacy-policy page (full policy from user's docx, 13-section TOC with anchor links, categories table, mailto/external links). Both wired into: App.js routes, useDocumentTitle, prerender-og, prerender-ssg (22 routes now), generate-sitemap (21 URLs). Legacy /sitemap/ and /privacy-policy/ WordPress URLs resolve natively to these pages.
- Footer bottom line updated: "© {year} Method Marketing Group LLC. All Rights Reserved. | Sitemap | Privacy Policy".
- Privacy policy TOC converted to sticky left sidebar (numbered 01–13, pinned below nav on desktop, stacks on mobile).
- All verified locally: build chain OK, SSG output correct, screenshots confirm design. Awaiting user push to Netlify for live verification.
