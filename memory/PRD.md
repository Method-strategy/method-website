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
1. Confirm content of the 8 mock blog posts (currently written to fit the Method voice — user should approve or replace).
2. Add OG/Twitter meta per route before launch.
3. Netlify deploy config (build command, publish dir, `_redirects`).
4. Decide on blog CMS approach or keep hand-authored MDX.
