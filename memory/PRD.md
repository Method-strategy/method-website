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


## July 2026 — SEO Technical Completion Pass & Launch Complete
- Nav wordmark now smooth-scrolls to top when clicked from `/` (consistent affordance across every page — was previously a no-op on homepage). See Nav.jsx `handleWordmarkClick`.
- **JSON-LD structured data** implemented in `prerender-og.js` (baked into raw HTML, sentinel-bounded, idempotent):
  - Every indexable page: Organization (name, url, logo, founder, foundingDate 2020, sameAs LinkedIn) + WebSite + Person (Gary Hopkins, jobTitle "Founder and Principal", sameAs LinkedIn).
  - `/` adds ProfessionalService (serviceType fractional CMO/strategic marketing, areaServed United States).
  - All 11 writing posts + `/about/discernment` add Article (headline, description, author→Person, publisher→Org, mainEntityOfPage, datePublished = single site-launch date 2026-07-07 stored as `SITE_LAUNCH_DATE` constant, image = og-default).
  - `/404` emits no schema (noindex).
  - Zero invented data — no aggregateRating, review, address, phone. Constants at top of prerender-og.js: SITE_LAUNCH_DATE, ORG_LOGO_URL, ORG_LINKEDIN, PERSON_LINKEDIN.
- **Live acceptance test passed** (curl, no JS) against methodmarketinggroup.com: JSON-LD present in raw HTML for homepage, article (writing), /about, /about/discernment, case study. Correct schema graph per page type. All @id refs resolve. robots.txt + sitemap.xml (21 URLs) verified live.
- **Technical audit results**: 22/22 pages have exactly one H1; heading hierarchy has no skips (fixed WorkDetail h1→h3 → h1→h2 on "Next Engagement" title); all `<img>` have alt; zero generic anchor text; robots.txt allows crawling and references sitemap; sitemap auto-updates when a writing.js/caseStudies.js slug is added. Flagged only (not rewritten per instruction): 9 titles > 60 chars and 2 meta descriptions > 160 chars — all authored editorial voice, documented in SEO_PLAYBOOK.md §10.
- **`SEO_PLAYBOOK.md` created at /app/SEO_PLAYBOOK.md** — 12-section replacement for the WordPress/RankMath plugin interface. Documents where SEO source-of-truth lives, how to edit titles/descriptions, how to add a new writing post (fully automated downstream: sitemap, RSS, Article schema, share cards, prerender all update), the build command chain, structured-data reference, sitemap/robots, legacy redirects, and the exact curl acceptance test protocol.
- Colour system verified: `#f5f1eb` (cream) is the single Tailwind `bg-cream`/`text-cream` token used everywhere; zero `bg-white`/`text-white` in components; the only `#ffffff` values live in `@media print { }` (intentional paper output). Site colour audit clean.
- **SITE LAUNCH FULLY COMPLETE.** SEO, deploy, redirects, verification (Google + Bing), structured data, playbook — all shipped.

## July 2026 — Field LCP Fix: CSS-only hero reveals (post-Clarity 4.2s report)
- Root cause of persistent 4.2s field LCP (despite 112ms lab): every page's hero was framer-motion animated with `initial={{opacity:0}}`, baking `style="opacity:0"` into the prerendered HTML. Real users saw a blank hero until the full JS bundle downloaded + hydrated + animated (~4s on median mobile). Lab tests on fast connections never showed it.
- Fix: `Reveal`/`RevealStagger`/`RevealItem` (Reveal.jsx) now accept a `hero` prop → renders plain elements with `.hero-stagger`/`.hero-reveal` CSS classes (index.css) that replicate the framer entrance exactly (y24px, 900ms, cubic-bezier(0.16,1,0.3,1), 140ms nth-child stagger, prefers-reduced-motion respected). Zero JS dependency — heroes paint on first frame.
- Applied `hero` to the above-the-fold block of all 10 pages using reveals (Home, About, Work, Writing, Connect, Discernment, WritingDetail, NotFound, PrivacyPolicy, Sitemap). WorkDetail never used reveals. Below-the-fold sections keep scroll-triggered framer reveals.
- Full build pipeline re-run and verified: no `opacity:0` in first 3000 chars of `<main>` on any route; heroes render correctly in preview screenshots (home + article); no hydration errors.
- SEO_PLAYBOOK.md: added Rule 4 ("Never gate above-the-fold visibility behind JavaScript") + verification snippet to §12.3, new anti-pattern in §12.5, updated baseline §12.6, corrected §12 subsection numbering (was mislabeled 11.x).
- Expected side benefit: INP (270ms) should improve — less framer main-thread work on load/navigation.
- NOTE: Clarity field numbers are a rolling window; expect drift down over 3–7 days post-deploy. User must push to Netlify (Save to GitHub) to ship.

## July 2026 — Analytics trailing-slash split fix
- User reported Clarity counting `/writing/the-gap-series-introduction` and `.../introduction/` (and `/work` vs `/work/`) as separate pages. Root cause: Netlify 301s bare paths to trailing-slash for directory-index sites, so hard navigations record `/foo/` while SPA navigations record `/foo`.
- Fix: inline URL-normalizer script in public/index.html `<head>`, placed ABOVE the GA4 + Clarity tags — strips trailing slash via history.replaceState before analytics capture the URL. Unifies all pageviews on the canonical non-slash form (matches canonical/sitemap/og:url).
- Verified: script present in all 22 prerendered routes post-build (survives strip-emergent); e2e confirmed `/work/` and article slash URLs normalize before load and render fully.
- Documented as SEO_PLAYBOOK.md §9.0 (with ordering rule: normalizer must stay above analytics tags). Historic split data remains; new sessions unify. Needs Netlify deploy to take effect.

## July 2026 — Trailing-slash fix redone at HTTP layer (flat-file SSG output)
- User (via Claude-authored spec) required the duplicate-pageview fix at the HTTP layer, not client-side. Previous JS replaceState normalizer REMOVED from public/index.html.
- Canonical URL policy: non-trailing-slash (only / is exception). Audit confirmed canonicals, sitemap, og:url, RSS links, JSON-LD mainEntityOfPage, and all internal links already non-slash — no disagreements.
- Mechanism: Netlify edge normalization is layout-driven and cannot be overridden via _redirects. Switched SSG output from `route/index.html` to flat `route.html` (build/work.html, build/writing/{slug}.html, build/about/discernment.html). On Netlify this makes /foo serve 200 and /foo/ 301 → /foo (previously the reverse).
- Files changed: prerender-og.js (flat write + sanity paths), prerender-ssg.js (shellPathForRoute), indexnow-ping.js (filePathToUrl for .html), build-and-serve.js (Netlify-parity preview: clean URLs, slash→301, real 404 status instead of SPA 200 fallback), public/index.html (normalizer removed), SEO_PLAYBOOK.md §9.0 rewritten as "Canonical URL policy" with live acceptance curl script.
- Verified on preview (Netlify-parity server): /work/, /about/, /about/discernment/, /writing/the-gap-series-introduction/ all 301 → non-slash → 200; / 200; /nope 404; rss.xml, sitemap.xml, IndexNow key file 200; SSG content, JSON-LD, canonicals intact; SPA hydration + client-side nav work from flat files; hero CSS reveal unaffected.
- PENDING: live-production curl acceptance (playbook §9.0) must be run AFTER the user deploys via Save to GitHub — live still shows old 301 direction until then. Legacy WordPress 301s and 404 behavior unaffected (only _redirects governs those; file untouched).

## July 2026 — Live acceptance PASSED + GA4 email_click conversion event
- LIVE acceptance (post user deploy): all 11 routes 200 non-slash; 7 sampled trailing-slash URLs 301 → non-slash; 404 both forms; legacy WP 301s intact; IndexNow key, sitemap, RSS, robots 200; SSG content + canonical + Article schema + CSS hero all confirmed on production. Trailing-slash fix is fully live.
- GA4 `email_click` event implemented: new hook `src/hooks/useMailtoTracking.js` (delegated capture-phase document listener, called from AppShell). Fires on ANY mailto click sitewide (Connect CTA, footer, Home CTA, Discernment, privacy-policy links, ShareRow email share, future links). Params: page_path/page_title (gtag reserved fields → land as standard Page path/Page title dimensions via dl/dt — verified on the wire) + custom ep.link_url/ep.link_text.
- Wire-verified on preview: /g/collect hit carried en=email_click, dl=…/writing/wrap-rage, dt=article title, ep.link_url, ep.link_text. NOTE: GA4 batches events into POST bodies; check post_data not just URLs when verifying.
- Privacy policy deliberately unchanged: standard interaction event, no new data category, covered by existing GA4 disclosure (documented in playbook).
- SEO_PLAYBOOK.md §9.7 added: event spec, param table with reserved-field mapping, GA4 UI click-path for Key event registration (Admin → Data display → Key events → New key event → `email_click`), verification method, mailto-measures-intent limitation.
- PENDING: mailto code needs the NEXT Save to GitHub deploy to reach live; then user registers key event in GA4 UI and confirms in Realtime. LCP/INP recheck at 72h mark.

## July 2026 — linkedin_click event added
- Generalized the mailto hook into `src/hooks/useContactTracking.js` (useMailtoTracking.js deleted): one delegated listener fires `email_click` (mailto:) and `linkedin_click` (linkedin.com links — footer/Connect "Connect on LinkedIn", Gary's About profile, ShareRow LinkedIn share). Same params: page_path/page_title (→ dl/dt standard dimensions) + ep.link_url/ep.link_text.
- Wire-verified both events on preview from /writing/wrap-rage: linkedin_click carried link_url=company page, dl=article URL, dt=article title; email_click regression passed.
- Playbook §9.7 retitled "Contact-intent events" covering both; key-event registration steps now include linkedin_click.
- PENDING: user deploys (Save to GitHub), clicks both link types on live, registers BOTH as key events in GA4 UI. LCP/INP recheck at 72h.

## July 2026 — Analytics hostname guard (previews silent) + preview noindex
- GA4 + Clarity snippets in public/index.html rewritten as ONE guarded IIFE: only initialize when hostname is methodmarketinggroup.com or www. On previews/localhost/permalinks: no loaders injected, gtag & clarity undefined, zero requests to googletagmanager/google-analytics/clarity.ms.
- Shared guard `src/hooks/analyticsHost.js` (isAnalyticsHost) added to useGAPageView and useContactTracking so SPA navigation/events on previews stay silent.
- Preview noindex: Emergent ingress already injects X-Robots-Tag + robots meta on preview responses (verified NOT in build artifact; live /work has neither). build-and-serve.js now also sends X-Robots-Tag: noindex, nofollow on every response (preview-only server, can't leak — Netlify never runs it).
- Acceptance PASSED: preview = 0 analytics requests across load + SPA navs + mailto click; LIVE production = GA + Clarity firing, live email_click captured with dl=/writing/wrap-rage + article title (completes earlier live mailto verification).
- Playbook §9.8 added: guard spec, maintenance rules (dual copies of hostname check), testing implication (analytics verifiable only on live URL / GA4 DebugView), historical preview rows note (filter by hostname).
- PENDING: user deploys guard via Save to GitHub (production behavior unchanged — hostname matches); GA4 key-event registration for email_click + linkedin_click still on user.
