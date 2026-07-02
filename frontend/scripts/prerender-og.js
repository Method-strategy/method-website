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
    process.env.URL ||
    "https://methodmarketinggroup.com";

// og:image intentionally omitted for now. LinkedIn / Twitter unfurl to a
// clean compact card with just title + description when no image is set.
// When the client provides a 1200x630 branded image, drop it in
// /app/frontend/public/og-default.jpg and add the tag in buildMetaBlock.

// ---------- Route manifest ----------
const staticRoutes = [
    {
        path: "/",
        title: "Method — Clarifying how you show up in the market.",
        desc: "A strategic marketing practice. Fractional CMO-level partnership for B2B firms. Nearly forty years in the making.",
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
        desc: "A note on how Method chooses its work, and the kind of engagement that actually produces the outcome.",
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
    desc: w.dek,
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

const baseHtml = fs.readFileSync(INDEX_PATH, "utf8");

function buildMetaBlock(route) {
    const url = `${SITE}${route.path === "/" ? "" : route.path}`;
    const t = escapeAttr(route.title);
    const d = escapeAttr(route.desc);
    return `    <link rel="canonical" href="${escapeAttr(url)}" />
    <meta property="og:type" content="${route.type}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:site_name" content="Method" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />`;
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

    // 3. Strip any prior OG/Twitter/canonical block from a previous run
    out = out.replace(
        /\n\s*<link rel="canonical"[^>]*\/?>[\s\S]*?<meta name="twitter:description"[^>]*\/?>\n/,
        "\n"
    );

    // 4. Inject fresh meta block just before </head>
    out = out.replace(/(\s*)<\/head>/, `\n${buildMetaBlock(route)}$1</head>`);

    return out;
}

// ---------- Write per-route index.html ----------
let count = 0;
const written = [];
for (const route of routes) {
    const dir =
        route.path === "/"
            ? BUILD_DIR
            : path.join(BUILD_DIR, ...route.path.split("/").filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, "index.html");
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
    { test: /twitter:card" content="summary/i, label: "twitter:card" },
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
