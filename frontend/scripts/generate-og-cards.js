/* eslint-disable no-console */
/**
 * generate-og-cards.js
 *
 * Renders a unique 1200×630 PNG social sharing card for every article on
 * the site: each /writing/* post, the /about/discernment essay, and each
 * /work/* case study. Non-article pages (home, /about, /work index,
 * /writing index, /connect, /sitemap, /privacy-policy) continue to use
 * the sitewide og-default.jpg — the uniform brand card there is a
 * feature, not a limitation.
 *
 * How it works
 * ------------
 * 1. Loads writing.js and caseStudies.js to enumerate articles.
 * 2. Launches a headless Chromium via puppeteer.
 * 3. For each article, injects headline + eyebrow into an inline HTML
 *    template, waits for Scandia (from Adobe Typekit) to fully load, and
 *    takes a 1200×630 PNG screenshot.
 * 4. Writes to build/og/<section>/<slug>.png so the URL structure
 *    mirrors the article URL structure.
 *
 * The prerender-og.js script then points each article's og:image at its
 * matching file. If a card is missing for a given article, prerender-og
 * silently falls back to og-default.jpg so LinkedIn / Twitter unfurls
 * never break.
 *
 * Runs as a build-chain step BEFORE prerender-og.js so the PNG files
 * exist by the time meta tags are baked into the HTML.
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const BUILD_DIR = path.join(__dirname, "..", "build");
const OG_ROOT = path.join(BUILD_DIR, "og");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

// ---------- Load data ----------
// Each source file exports exactly one collection; we load them
// separately with a single-purpose loader.
function loadEsmExport(file, exportName) {
    const raw = fs.readFileSync(file, "utf8");
    const js = raw
        .replace(/^\s*export\s+const\s+/gm, "const ")
        .replace(/^\s*export\s+/gm, "");
    // eslint-disable-next-line no-new-func
    return new Function(`${js}\nreturn ${exportName};`)();
}
const writing = loadEsmExport(path.join(DATA_DIR, "writing.js"), "writing");
const caseStudies = loadEsmExport(
    path.join(DATA_DIR, "caseStudies.js"),
    "caseStudies"
);

// ---------- Card manifest ----------
// Each entry: { outPath (fs), headline, eyebrow }. Eyebrow logic:
//  - writing posts: seriesLabel if present, else category, else "WRITING"
//  - case studies: "CASE STUDY"
//  - discernment: "ESSAY"
function eyebrowForWriting(w) {
    if (w.seriesLabel) return w.seriesLabel.toUpperCase();
    if (w.category) return w.category.toUpperCase();
    return "WRITING";
}

const cards = [
    ...writing.map((w) => ({
        outPath: path.join(OG_ROOT, "writing", `${w.slug}.png`),
        headline: w.title,
        eyebrow: eyebrowForWriting(w),
    })),
    ...caseStudies.map((c) => ({
        outPath: path.join(OG_ROOT, "work", `${c.slug}.png`),
        headline: c.title,
        eyebrow: "CASE STUDY",
    })),
    {
        outPath: path.join(OG_ROOT, "about", "discernment.png"),
        headline: "Where discernment comes from.",
        eyebrow: "ESSAY",
    },
];

// ---------- Template ----------
// Renders as a full 1200×630 page. Uses Adobe Typekit for Scandia (same
// kit + display=swap the site uses) and Google Fonts for Cormorant
// Garamond italic (currently unused in the card but preloaded so future
// variants can use it without a code change). Colors are the site's
// canonical navy/cream/steel triad.
//
// Headline sizing is measured off character length so long titles don't
// overflow: <60 chars → 76px, 60–90 → 62px, 90–130 → 52px, 130+ → 44px.
// Line-height is tight (0.98) to match the site's wordmark treatment.
function fontSizeForHeadline(len) {
    if (len <= 60) return 76;
    if (len <= 90) return 62;
    if (len <= 130) return 52;
    return 44;
}

function buildHtml({ headline, eyebrow }) {
    const size = fontSizeForHeadline(headline.length);
    // Escape for HTML interpolation
    const esc = (s) =>
        String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://use.typekit.net" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://use.typekit.net/kiu8ndx.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap" />
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
        width: 1200px;
        height: 630px;
        background: #13243d;
        color: #f5f1eb;
        font-family: "scandia-web", "scandia", sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: geometricPrecision;
    }
    .card {
        width: 1200px;
        height: 630px;
        padding: 72px 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
    }
    /* Top row: wordmark + section eyebrow */
    .top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    .wordmark {
        font-weight: 800;
        font-size: 40px;
        letter-spacing: -0.04em;
        line-height: 1;
        color: #f5f1eb;
    }
    .eyebrow {
        font-weight: 600;
        font-size: 18px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(245, 241, 235, 0.55);
    }
    /* Headline block */
    .headline {
        font-weight: 800;
        font-size: ${size}px;
        line-height: 0.98;
        letter-spacing: -0.048em;
        color: #f5f1eb;
        max-width: 1040px;
    }
    /* Bottom row: URL + steel rule */
    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .url {
        font-weight: 500;
        font-size: 17px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(245, 241, 235, 0.55);
    }
    .rule {
        width: 96px;
        height: 3px;
        background: #7a94b0;
    }
</style>
</head>
<body>
    <div class="card">
        <div class="top">
            <div class="wordmark">Method</div>
            <div class="eyebrow">${esc(eyebrow)}</div>
        </div>
        <div class="headline">${esc(headline)}</div>
        <div class="bottom">
            <div class="url">methodmarketinggroup.com</div>
            <div class="rule"></div>
        </div>
    </div>
</body>
</html>`;
}

// ---------- Render ----------
(async () => {
    // SKIP_OG_CARDS=1 lets local dev skip the puppeteer step in
    // constrained environments (some dev containers can't launch
    // Chromium). Netlify's build image can, so we deliberately don't
    // skip there.
    if (process.env.SKIP_OG_CARDS === "1") {
        console.log("[og-cards] SKIP_OG_CARDS=1 set — skipping card generation.");
        console.log("[og-cards] Per-slug OG images will fall back to og-default.jpg.");
        process.exit(0);
    }

    fs.mkdirSync(OG_ROOT, { recursive: true });

    // Prefer the system-installed Chrome when present (works in
    // containerized dev environments where the Puppeteer-bundled
    // Chromium hits sandbox / OOM / DBus errors). On Netlify's build
    // image Puppeteer's downloaded Chromium is preferred — we fall
    // back to that automatically when no system binary is found.
    const systemChromePaths = [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
    ];
    const executablePath = systemChromePaths.find((p) => fs.existsSync(p));

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath,
            // Extra flags for constrained container environments. Safe
            // because we're rendering controlled local HTML, not
            // untrusted user content.
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--font-render-hinting=none",
            ],
            headless: "shell",
            defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
        });
    } catch (err) {
        // Puppeteer launch failure on the build server: log clearly and
        // exit CLEAN so the deploy still ships. prerender-og.js is coded
        // to fall back to og-default.jpg when a per-slug PNG is missing,
        // so the site remains functional (uniform brand card instead of
        // per-article cards). Better than a hard build failure.
        console.warn("[og-cards] Puppeteer failed to launch — skipping card generation.");
        console.warn(`[og-cards] Reason: ${err.message.split("\n")[0]}`);
        console.warn("[og-cards] Per-slug OG images will fall back to og-default.jpg for this deploy.");
        console.warn("[og-cards] Investigate the Chromium environment before the next deploy.");
        process.exit(0);
    }

    let written = 0;
    for (const card of cards) {
        const page = await browser.newPage();
        try {
            const html = buildHtml(card);
            await page.setContent(html, { waitUntil: "networkidle0" });

            // Wait for Scandia to actually load. Adobe Typekit exposes a
            // fonts-loaded class on <html> when its JS runs, but we're
            // loading via the CSS-only method — so wait on document.fonts
            // instead. This is the reliable signal that all @font-face
            // rules have been resolved and the browser will paint with
            // the real face rather than the fallback.
            await page.evaluate(async () => {
                if (document.fonts && document.fonts.ready) {
                    await document.fonts.ready;
                }
            });
            // Small extra beat so the browser finishes any layout
            // reflow after the font swap before the screenshot fires.
            await new Promise((r) => setTimeout(r, 150));

            fs.mkdirSync(path.dirname(card.outPath), { recursive: true });
            await page.screenshot({
                path: card.outPath,
                type: "png",
                clip: { x: 0, y: 0, width: 1200, height: 630 },
                omitBackground: false,
            });
            written++;
            console.log(
                `[og-cards] Wrote ${path.relative(BUILD_DIR, card.outPath)}`
            );
        } finally {
            await page.close();
        }
    }

    await browser.close();
    console.log(`[og-cards] Rendered ${written}/${cards.length} cards.`);

    if (written !== cards.length) {
        console.error("[og-cards] Some cards failed — aborting.");
        process.exit(1);
    }
})();
