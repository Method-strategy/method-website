/* eslint-disable no-console */
/**
 * prerender-og.js
 *
 * Post-build step: writes a static build/{route}/index.html for every known
 * route, each with its own OG / Twitter / canonical meta baked into the head.
 *
 * Why: LinkedIn, Twitter, iMessage, WhatsApp and most other unfurlers do NOT
 * execute JavaScript. Client-side meta (react-helmet) is invisible to them.
 * A static HTML shell per route is the only reliable way to get per-post /
 * per-case-study previews when links are shared.
 *
 * The SPA still boots from any of these files — the /static/js bundle path
 * is identical, and React Router picks up window.location.pathname on mount.
 *
 * Runs AFTER strip-emergent.js so the prerendered shells are already clean.
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");
const INDEX_PATH = path.join(BUILD_DIR, "index.html");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

if (!fs.existsSync(INDEX_PATH)) {
    console.error(`[prerender-og] build/index.html not found at ${INDEX_PATH}`);
    process.exit(1);
}

// ---------- Load ESM data modules via a tiny CJS transform ----------
// The data files use `export const foo = ...` syntax. We rewrite each
// exported const so it BOTH declares a local `const foo` (so later
// expressions in the same module can reference it) AND assigns to
// module.exports.foo. Any remaining bare `export` prefixes get stripped.
function loadEsmData(filePath) {
    const src = fs.readFileSync(filePath, "utf8");
    const cjs = src
        .replace(
            /export\s+const\s+(\w+)\s*=/g,
            "const $1 = module.exports.$1 ="
        )
        .replace(/^export\s+/gm, "");
    const m = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function("module", "exports", cjs)(m, m.exports);
    return m.exports;
}

const { writing } = loadEsmData(path.join(DATA_DIR, "writing.js"));
const { caseStudies } = loadEsmData(path.join(DATA_DIR, "caseStudies.js"));

// ---------- Site + defaults ----------
const SITE =
    process.env.SITE_URL ||
    "https://methodmarketinggroup.com";

// Single sitewide typographic OG card. Lives at /public/og-default.jpg and is
// generated as an HTML render (Scandia + Cormorant italic on navy) — no photos.
// LinkedIn / Twitter show the branded card image + the per-route title +
// description text below, which is the ideal split: brand consistency in the
// image, content specificity in the text.
const OG_IMAGE = `${SITE}/og-default.jpg`;

// ---------- Route manifest ----------
const staticRoutes = [
    {
        path: "/",
        title: "Method — Clarifying how you show up in the market.",
        desc: "A strategic marketing practice. Fractional CMO-level partnership for B2B firms. More than forty years in the making.",
        type: "website",
    },
    {
        path: "/work",
        title: "Work — Method",
        desc: "Case studies from a strategic marketing practice working with a small number of B2B clients at significant depth.",
        type: "website",
    },
    {
        path: "/about",
        title: "About — Method",
        desc: "Method is a strategic marketing practice led by Gary Hopkins. Fractional CMO-level partnership for B2B firms.",
        type: "website",
    },
    {
        path: "/about/discernment",
        title: "Discernment — Method",
        desc: "A basement in Cincinnati, a stat camera, an Ogilvy cassette set, and what four decades of craft actually teach. Gary Hopkins on where standards come from.",
        type: "article",
    },
    {
        path: "/writing",
        title: "Writing — Method",
        desc: "Essays on marketing strategy, brand positioning, and the gap between what companies promise and what they actually deliver.",
        type: "website",
    },
    {
        path: "/connect",
        title: "Connect — Method",
        desc: "Contact Method to discuss a strategic marketing engagement.",
        type: "website",
    },
    {
        path: "/sitemap",
        title: "Sitemap — Method",
        desc: "Every page on the Method site: work, writing, and how to connect.",
        type: "website",
    },
    {
        path: "/privacy-policy",
        title: "Privacy Policy — Method",
        desc: "How Method Marketing Group LLC collects, uses, and protects your personal information.",
        type: "website",
    },
    {
        // Netlify serves build/404.html with a real 404 status for any
        // unknown path (see public/_redirects). noindex keeps it out of
        // search results.
        path: "/404",
        outFile: "404.html",
        title: "Page not found — Method",
        desc: "This page doesn't exist. It may have once. Things have changed around here.",
        type: "website",
        noindex: true,
    },
];

const workRoutes = caseStudies.map((c) => ({
    path: `/work/${c.slug}`,
    title: `${c.title} — Method`,
    desc: c.summary,
    type: "article",
}));

const writingRoutes = writing.map((w) => ({
    path: `/writing/${w.slug}`,
    title: `${w.title} — Method`,
    // `share` is the author-approved verbatim excerpt for meta / og /
    // twitter descriptions. Fall back to `dek` if a post hasn't been given
    // its own share copy yet.
    desc: w.share || w.dek,
    type: "article",
}));

const routes = [...staticRoutes, ...workRoutes, ...writingRoutes];

// ---------- HTML utilities ----------
const escapeAttr = (s) =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const baseHtml = (() => {
    let html = fs.readFileSync(INDEX_PATH, "utf8");
    // Ensure #root is empty in the base template — subsequent SSG runs
    // may have filled it, but each fresh prerender starts from an empty
    // root that prerender-ssg (if present) will re-render into.
    html = html.replace(
        /<div id="root">[\s\S]*?<\/div>(?=\s*(<script|<\/body))/i,
        '<div id="root"></div>'
    );
    return html;
})();

function buildMetaBlock(route) {
    const url = `${SITE}${route.path === "/" ? "" : route.path}`;
    const t = escapeAttr(route.title);
    const d = escapeAttr(route.desc);
    if (route.noindex) {
        return `<meta name="method-seo-block" content="start" />
    <meta name="robots" content="noindex" />
    <meta property="og:site_name" content="Method" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta name="method-seo-block" content="end" />`;
    }
    return `<meta name="method-seo-block" content="start" />
    <link rel="canonical" href="${escapeAttr(url)}" />
    <meta property="og:type" content="${route.type}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:site_name" content="Method" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${escapeAttr(OG_IMAGE)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Method — Clarifying how you show up in the market." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${escapeAttr(OG_IMAGE)}" />
    <meta name="method-seo-block" content="end" />`;
}

function renderRoute(html, route) {
    const t = escapeAttr(route.title);
    const d = escapeAttr(route.desc);

    // 1. Replace <title>
    let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);

    // 2. Replace <meta name="description">
    out = out.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${d}" />`
    );

    // 3. Strip any prior META_SEO block(s) from previous runs — idempotent.
    // Uses <meta> sentinels because CRA's HTML minifier strips comments.
    out = out.replace(
        /\s*<meta\s+name="method-seo-block"\s+content="start"[^>]*\/?>[\s\S]*?<meta\s+name="method-seo-block"\s+content="end"[^>]*\/?>/g,
        ""
    );

    // 4. Inject fresh block just before </head>.
    out = out.replace(/(\s*)<\/head>/, `\n    ${buildMetaBlock(route)}\n$1</head>`);

    return out;
}

// ---------- Write per-route index.html ----------
let count = 0;
const written = [];
for (const route of routes) {
    let outFile;
    if (route.outFile) {
        outFile = path.join(BUILD_DIR, route.outFile);
    } else {
        const dir =
            route.path === "/"
                ? BUILD_DIR
                : path.join(BUILD_DIR, ...route.path.split("/").filter(Boolean));
        fs.mkdirSync(dir, { recursive: true });
        outFile = path.join(dir, "index.html");
    }
    fs.writeFileSync(outFile, renderRoute(baseHtml, route), "utf8");
    written.push(path.relative(BUILD_DIR, outFile));
    count++;
}

// ---------- Sanity check ----------
const sample = fs.readFileSync(
    path.join(
        BUILD_DIR,
        "writing",
        "the-gap-series-introduction",
        "index.html"
    ),
    "utf8"
);
const checks = [
    { test: /<title>The gap between what companies promise/i, label: "per-route <title>" },
    { test: /og:title" content="The gap between/i, label: "per-route og:title" },
    { test: /og:type" content="article/i, label: "og:type article" },
    { test: /twitter:card" content="summary_large_image/i, label: "twitter:card" },
    { test: /og:image" content="[^"]*og-default\.jpg/, label: "og:image" },
    { test: /rel="canonical"/, label: "canonical link" },
    { test: /id="root"/, label: "div#root preserved" },
    { test: /static\/js\/main\./, label: "CRA main.js bundle preserved" },
];
const failed = checks.filter((c) => !c.test.test(sample)).map((c) => c.label);
if (failed.length) {
    console.error(
        `[prerender-og] FAILED sanity check on sample route: ${failed.join(", ")}`
    );
    process.exit(1);
}

console.log(`[prerender-og] Wrote ${count} per-route index.html files:`);
for (const w of written) console.log(`  - ${w}`);
console.log("[prerender-og] Sanity check: OK");
