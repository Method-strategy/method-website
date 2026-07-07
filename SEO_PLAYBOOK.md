# SEO_PLAYBOOK.md

**This file replaces the WordPress / RankMath plugin interface.** Any future
session should be able to read this and safely make SEO changes without
breaking the build.

Method's SEO is code, not a CMS. All SEO artifacts (titles, meta
descriptions, canonicals, Open Graph, Twitter cards, JSON-LD structured
data, sitemap, RSS, robots.txt) are baked into the static HTML at build
time and served by Netlify as flat files. Nothing depends on JavaScript
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
  intentionally run long — see §7 for currently-flagged items).
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
yarn build \
  && node scripts/strip-emergent.js \
  && node scripts/prerender-og.js \
  && node scripts/prerender-ssg.js \
  && node scripts/generate-sitemap.js \
  && node scripts/generate-rss.js
```

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

## 8. Legacy WordPress redirects

All old WordPress URLs are 301'd to the closest equivalent new URL via
`frontend/public/_redirects`. This file is served verbatim by Netlify.
Format:

```
/old-wordpress-url    /new-static-url   301
```

Do not touch the wildcard `/*  /404.html  404` fallback at the bottom —
it's what gives unknown paths a proper 404 status + our stylized 404 page.

---

## 9. Acceptance test for any SEO change

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

## 10. Currently-flagged items (informational; do not rewrite without approval)

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

## 11. Technical audit results (as of last SEO pass)

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

---

## 12. When you should call this playbook out of date

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
