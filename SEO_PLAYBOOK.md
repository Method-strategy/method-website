# SEO_PLAYBOOK.md

**This file replaces the WordPress / RankMath plugin interface.** Any future
session should be able to read this and safely make SEO changes without
breaking the build.

Method's SEO is code, not a CMS. All SEO artifacts (titles, meta
descriptions, canonicals, Open Graph, Twitter cards, per-article
sharing card PNGs, JSON-LD structured data, sitemap, RSS, robots.txt,
IndexNow key + diff-based ping, the GA4 measurement tag, the Microsoft
Clarity tag, and the font-preload critical-path pattern that keeps Core
Web Vitals inside budget) are baked into the static HTML at build time
and served by Netlify as flat files. Nothing depends on JavaScript
execution at read time — Google, Bing, LinkedIn's unfurler, Claude,
Perplexity, and any other crawler sees the finished HTML.

---

## 1. Where the SEO source of truth lives

There is **no CMS**. Content and SEO metadata live in three places:

| Thing | File | Notes |
|---|---|---|
| Static route titles + descriptions | `frontend/scripts/prerender-og.js` → `staticRoutes` array | Home, /work, /about, /about/discernment, /writing, /connect, /sitemap, /privacy-policy, /404 |
| Writing posts (title, dek, share copy) | `frontend/src/data/writing.js` | `title` is the H1 + `<title>` prefix; `share` is the meta / OG description (fallback: `dek`) |
| Case studies (title, summary) | `frontend/src/data/caseStudies.js` | `title` is the H1 + `<title>` prefix; `summary` is the meta / OG description |
| JSON-LD constants (LinkedIn URLs, launch date, logo) | `frontend/scripts/prerender-og.js` → top-of-file constants | `SITE_LAUNCH_DATE`, `ORG_LOGO_URL`, `ORG_LINKEDIN`, `PERSON_LINKEDIN` |
| Domain / canonical | `frontend/scripts/prerender-og.js`, `frontend/scripts/generate-sitemap.js`, `frontend/scripts/generate-rss.js`, `frontend/src/hooks/useDocumentTitle.js` | `https://methodmarketinggroup.com` — hardcoded in all four |
| Legacy WordPress redirects | `frontend/public/_redirects` | Explicit 301 rules per old URL |
| Sitemap priorities / changefreq | `frontend/scripts/generate-sitemap.js` | Static routes list at top |
| IndexNow key file | `frontend/public/f2da102fbb1f98cf309ec46aeefef39e.txt` | Public; copied to build root by CRA; do not rename |
| IndexNow ping script | `frontend/scripts/indexnow-ping.js` | Diff-based; last step in build chain; see §8 |
| Google Analytics 4 tag | `frontend/public/index.html` head + `frontend/src/hooks/useGAPageView.js` | GA4 gtag.js snippet baked into every prerendered page; SPA route changes fire page_view; see §9 |
| Microsoft Clarity tag | `frontend/public/index.html` head | Clarity snippet baked into every prerendered page; handles SPA route changes natively; see §10 |
| Font-preload critical path | `frontend/public/index.html` head | Scandia woff2 preloads + Typekit `?display=swap` + non-blocking Google Fonts (Cormorant Garamond + Lexend Deca fallback); the pattern that keeps Core Web Vitals in the "good" band; see §12 |
| Per-article OG sharing cards | `frontend/scripts/generate-og-cards.js` + `og-default.jpg` for non-articles | Unique 1200×630 PNG per writing post / case study / Discernment essay, generated at build time; falls back to og-default.jpg on missing file; see §11 |

---

## 2. How to edit an existing title or description

### Static page (home, /work, /about, /connect, etc.)

1. Open `frontend/scripts/prerender-og.js`.
2. Find the entry in the `staticRoutes` array whose `path` matches.
3. Edit `title` (recommended ≤60 chars) and/or `desc` (recommended ≤160 chars).
4. Run the build (see §5).

### Writing post

1. Open `frontend/src/data/writing.js`.
2. Find the object whose `slug` matches the URL you want to change.
3. Edit `title` (this is the H1 AND the `<title>` prefix — do not create a
   duplicate; the two must be identical for Google to trust the page).
4. Edit `share` for the meta / OG / Twitter description. `share` is the
   author-approved excerpt. If `share` is absent, `dek` is used as a
   fallback — do not add both if not needed.
5. Run the build.

### Case study

1. Open `frontend/src/data/caseStudies.js`.
2. Find the object whose `slug` matches.
3. `title` = H1 + `<title>` prefix. `summary` = meta description.
4. Run the build.

### Do not

- Do not put SEO strings in JSX. React Helmet is not installed and would
  be invisible to unfurlers anyway. The build-time prerender is the only
  source.
- Do not exceed 60 chars for titles or 160 chars for descriptions
  **unless** the author-approved copy requires it (some Method titles
  intentionally run long — see §15 for currently-flagged items).
- Do not use `datePublished` values on articles other than the shared
  `SITE_LAUNCH_DATE` unless you're adding a genuinely new post; every
  existing post was made public on 2026-07-07.

---

## 3. How to add a new writing post

Adding a new post updates the sitemap, RSS feed, JSON-LD Article schema,
share cards, prerendered HTML, and prev/next navigation **automatically**.
The array position in `writing.js` is the intended release order — it is
the ordering used by the site navigation, `Writing.jsx`, RSS, and the
Gap Series callout on the writing index.

### Steps

1. Open `frontend/src/data/writing.js`.
2. Add a new object to the `writing` array in the correct release order:

```js
{
    slug: "your-url-slug",            // becomes /writing/your-url-slug
    title: "Your title.",             // H1 and <title>; ≤80 chars is comfortable
    dek: "One-paragraph subhead …",   // displayed under title in list views
    share: "Verbatim meta / OG copy", // ≤160 chars ideal; falls back to dek
    readTime: "5 min",                // display only, not SEO
    category: "Gap Series",           // or "Point of View" or your own bucket
    series: "Gap Series",             // omit if not a series post
    seriesLabel: "Gap Series · No. 8",// label rendered next to the title
    body: [
        { type: "p", text: "First paragraph." },
        { type: "p", text: "Second paragraph." }
        // { pull: "A pull quote" } is also valid
    ]
}
```

3. Run the build (see §5). That's it.

Under the hood, the following happen automatically:
- `prerender-og.js` picks up the new slug and writes
  `build/writing/your-url-slug/index.html` with:
  - `<title>{title} — Method</title>`
  - `<meta name="description">{share || dek}</meta>`
  - `<link rel="canonical" href="https://methodmarketinggroup.com/writing/your-url-slug" />`
  - OG + Twitter cards
  - JSON-LD `Article` schema (author = Gary, publisher = Method, `datePublished = SITE_LAUNCH_DATE`)
- `prerender-ssg.js` renders the full React article body into that shell.
- `generate-sitemap.js` adds the URL to `build/sitemap.xml`.
- `generate-rss.js` adds the item to `build/writing/rss.xml`.

---

## 4. How to add a new case study

Same idea as writing, in `frontend/src/data/caseStudies.js`. The sitemap,
prerendered HTML, share cards, and prev/next all pick it up automatically.

## 5. Building

Local:

```bash
cd /app/frontend
SKIP_INDEXNOW=1 \
yarn build \
  && node scripts/strip-emergent.js \
  && node scripts/prerender-og.js \
  && node scripts/prerender-ssg.js \
  && node scripts/generate-sitemap.js \
  && node scripts/generate-rss.js \
  && node scripts/indexnow-ping.js
```

`SKIP_INDEXNOW=1` prevents local runs from pinging the production
IndexNow endpoint. Netlify's production build does NOT set this, so the
ping runs there. Deploy previews and branch deploys skip it via
`NETLIFY_CONTEXT` (see §8.3).

Netlify runs this same chain on every deploy (see `netlify.toml`). Do not
alter the order — later scripts depend on earlier ones.

---

## 6. Structured data (JSON-LD)

Structured data is generated by `prerender-og.js` and injected into a
sentinel-bounded block inside `<head>` on every page. It is idempotent —
running the prerender twice produces the same output.

### Schema graph, by page type

| Page | Entities in `@graph` |
|---|---|
| `/` (homepage) | Organization, WebSite, Person (Gary), ProfessionalService |
| `/writing/*` and `/about/discernment` | Organization, WebSite, Person, Article |
| Every other indexable page (`/about`, `/work`, `/work/:slug`, `/writing`, `/connect`, `/sitemap`, `/privacy-policy`) | Organization, WebSite, Person |
| `/404` | No schema (noindex) |

### Constants you can edit

At the top of `prerender-og.js`:

```js
const SITE_LAUNCH_DATE = "2026-07-07"; // datePublished for all articles
const ORG_LOGO_URL = "...";            // Organization.logo
const ORG_LINKEDIN = "...";            // Organization.sameAs
const PERSON_LINKEDIN = "...";         // Person.sameAs
```

Everything else (entity `@id`s, founding date, founder, jobTitle,
serviceType, areaServed) is intentionally hardcoded in `orgSchema()`,
`personGarySchema()`, `professionalServiceSchema()`, and `articleSchema()`
inside the same file. Edit those functions to change the schema shape.

### Rule: no invented data

Do not add fields that would require guessing. No fake addresses, no
fabricated `aggregateRating`, no `Review` schema unless a real review
exists with real attribution. If a field is unknown, omit it. This is a
non-negotiable rule; false schema is worse than no schema.

---

## 7. Sitemap and robots.txt

`generate-sitemap.js` produces two files at build time:

- `build/sitemap.xml` — every indexable route (currently 21 URLs)
- `build/robots.txt` — allows all crawlers, references the sitemap

**Sitemap auto-updates.** Adding a slug to `writing.js` or
`caseStudies.js` regenerates the sitemap on the next build. No manual
step. The `<lastmod>` for article/case-study routes is set to the build
date (fine for most crawlers; if you want stable per-post dates, wire
them into the data model).

Static route priorities and `changefreq` values live at the top of
`generate-sitemap.js` if you need to tune them.

---

## 8. IndexNow (Bing, Yandex, and other IndexNow-participating engines)

IndexNow is a lightweight push protocol: when a page is new or has
changed, we POST the URL to a shared endpoint and every participating
engine (Bing, Yandex, Seznam, Naver, etc.) is notified in one call. It
does not replace crawling — it just makes crawling faster. Google is
NOT an IndexNow participant, so IndexNow does not affect Google
indexing. Sitemap + robots.txt + Google Search Console remain the
Google-side plumbing.

### 8.1 The key

Method's IndexNow key is a fixed 32-hex-char string:

```
f2da102fbb1f98cf309ec46aeefef39e
```

The key is public by design. It only authenticates that the site owner
controls the domain, by requiring a file at:

```
https://methodmarketinggroup.com/f2da102fbb1f98cf309ec46aeefef39e.txt
```

whose body is exactly the key. That file lives in the repo at
`frontend/public/f2da102fbb1f98cf309ec46aeefef39e.txt` and CRA copies it
to the site root on every build. **Do not delete or rename it.** If you
ever need to rotate the key: generate a new 32-hex-char string, replace
both the file (in `public/`) and the `INDEXNOW_KEY` constant at the top
of `frontend/scripts/indexnow-ping.js`, and deploy. The old key stops
working the moment the file is gone.

### 8.2 The diff-based ping

`frontend/scripts/indexnow-ping.js` runs as the last step of the build
chain (see `netlify.toml`). On every deploy it:

1. Walks the freshly-built `build/` directory, computes a SHA-256 of
   every HTML file, and writes `build/indexnow-manifest.json` as
   `{ url: hash }`.
2. Fetches the previous manifest from
   `https://methodmarketinggroup.com/indexnow-manifest.json` — this is
   what the site currently serves, i.e. the state this deploy is about
   to replace.
3. Diffs the two hash maps. Any URL whose hash changed, or is entirely
   new, is added to the submission list. **If nothing changed, no ping
   goes out.** We never spam the endpoint with the full sitemap.
4. POSTs the list (max 10,000 URLs per request) to
   `https://api.indexnow.org/indexnow`, which fans out to all
   participating engines.

Submission failures never fail the build — the script logs and
continues. IndexNow is best-effort.

### 8.3 Guardrails

- `SKIP_INDEXNOW=1` — skips the ping (useful for local test runs).
- `NETLIFY_CONTEXT` — only production deploys ping. Deploy previews and
  branch deploys are automatically skipped so preview builds don't
  announce staging URLs.

### 8.4 Verifying a ping succeeded

Two levels of verification. Both should be checked after a change:

**Level 1 — build log:**

Check the Netlify deploy log for a line like:

```
[indexnow] Submitting N URL(s):
  - https://methodmarketinggroup.com/writing/your-slug
[indexnow] Batch 1 accepted (HTTP 202).
[indexnow] Done.
```

`HTTP 200` or `HTTP 202` means the endpoint accepted the payload.
Any other status is logged as a warning; the build still passes.

If the log shows `No new or changed URLs in this deploy — nothing to
submit`, that's also success — the diff correctly found nothing.

**Level 2 — Bing Webmaster Tools:**

After the deploy completes, go to Bing Webmaster Tools →
`https://www.bing.com/webmasters` → select `methodmarketinggroup.com`
→ Configure My Site → IndexNow. The "Submissions" panel shows the
count of URLs submitted per day. It updates within minutes of a
successful ping.

**Level 3 — key file:**

Anytime you're debugging, confirm the key file is still reachable:

```bash
curl -sL https://methodmarketinggroup.com/f2da102fbb1f98cf309ec46aeefef39e.txt
# Expected output: f2da102fbb1f98cf309ec46aeefef39e
```

If this returns anything else (404, HTML, empty), Bing will silently
reject every subsequent submission until the file is restored.

### 8.5 Debugging "why didn't my URL get pinged?"

1. Was the deploy actually a production deploy? Preview builds skip
   IndexNow by design (see 8.3).
2. Did the content of that page actually change? If the HTML is
   byte-identical to what's currently live, the diff is empty and no
   ping fires — this is correct behaviour, not a bug.
3. If you want to force a ping (say, after a big invisible SEO change
   the hash didn't catch), you can temporarily delete
   `build/indexnow-manifest.json` locally and push — the next build
   will treat every URL as new and submit all 21.
4. Check the Netlify deploy log for `[indexnow]` lines.

---

---

## 9. Google Analytics 4

**Measurement ID:** `G-7F2PPZPXSK`
**Property owner:** Method Marketing Group
**Privacy disclosure:** See `/privacy-policy` §1 (Information automatically
collected) and §4 (Cookies and tracking technologies)

### 9.0 Canonical URL policy: no trailing slashes (applies to GA4 AND Clarity)

**The canonical form of every URL on this site is WITHOUT a trailing
slash** (`/work`, `/writing/wrap-rage`) — matching `<link rel="canonical">`,
sitemap.xml, og:url, RSS item links, JSON-LD `mainEntityOfPage`, and
every internal link. The homepage `/` is the only exception.

**Why this is enforced at the HTTP layer.** The site originally emitted
each route as `folder/index.html`. On Netlify, directory-index content
makes the *trailing-slash* form canonical at the edge: `/work` got a
301 → `/work/`. So hard navigations (search results, shared links,
refreshes) recorded `/work/` in analytics while SPA navigations
recorded `/work` — splitting every page into **two pageview counters**
(exactly what Clarity showed for `/writing/the-gap-series-introduction`
vs the same URL with a slash), and contradicting all our non-slash
canonical signals.

**The mechanism: flat-file SSG output.** Netlify's edge normalization
is driven purely by file layout and *cannot be overridden with
`_redirects` rules* (normalization runs before redirect processing):

| Layout | `/foo` | `/foo/` |
|---|---|---|
| `foo/index.html` (old) | 301 → `/foo/` ✗ | 200 |
| `foo.html` (current) | **200** ✓ | **301 → `/foo`** ✓ |

`prerender-og.js` and `prerender-ssg.js` therefore write every route as
a flat file: `build/work.html`, `build/writing/{slug}.html`,
`build/about/discernment.html`. Only the homepage stays as
`build/index.html`, and the 404 page as `build/404.html`. The local
preview server (`scripts/build-and-serve.js`) mirrors the same rules
(clean-URL serving, slash → 301, real 404s) so the behaviour is
curl-testable before deploy.

**Do not solve URL duplication with client-side JavaScript** (e.g., a
`history.replaceState` normalizer). It hides the split from analytics
but leaves the wrong 301 visible to curl, crawlers, and unfurlers.

**Acceptance test (run against LIVE production after any change to the
build pipeline or file layout):**

```bash
for p in /work /writing/the-gap-series-introduction /about; do
  echo "== $p/";  curl -sI "https://methodmarketinggroup.com$p/" | grep -i "^HTTP\|^location"
  echo "== $p";   curl -sI "https://methodmarketinggroup.com$p"  | grep -i "^HTTP"
done
# Expected: every trailing-slash form → 301 with location: {non-slash};
#           every non-slash form → 200.
curl -sI "https://methodmarketinggroup.com/nope" | grep "^HTTP"      # 404
curl -sI "https://methodmarketinggroup.com/how-we-work/x" | grep -i "^HTTP\|^location"  # legacy 301 → /work
curl -s "https://methodmarketinggroup.com/f2da102fbb1f98cf309ec46aeefef39e.txt" | head -c 40  # IndexNow key intact
```

Note: analytics data recorded before this fix keeps the split
(`/foo` + `/foo/` as separate rows); only sessions from deploy day
forward unify. That's expected — Clarity/GA4 don't merge retroactively.

### 9.1 Where the tag lives

The gtag.js snippet is baked directly into `frontend/public/index.html`
inside the `<head>`, between the `<title>` and the emergent-related
shims that `strip-emergent.js` removes. Because prerender-og.js and
prerender-ssg.js both work by editing that same base HTML shell, the
snippet is inherited into every one of the 21 prerendered per-route
HTML files automatically. There is nothing to add on a per-page basis.

Because the script tag is `async`, it never blocks render or hurts
Lighthouse / Web Vitals scores. Because it's in the raw HTML, it fires
on the very first paint, before React has hydrated — so first-page
visits are captured even for visitors on slow devices or with
JavaScript delays.

### 9.2 SPA route tracking

The initial `gtag('config', ...)` call sets `send_page_view: false`.
This is deliberate. Without it, GA4 would count the initial navigation
and MISS every subsequent client-side route change (React Router's
`history.pushState` does not trigger a document load).

Instead, `frontend/src/hooks/useGAPageView.js` owns page_view for the
entire session:

```js
// src/hooks/useGAPageView.js
export function useGAPageView() {
    const { pathname, search } = useLocation();
    useEffect(() => {
        if (typeof window === "undefined" || typeof window.gtag !== "function")
            return;
        window.gtag("event", "page_view", {
            page_location: window.location.href,
            page_path: pathname + search,
            page_title: document.title,
        });
    }, [pathname, search]);
}
```

Wired into `AppShell` in `src/App.js` AFTER `useDocumentTitle()` so
`document.title` is already updated when the page_view event fires:

```js
useDocumentTitle();
useGAPageView();
```

Result: exactly one `page_view` per SPA navigation, with the correct
title, path, and full URL. Verified in a browser session — hitting `/`
→ `/writing` → `/writing/wrap-rage` produced three clean `page_view`
events with distinct titles.

### 9.3 SSR safety

`prerender-ssg.js` runs the React tree through `react-dom/server`,
which has no `window` global. The hook's `typeof window` guard makes
it a no-op during SSR. It only ever fires client-side, after
hydration. This is why gtag calls do not appear in the prerendered HTML
body.

### 9.4 Verifying the tag is live

**Level 1 — raw HTML:**

```bash
curl -sL https://methodmarketinggroup.com/ | grep -c "G-7F2PPZPXSK"
# Expected: 2  (one for the script src, one for the config call)

curl -sL https://methodmarketinggroup.com/writing/wrap-rage | grep -c "G-7F2PPZPXSK"
# Expected: 2  (same tag on every prerendered page)
```

**Level 2 — GA4 Realtime:**

Open GA4 → Reports → Realtime while loading the site. A visit should
appear within a few seconds. Click through a couple of internal links
— you should see the page_path value change with each navigation, and
the "Views in the last 30 minutes" count should increment on each
route change (not just on initial load).

**Level 3 — DebugView (for verifying implementation changes):**

If you're validating a change to the tracking hook or config, use
Google's Tag Assistant browser extension (or set `debug_mode: true`
temporarily) and check GA4 → Admin → DebugView. This shows every event
in real time with full parameter payloads.

### 9.5 What we do NOT do

- No Google Signals (cross-device tracking).
- No advertising features or remarketing audiences.
- No ad personalization.
- No third-party integrations (Google Ads, DV360, etc.).
- No user-ID mapping — sessions are anonymous.

These are all disabled by default in a fresh GA4 property; do not
enable any of them without also updating the privacy policy at
`/privacy-policy` §4.

### 9.6 If the measurement ID ever changes

Edit these two lines:

- `frontend/public/index.html` — replace both occurrences of `G-7F2PPZPXSK`
  (the `src` and the `config` call)
- `frontend/src/pages/PrivacyPolicy.jsx` — update the ID reference in §4

The hook (`useGAPageView.js`) is measurement-ID-agnostic and does not
need to change.

### 9.7 Contact-intent events: `email_click` + `linkedin_click` (key events / conversions)

**What:** two custom GA4 events, fired sitewide:

- `email_click` — every click on any `mailto:` link
- `linkedin_click` — every click on any `linkedin.com` link

**Where they fire:** one delegated capture-phase click listener on
`document`, installed by `frontend/src/hooks/useContactTracking.js`
(called once from `AppShell` in `App.js`). No per-component wiring —
it automatically covers:

- *email:* the Connect page CTA, the footer email link, the Home
  closing CTA, the Discernment closing line, the three privacy-policy
  links, ShareRow's "share via email"
- *LinkedIn:* the footer "Connect on LinkedIn", the Connect page
  "Connect on LinkedIn →", Gary's profile link on About, ShareRow's
  LinkedIn share
- …and any mailto/LinkedIn link added in the future.

**Parameters (identical for both events):**

| Param | Value | How it lands in GA4 |
|---|---|---|
| `page_path` | `window.location.pathname` | Reserved gtag field — folds into the hit's page fields (`dl`), surfacing as the standard **Page path** dimension on the event. This is what attributes an inquiry to the article/page that preceded the click, in standard reports, with no custom-dimension registration. |
| `page_title` | `document.title` | Reserved field → `dt` → standard **Page title** dimension |
| `link_url` | mailto href, query stripped (e.g. `mailto:connect@methodmarketinggroup.com`) | Custom param `ep.link_url` — distinguishes contact clicks from ShareRow shares (`mailto:` with no address) |
| `link_text` | link's visible text, trimmed, max 100 chars | Custom param `ep.link_text` — which CTA wording was clicked |

(Verified against the wire format: the `/g/collect` hit for a footer
click on an article page carried `en=email_click`,
`dl=…/writing/wrap-rage`, `dt=Wrap rage has an official name…`,
`ep.link_url`, `ep.link_text`. To make `link_url`/`link_text` usable
as report dimensions, optionally register them under Admin → Custom
definitions → Create custom dimension, scope Event.)

**Registering as key events (one-time, GA4 UI — cannot be done in
code):**

1. Click a mailto and a LinkedIn link on the live site once so GA4 has
   seen the events (they appear in *Realtime* immediately; in
   *Admin → Events* within ~24h).
2. GA4 → **Admin** (gear, bottom-left) → under *Data display* →
   **Key events** → **New key event** → enter exactly `email_click`
   → Save. Repeat for `linkedin_click`. (This works even before the
   events show in the Events list.)
3. From then on both surface as conversions in standard reports and
   can be broken down by `page_path` / `page_title`.

**Privacy policy:** unchanged, deliberately. Both events record a
standard interaction (a click) with page context only — no email
content, no address typed by the visitor, no new data category. They
are covered by the existing GA4 disclosure in `/privacy-policy` §1 and
§4. If either event ever starts carrying user-entered data, the policy
must be updated first.

**Known limitation (for the record):** these clicks measure *intent* —
the mail client opening, or the LinkedIn tab opening — not that an
email was sent or a LinkedIn connection made.

**Verifying:** click any email or LinkedIn link on the live site with
DevTools → Network filtered to `collect`. The request to
`google-analytics.com/g/collect` carries `en=email_click` or
`en=linkedin_click` (check the POST body — GA4 batches events there)
plus `dl`/`dt` page fields and `ep.link_url`, `ep.link_text`. The
events also appear in GA4 → Reports → Realtime within seconds.

### 9.8 Hostname guard — analytics only run on production (GA4 AND Clarity)

Because the GA4 and Clarity tags are baked into the prerendered HTML,
they used to fire on **every** host serving the build — including the
Emergent preview domains — polluting both properties with non-visitor
traffic.

**The guard.** The head snippet in `frontend/public/index.html` wraps
BOTH tags in a single hostname check:

```js
var h = window.location.hostname;
if (h !== "methodmarketinggroup.com" && h !== "www.methodmarketinggroup.com") return;
```

On any other hostname (Emergent previews, localhost, Netlify deploy
permalinks) neither loader is injected and **zero** network requests
fire to `googletagmanager.com`, `google-analytics.com`, or
`clarity.ms`. The same check lives in
`frontend/src/hooks/analyticsHost.js` (`isAnalyticsHost()`) and gates
the SPA-side code — `useGAPageView` (route page_views) and
`useContactTracking` (email_click / linkedin_click) — so client-side
navigation on previews stays silent too.

**Maintenance rules:**

- Any future analytics tag (or gtag call anywhere in the app) MUST sit
  behind the same guard — inline copy in the head snippet, or
  `isAnalyticsHost()` in React code.
- If the production hostname ever changes, update BOTH copies of the
  check (head snippet + analyticsHost.js).

**Testing implication:** analytics changes can no longer be verified on
the preview URL — the guard silences it by design. Verify on the live
production URL after deploy (DevTools → Network → `collect`, or GA4
Realtime). Alternatively, for pre-deploy debugging only, temporarily
loosen the hostname check locally and use GA4 DebugView — but never
commit that change.

**Preview noindex (related hygiene):** the Emergent preview ingress
already injects `X-Robots-Tag: noindex, nofollow` AND a
`<meta name="robots" content="noindex, nofollow">` into preview
responses, and the local preview server
(`scripts/build-and-serve.js`) now sends its own
`X-Robots-Tag: noindex, nofollow` on every response as belt-and-braces.
None of this exists in the build artifact itself — production serves no
robots restrictions (verified: live `/work` has neither the header nor
the meta).

**Historical note:** preview rows recorded before this guard (hostnames
`method-positioning.preview.emergentagent.com` etc.) remain in GA4 and
Clarity — they don't retro-delete. When analyzing launch-week data,
filter/segment by hostname `methodmarketinggroup.com` to exclude the
preview noise.

---

## 10. Microsoft Clarity

**Project ID:** `xj8oadt46d`
**Property owner:** Method Marketing Group
**Privacy disclosure:** See `/privacy-policy` §1 (Information
automatically collected) and §4 (Cookies and tracking technologies)

### 10.1 Where the tag lives

The Clarity snippet is baked directly into `frontend/public/index.html`
inside the `<head>`, immediately after the GA4 gtag block. It follows
the identical pattern to GA4: because prerender-og.js and prerender-ssg.js
both work by editing that same base HTML shell, the snippet is
inherited into every one of the 21 prerendered per-route HTML files
automatically. There is nothing to add on a per-page basis.

The snippet is Microsoft's stock async loader — it self-inserts a
`<script async>` for `https://www.clarity.ms/tag/xj8oadt46d`, so it
never blocks render.

### 10.2 SPA route handling

Unlike GA4, Clarity requires no companion hook. Its client library
listens to `history.pushState` / `popstate` events natively and stitches
every route change in the SPA into a single continuous session
recording. This means:

- One Clarity session = one visitor session, spanning any number of
  route changes.
- The heatmaps for each URL correctly attribute clicks and scrolls to
  the page they occurred on, not the initial landing page.
- No `useGAPageView`-equivalent hook exists or is needed.

Verified in a local browser test: navigating `/` → `/writing` →
`/writing/wrap-rage` produced a single Clarity session with three
route entries and all interactions on the correct pages.

### 10.3 GA4 ↔ Clarity integration

The Clarity ↔ GA4 bridge is enabled on the **Clarity side** (Clarity
project → Settings → Integrations → Google Analytics). Once linked,
GA4 receives a custom dimension containing the Clarity session URL, so
you can jump from any GA4 report row directly to the corresponding
Clarity replay. Nothing about that integration is code-side; if the
GA4 property ever changes, re-link it in the Clarity dashboard.

### 10.4 Verifying the tag is live

**Level 1 — raw HTML:**

```bash
curl -sL https://methodmarketinggroup.com/ | grep -c "xj8oadt46d"
# Expected: 1

curl -sL https://methodmarketinggroup.com/writing/wrap-rage | grep -c "xj8oadt46d"
# Expected: 1  (same tag on every prerendered page)
```

**Level 2 — network tab in DevTools:**

Load any page on the live site. In the Network tab, filter by "clarity"
— you should see:

- A `GET https://www.clarity.ms/tag/xj8oadt46d` returning 200 (the
  loader) followed by additional `clarity.ms/collect` requests as you
  interact with the page.

**Level 3 — Clarity dashboard:**

Open `https://clarity.microsoft.com/projects/view/xj8oadt46d`.
First-data lag is typically 30 minutes to 2 hours after a live visit;
recordings appear in the Recordings tab, and dashboard metrics
(sessions, pages/session, dead clicks, rage clicks, etc.) populate in
the Dashboard tab.

### 10.5 What we do NOT do

- No advertising, retargeting, or profiling.
- No enabling of Clarity's IP address collection beyond what's needed
  for geolocation aggregation (Microsoft truncates by default).
- No custom user IDs — sessions are anonymous.
- No unmasked capture of input fields — Clarity's default masking is
  on and we do not override it.

### 10.6 If the project ID ever changes

Edit these two lines:

- `frontend/public/index.html` — replace `xj8oadt46d` in the Clarity
  snippet (single occurrence).
- `frontend/src/pages/PrivacyPolicy.jsx` — update the ID reference in
  §4.

---

## 11. Social sharing cards (per-article OG images)

### 11.1 What ships

Every article on the site — the 11 posts in `/writing`, the two case
studies in `/work`, and the `/about/discernment` essay — gets a
**unique 1200×630 PNG social sharing card** with its own headline
typeset in Scandia over Method's navy. Non-article pages (home,
`/about`, `/work` index, `/writing` index, `/connect`, `/sitemap`,
`/privacy-policy`) continue to share the sitewide branded
`og-default.jpg` — uniform brand recognition there is a feature.

Cards ship at:

- `/og/writing/<slug>.png` — one per writing post
- `/og/work/<slug>.png` — one per case study
- `/og/about/discernment.png` — the essay

Each article's `<meta property="og:image">` in the prerendered HTML
points at its matching PNG. If the PNG is missing (e.g. a Puppeteer
failure on Netlify or a new slug that hasn't rebuilt yet),
`prerender-og.js` silently falls back to `og-default.jpg` so LinkedIn /
Twitter / Discord / iMessage unfurls never break.

### 11.2 The template

Every card uses the same composition (deliberately, so the brand reads
consistently in a social feed):

- **Top-left**: "Method" wordmark, Scandia 800, cream
- **Top-right**: section eyebrow in tracked small caps
  - Writing posts with a `seriesLabel` → e.g. `GAP SERIES · NO. 3`
  - Writing posts without → e.g. `GAP SERIES` (their `category` uppercased)
  - Case studies → `CASE STUDY`
  - Discernment → `ESSAY`
- **Middle**: headline in Scandia 800, tight letter-spacing, cream, sized dynamically:
  - ≤60 chars → 76px
  - 60–90 → 62px
  - 90–130 → 52px
  - >130 → 44px
- **Bottom-left**: `METHODMARKETINGGROUP.COM` in small caps
- **Bottom-right**: 96×3px steel-blue rule

Template lives inline as a function in `frontend/scripts/generate-og-cards.js`
— easy to see the whole card at a glance, easy to iterate.

### 11.3 How the cards are generated

Runs as a build-chain step BEFORE `prerender-og.js` (see `netlify.toml`):

1. `frontend/scripts/generate-og-cards.js` enumerates every article
   from `writing.js` and `caseStudies.js` plus the hardcoded
   Discernment entry.
2. For each article, it renders the template with the headline +
   eyebrow injected, waits for `document.fonts.ready` so Scandia has
   fully loaded, and screenshots at exactly 1200×630 as PNG.
3. Files land in `build/og/{writing|work|about}/<slug>.png`.
4. `prerender-og.js` then bakes the correct per-slug URL into
   each article's `og:image`, or falls back to `og-default.jpg` if
   the file isn't there.

**On Netlify** the Puppeteer-bundled Chromium runs fine and all
cards are generated on every deploy. Total add to build time: ~15
seconds for the current 14 cards.

**On local dev** in restricted containers where Chromium can't
launch, set `SKIP_OG_CARDS=1` — the script will exit cleanly and
articles will use `og-default.jpg` until the next Netlify deploy.

### 11.4 Adding a new article

Adding a new writing post to `writing.js` or a new case study to
`caseStudies.js` **automatically generates a new sharing card** on
the next deploy. No manual step, no design file to touch. The
headline in the data file becomes the headline on the card.

### 11.5 Editing a card's design

Change the inline template in `frontend/scripts/generate-og-cards.js`
(the `buildHtml` function). It's plain HTML/CSS using the same
Adobe Typekit CSS the site loads, so changes render identically to
the live site typography.

To preview a design change WITHOUT running Puppeteer locally:

```bash
# From the frontend/ directory
node -e "
const fs = require('fs');
const path = require('path');
// (inline the buildHtml function and write to build/og-preview/foo.html)
fs.writeFileSync('build/og-preview/wrap-rage.html', buildHtml({
    headline: 'Wrap rage has an official name. That should tell you something.',
    eyebrow: 'GAP SERIES · NO. 3'
}));
"
```

Then open the HTML file in a browser at 1200×630 viewport, or use the
Netlify preview environment: `https://method-positioning.preview.emergentagent.com/og-preview/wrap-rage.html`.

### 11.6 Verifying a card is live

**Level 1 — raw HTML:**

```bash
curl -sL https://methodmarketinggroup.com/writing/wrap-rage \
  | grep -oE 'og:image" content="[^"]+"'
# Expected: og:image" content="https://methodmarketinggroup.com/og/writing/wrap-rage.png"
```

**Level 2 — PNG is fetchable:**

```bash
curl -sI https://methodmarketinggroup.com/og/writing/wrap-rage.png \
  | grep -E 'HTTP|Content-Type|Content-Length'
# Expected: HTTP 200, image/png, ~40–90KB
```

**Level 3 — social unfurler:**

- LinkedIn Post Inspector: `https://www.linkedin.com/post-inspector/`
- Twitter Card Validator: `https://cards-dev.twitter.com/validator`
- Meta Sharing Debugger: `https://developers.facebook.com/tools/debug/`

Paste an article URL into any of these. The rendered preview should
show the per-slug card with the article's headline in Scandia over
navy. If a validator shows the old `og-default.jpg`, force a re-fetch
(LinkedIn: "Inspect" button; Facebook: "Scrape Again" button — most
platforms cache the OG image for weeks).

### 11.7 Anti-patterns

- **Do not** point `og:image` at an HTML page. OG unfurlers fetch the
  URL as a binary image; they don't render HTML. Format must be JPG,
  PNG, WebP, or GIF, with a matching `Content-Type` header.
- **Do not** exceed ~5 MB per card. LinkedIn caps at 5 MB, Twitter at
  5 MB, Facebook at 8 MB. Method's cards are pure-text and ship at
  40–90 KB each — well under the ceiling.
- **Do not** use a background image that dominates the card without
  contrast against the headline. Method's navy solid is exactly this
  reason: type is the hero, always.
- **Do not** hardcode a specific slug's card by copying the PNG into
  `frontend/public/`. That bypasses the generator and creates
  drift the moment the headline changes. All cards are generated;
  none are hand-edited.

---

## 12. Performance Budget (Core Web Vitals)

### 12.1 The budget

Method's live production URL is expected to be in Google's **"good"**
band on all three Core Web Vitals at all times. This is a budget, not an
aspiration:

| Metric | Threshold (p75) | Meaning |
|---|---|---|
| **LCP** (Largest Contentful Paint) | **< 2.5s** | The largest above-the-fold element paints in under 2.5 seconds for at least 75% of visitors |
| **CLS** (Cumulative Layout Shift) | **< 0.1** | The page doesn't visibly jump around during load |
| **INP** (Interaction to Next Paint) | **< 200ms** | Interactions (clicks, taps, key presses) get a visible response in under 200 milliseconds |

**p75 = the 75th-percentile visitor.** All three are measured against
real-user data aggregated across a rolling 28-day window. Any of the
three landing in the "needs improvement" or "poor" band is a defect,
not a tradeoff. Regressing an existing "good" score during a change is
also a defect — the fix ships with the change or the change waits.

### 12.2 Where to observe the metrics (vendor-agnostic)

Because Core Web Vitals are a browser-native standard, every serious
tool reports the same three numbers off the same underlying data:

- **Microsoft Clarity** → project dashboard → Performance panel. Field
  data, rolling window, p75. Fastest way to spot a regression.
- **Google Search Console** → Experience → Core Web Vitals. Field data
  from Chrome UX Report (CrUX). Same p75, longer aggregation window.
  This is what actually feeds Google's ranking signal.
- **PageSpeed Insights** (`pagespeed.web.dev`) → paste the live URL.
  Shows both lab (Lighthouse) and field (CrUX) numbers side by side.
- **Chrome DevTools** → Performance panel or the Web Vitals extension.
  Lab-only, single-run — useful for verifying a fix before deploy.

If two of these disagree, trust the field data (Clarity / Search
Console / PSI field). Lab numbers can look great on a laptop with a
warm cache and still ship a poor field experience.

### 12.3 The critical-path pattern (reference implementation)

Method is typography-first. The LCP element on every page is a heading
rendered in **Scandia** (Adobe Typekit) — occasionally with a **Cormorant
Garamond** italic accent (Google Fonts). Without care, the site would
block first paint on those font downloads and blow LCP by 3–5 seconds.

The pattern that keeps LCP inside budget lives in
`frontend/public/index.html` and is preserved by the SSG pipeline
into every prerendered per-route HTML file. Three rules:

**Rule 1 — Preload the woff2 files the LCP element depends on.**

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://use.typekit.net/af/04b7f1/…/l?…&fvd=n7&v=3" />
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://use.typekit.net/af/29e987/…/l?…&fvd=i7&v=3" />
```

These are Scandia Web 700 (which the wordmark uses at synthesized 800)
and Scandia Web 700 italic (the steel-blue accent phrases). Preloading
kicks the download off at the same moment as the stylesheet, not
serially after it.

**Rule 2 — No render-blocking cross-origin stylesheets. Ever.**

The Typekit CSS is loaded async with the same preload/onload pattern as
Google Fonts (with a `<noscript>` fallback):

```html
<link rel="preload" as="style"
      href="https://use.typekit.net/kiu8ndx.css?display=swap"
      onload="this.onload=null;this.rel='stylesheet'" />
```

It was originally a synchronous `<link rel="stylesheet">`, which cost
slow connections TWO sequential cross-origin chains before first paint:
`use.typekit.net/kiu8ndx.css` itself, plus a hidden render-blocking
`@import` it chains to `p.typekit.net/p.css`. De-blocking it cut lab
FCP from 4.1s → 2.8s (slow-4G emulation). The ONLY render-blocking
stylesheet allowed is the same-origin CRA `main.css`.

`?display=swap` stays on the URL — Typekit's `@font-face` rules keep
`font-display: swap`, so text is never invisible while Scandia loads;
the Lexend Deca fallback (chosen for its matching double-story 'a')
paints first and the swap is near-seamless because the woff2 preloads
(Rule 1) started downloading at HTML parse time.

**Rule 3 — De-block every stylesheet that does NOT unlock the LCP
element.**

```html
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:…&display=swap"
      onload="this.onload=null;this.rel='stylesheet'" />
<noscript>
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:…&display=swap" />
</noscript>
```

The `<noscript>` fallback is mandatory — Method is prerendered/SSG and
must remain readable with JavaScript disabled. Same treatment for
Manrope (or any future secondary typeface).

**Applies equally to hero images if any get introduced.** If a page ever
adds a hero image or above-the-fold LCP-relevant image, add a
`<link rel="preload" as="image" href="…" fetchpriority="high">` for
that image before shipping the change. Never let an LCP image download
lazily.

**Rule 4 — Never gate above-the-fold visibility behind JavaScript.**

This was the second field-LCP trap (found July 2026, after the font
pass): the hero of every page was animated in with framer-motion
(`initial={{ opacity: 0 }}`), which bakes `style="opacity:0"` into the
prerendered HTML. Real visitors saw a blank hero until the entire JS
bundle downloaded, parsed, hydrated React, and ran the animation —
~4s field LCP on median mobile, even though lab numbers on a warm
desktop looked perfect.

The fix: above-the-fold ("hero") content uses a **CSS-only** entrance
animation that runs on first paint with zero JS dependency.

- `frontend/src/components/Reveal.jsx` — `Reveal`, `RevealStagger`,
  and `RevealItem` all accept a `hero` prop. With `hero`, they render
  plain elements with the `.hero-stagger` / `.hero-reveal` classes
  instead of motion components, so the SSR HTML carries **no**
  `opacity:0` inline style.
- `frontend/src/index.css` — `.hero-reveal` replicates the framer
  entrance exactly (y 24px → 0, 900ms, `cubic-bezier(0.16,1,0.3,1)`);
  `.hero-stagger > .hero-reveal:nth-child(n)` replicates the 140ms
  sibling stagger; a `prefers-reduced-motion` media query disables it.
- Every page's first (above-the-fold) section uses `hero`. Sections
  below the fold keep the scroll-triggered framer-motion reveals —
  the JS bundle is fully loaded by the time anyone scrolls to them.

When adding a new page or a new hero section: the first viewport of
content MUST use `hero` reveals (or no reveal at all). Verify with:

```bash
# The first ~3000 chars of <main> in the prerendered HTML must not
# contain a baked opacity:0 inline style:
python3 - <<'EOF'
h = open('build/index.html').read()
m = h[h.find('<main'):h.find('</main>')][:3000]
assert 'opacity:0' not in m, 'LCP element is JS-gated — fix before deploy'
print('hero OK')
EOF
```

**Rule 4a — the hero fade starts at `opacity: 0.01`, not `0`.**

Chrome excludes opacity-0 paints from LCP candidacy. With the hero
starting at exactly 0, the huge hero H1/subhead never registered at
first paint, so LCP fell through to later repaints of smaller elements
(the nav wordmark's font-swap), reporting LCP seconds after FCP.
Starting the animation at 0.01 — visually indistinguishable from 0 —
makes the hero a valid LCP candidate on its first painted frame,
anchoring LCP to FCP. Measured effect (slow-4G lab): LCP 3.8s → 2.8s
with FCP at 2.6s. Never "clean up" the 0.01 back to 0.

### 12.4 Verification protocol

**Before deploy** — measure lab metrics on the preview environment:

```bash
# From Chrome DevTools Console on the preview URL, or via any headless
# runner (Playwright, Puppeteer). The observer captures the LCP entry
# reported by the browser natively:
new PerformanceObserver(list => {
    for (const e of list.getEntries())
        console.log('LCP', e.startTime, 'ms', e.element);
}).observe({type: 'largest-contentful-paint', buffered: true});
```

Lab LCP should be well under 500ms for any page that only depends on
the font pipeline. If it's over 1s in lab, the field number will
regress and the change is not ready to ship.

**After deploy** — measure against the live production URL:

1. Load `https://methodmarketinggroup.com/` in an incognito window.
2. Same PerformanceObserver snippet — LCP must be < 2.5s in lab.
3. Wait 24–72 hours for Clarity's Performance dashboard to aggregate
   real users. Confirm the p75 for LCP, CLS, and INP are all in the
   "good" band.
4. If any regress: **roll back the change, or ship the fix same-day.**
   The budget is non-negotiable.

**Ongoing** — Clarity's dashboard is checked at each significant
content change (new writing post, new case study, new page section).
Search Console's Core Web Vitals report is checked monthly.

### 12.5 Anti-patterns (things that would blow the budget)

- **A blocking `<script>` (not `async` / not `defer`) in `<head>`** —
  every synchronous head script delays first paint. GA4, Clarity, and
  every future analytics tag must remain async.
- **A render-blocking stylesheet without `?display=swap`** — this is
  exactly the trap that produced the initial 4.8s LCP.
- **An image-first LCP element without a preload + `fetchpriority="high"`.**
- **A background-image on the LCP container** — CSS background images
  do NOT count as LCP candidates in most browsers, so the LCP falls
  through to a later element and often gets worse. Use `<img>` with a
  preload instead.
- **A large web font family loaded synchronously with dozens of weights
  we don't use** — always specify only the weights actually referenced.
- **Client-side hydration that shifts layout** — CLS budget is 0.1. Any
  new component that renders a different size on client vs. SSR is a
  defect (font-loading text isn't a shift because the box size is
  preserved; a lazy-loaded image without dimensions IS a shift).
- **JS-gated visibility on above-the-fold content** — any element in
  the first viewport rendered with `opacity: 0` inline (framer-motion
  `initial`, GSAP `autoAlpha`, etc.) holds LCP hostage to the full JS
  bundle. Heroes use the CSS-only `hero` reveal (Rule 4 in §12.3).
  Lab tests on fast connections hide this failure — it only shows up
  in field data.

### 12.6 Baseline (last verified)

Lab baseline, Lighthouse 12 mobile emulation (Moto G Power-class,
slow-4G simulated throttling), July 2026 pass (async Typekit CSS +
hero opacity 0.01 + @tanstack/react-query removed from the bundle —
it was a provider with zero queries; data lives in local JS modules):

| Metric | Lab before → after | Field target (p75) |
|---|---|---|
| Performance score | 67 → **91** | — |
| FCP | 4.1 s → **2.6 s** | (informational) |
| **LCP** | 6.4 s → **2.8 s** (anchored to FCP; was font-swap-bound) | **< 2.5 s** |
| **TBT** | 90–830 ms → **70 ms** | proxies **INP < 200 ms** |
| **CLS** | 0.002 | **< 0.1** ✓ |

Render-blocking resources: exactly ONE — the same-origin `main.css`
(~12 KB). If a second entry ever appears in Lighthouse's
render-blocking audit, a regression slipped in (see Rule 2).

If any future measurement disagrees with this baseline by more than
2× on LCP or drifts above the p75 threshold on any of the three,
open a fix before shipping new content.

---

## 13. Legacy WordPress redirects

All old WordPress URLs are 301'd to the closest equivalent new URL via
`frontend/public/_redirects`. This file is served verbatim by Netlify.
Format:

```
/old-wordpress-url    /new-static-url   301
```

Do not touch the wildcard `/*  /404.html  404` fallback at the bottom —
it's what gives unknown paths a proper 404 status + our stylized 404 page.

---

## 14. Acceptance test for any SEO change

**The acceptance test — run against the live Netlify deploy, not local.**
The change must appear in the raw HTML response with no JavaScript
execution. Curl is the definitive check.

### Title / meta / canonical

```bash
curl -sL https://methodmarketinggroup.com/writing/your-slug \
  | grep -Ei '<title>|"description"|"canonical"|og:title|og:description'
```

Expected: the exact updated string appears in the response.

### JSON-LD schema

```bash
curl -sL https://methodmarketinggroup.com/writing/your-slug \
  | grep -o '<script type="application/ld+json">.*</script>' \
  | python3 -c "import sys, json, re; \
                m = re.search(r'>(.*)<', sys.stdin.read()); \
                print(json.dumps(json.loads(m.group(1)), indent=2))"
```

Expected: valid JSON-LD, `@graph` contains the right entity types for the
page (see §6 table), `datePublished` is present on article pages.

### Sitemap

```bash
curl -sL https://methodmarketinggroup.com/sitemap.xml | grep -c '<loc>'
```

Expected: URL count matches the number of routes you expect.

### robots.txt

```bash
curl -sL https://methodmarketinggroup.com/robots.txt
```

Expected: `User-agent: *` / `Allow: /` / `Sitemap: https://methodmarketinggroup.com/sitemap.xml`

### With JavaScript disabled (the real test)

Open DevTools → Settings → Preferences → Debugger → **Disable JavaScript**
→ hard reload the page → View Source. Every SEO artifact (title, meta,
canonical, OG, Twitter, JSON-LD) must be present in the raw HTML.

---

## 15. Currently-flagged items (informational; do not rewrite without approval)

These titles / descriptions exceed the conventional soft limits. They are
**authored copy** and were not rewritten during the technical audit;
Method's editorial voice takes precedence over the 60/160 rule.

### Titles > 60 chars

| Route | Length | Title |
|---|---|---|
| `/work/medtech` | 81 | Four months to market. One system. From appointment to finished eyewear. — Method |
| `/writing/ai-hasnt-made-marketing-cheaper` | 73 | AI hasn't made marketing cheaper. It's made bad strategy faster. — Method |
| `/writing/cx-became-a-religion` | 80 | CX became a religion. The pews are full. The building is still on fire. — Method |
| `/writing/engineering-precision-three-taps` | 71 | Engineering. Precision. Three taps to defrost your windshield. — Method |
| `/writing/loyalty-program-that-rewards-everyone-except-loyal-customers` | 74 | The loyalty program that rewards everyone except loyal customers. — Method |
| `/writing/one-company-that-got-it-right` | 74 | One company that got it right. It's worth noting when it happens. — Method |
| `/writing/the-gap-series-introduction` | 80 | The gap between what companies promise and what they deliver. A series. — Method |
| `/writing/wrap-rage` | 72 | Wrap rage has an official name. That should tell you something. — Method |
| `/writing/you-cant-market-a-business-that-is-operationally-unsound` | 89 | You can't market a business that is operationally unsound. That used to be true. — Method |

**Effect:** Google may truncate the display title in SERPs. The full
title is still what's evaluated for ranking. If a specific one truly
needs shortening later, get author sign-off first.

### Descriptions > 160 chars

| Route | Length |
|---|---|
| `/work/manufacturing-performance` | 282 |
| `/work/medtech` | 252 |

**Effect:** Google may truncate the SERP snippet. Same rule as titles.

---

## 16. Technical audit results (as of last SEO pass)

- ✓ Exactly one H1 per page across all 22 routes
- ✓ Heading hierarchy contains no skips (h1 → h2 → h3 …)
- ✓ Every `<img>` has an `alt` attribute
- ✓ No generic anchor text ("click here", "read more", "here", etc.) —
  all internal links wrap descriptive title text
- ✓ `robots.txt` present, allows crawling, references sitemap
- ✓ Sitemap regenerates automatically when a slug is added to
  `writing.js` or `caseStudies.js`
- ✓ JSON-LD present in raw HTML on all indexable pages, no JS required
- ✓ Site verified in Google Search Console and Bing Webmaster Tools;
  sitemap submitted to both
- ✓ IndexNow wired into build chain; diff-based ping runs on every
  production Netlify deploy (see §8); key file live at
  `/f2da102fbb1f98cf309ec46aeefef39e.txt`
- ✓ Google Analytics 4 (G-7F2PPZPXSK) baked into every prerendered
  page's `<head>`; SPA route changes fire `page_view` via
  `useGAPageView` (see §9); privacy policy discloses collection
  and cookies
- ✓ Microsoft Clarity (xj8oadt46d) baked into every prerendered
  page's `<head>`; native SPA session stitching (see §10); privacy
  policy discloses collection, cookies, and Microsoft data processing
- ✓ Core Web Vitals — LCP < 2.5s / CLS < 0.1 / INP < 200ms at p75
  against the live production URL (see §12 for the budget, the
  critical-path pattern, and the verification protocol)
- ✓ Per-article social sharing cards — unique 1200×630 PNG for every
  `/writing/*` post, every `/work/*` case study, and `/about/discernment`;
  generated at build time from data files so adding a post
  auto-generates its card; graceful fallback to `og-default.jpg` if
  the per-slug PNG is missing (see §11)

---

## 17. When you should call this playbook out of date

- Method adds an X / Twitter / Bluesky / GitHub account → update `sameAs`
  arrays in `orgSchema()` (and `personGarySchema()` if it's Gary's).
- Method registers an office address → add `PostalAddress` to
  `orgSchema()` and to `professionalServiceSchema()`.
- Method's `serviceType` broadens beyond fractional CMO / strategic
  marketing → edit `professionalServiceSchema()`.
- The site launches a second author → duplicate the Person pattern and
  wire per-post authorship into `writing.js` (add `authorId` field per
  post).
- A per-post publish date model is added to `writing.js` → replace the
  single `SITE_LAUNCH_DATE` with `post.datePublished` in `articleSchema()`.

Ping the SEO team before making any of these changes if you're unsure.
