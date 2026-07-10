/* eslint-disable no-console */
/**
 * prerender-ssg.js
 *
 * Static Site Generation post-build step. Bundles the SSR entry with esbuild,
 * then for every known route renders the React tree to an HTML string via
 * react-dom/server and injects it into that route's <div id="root"> shell
 * (which was already given per-route meta by prerender-og.js).
 *
 * Why: LinkedIn / iMessage / Twitter unfurlers, Google, and — increasingly —
 * AI answer engines (Claude, Perplexity, Google's AI Overview) do NOT execute
 * JavaScript. Without SSG they see an empty <div id="root">. With SSG they
 * see the actual page content. Runs AFTER prerender-og.js so the same head
 * meta stays intact; the ONLY thing this step changes is the body's root
 * container.
 *
 * On the client we already switched to `hydrateRoot` in src/index.js when
 * #root has prerendered children, so hydration takes over the SSR'd DOM
 * cleanly.
 */

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const FRONTEND_DIR = path.join(__dirname, "..");
const BUILD_DIR = path.join(FRONTEND_DIR, "build");
const SRC_DIR = path.join(FRONTEND_DIR, "src");
const DATA_DIR = path.join(SRC_DIR, "data");
const TMP_DIR = path.join(__dirname, ".tmp");

// ------------------------------------------------------------------
// Route manifest (mirrors prerender-og.js — kept in sync manually
// because the two scripts each need their own view of the route list)
// ------------------------------------------------------------------
function loadEsmData(filePath) {
    const src = fs.readFileSync(filePath, "utf8");
    const cjs = src
        .replace(/export\s+const\s+(\w+)\s*=/g, "const $1 = module.exports.$1 =")
        .replace(/^export\s+/gm, "");
    const m = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function("module", "exports", cjs)(m, m.exports);
    return m.exports;
}

const { writing } = loadEsmData(path.join(DATA_DIR, "writing.js"));
const { caseStudies } = loadEsmData(path.join(DATA_DIR, "caseStudies.js"));

const routes = [
    "/",
    "/work",
    "/about",
    "/about/discernment",
    "/writing",
    "/connect",
    "/sitemap",
    "/privacy-policy",
    ...caseStudies.map((c) => `/work/${c.slug}`),
    ...writing.map((w) => `/writing/${w.slug}`),
    "/404",
];

// ------------------------------------------------------------------
// Bundle the SSR entry so we can require() it from Node
// ------------------------------------------------------------------
fs.mkdirSync(TMP_DIR, { recursive: true });
const OUT_FILE = path.join(TMP_DIR, "ssr.cjs");

esbuild.buildSync({
    entryPoints: [path.join(__dirname, "ssr-entry.jsx")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: OUT_FILE,
    target: "node20",
    jsx: "automatic",
    loader: {
        ".js": "jsx",
        ".css": "empty",
        ".png": "empty",
        ".jpg": "empty",
        ".jpeg": "empty",
        ".gif": "empty",
        ".webp": "empty",
        ".svg": "empty",
    },
    alias: {
        "@": SRC_DIR,
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
    logLevel: "warning",
});

// ------------------------------------------------------------------
// Render every route and inject into its per-route index.html shell
// ------------------------------------------------------------------
// eslint-disable-next-line import/no-dynamic-require, global-require
const { render } = require(OUT_FILE);

function shellPathForRoute(route) {
    if (route === "/") return path.join(BUILD_DIR, "index.html");
    // Netlify serves build/404.html for unknown paths (see public/_redirects).
    if (route === "/404") return path.join(BUILD_DIR, "404.html");
    // Flat file layout (canonical non-slash URLs — SEO_PLAYBOOK.md §9.0):
    // /writing/wrap-rage -> build/writing/wrap-rage.html
    const parts = route.split("/").filter(Boolean);
    return path.join(
        BUILD_DIR,
        ...parts.slice(0, -1),
        `${parts[parts.length - 1]}.html`
    );
}

let injected = 0;
const skipped = [];
for (const route of routes) {
    const filePath = shellPathForRoute(route);
    if (!fs.existsSync(filePath)) {
        skipped.push(route);
        continue;
    }
    const html = fs.readFileSync(filePath, "utf8");

    let ssrHtml;
    try {
        ssrHtml = render(route);
    } catch (err) {
        console.error(`[ssg] render failed for ${route}: ${err.message}`);
        process.exit(1);
    }

    // Inject into the empty <div id="root"></div>. The regex tolerates
    // both self-closing and separate closing tag forms plus whitespace.
    const rootRe = /<div id="root">(?:\s*)<\/div>/;
    if (!rootRe.test(html)) {
        console.error(`[ssg] could not find <div id="root"> in ${filePath}`);
        process.exit(1);
    }
    const out = html.replace(rootRe, `<div id="root">${ssrHtml}</div>`);
    fs.writeFileSync(filePath, out, "utf8");
    injected++;
}

// ------------------------------------------------------------------
// Sanity check
// ------------------------------------------------------------------
const sample = fs.readFileSync(
    shellPathForRoute("/writing/wrap-rage"),
    "utf8"
);
const checks = [
    { test: /Wrap rage has an official name/, label: "post title in body" },
    { test: /Wrap rage is a real term/, label: "post body text present" },
    { test: /class="[^"]*\bwordmark\b[^"]*"/i, label: "wordmark class rendered" },
    { test: /<div id="root"><div/, label: "root has child content" },
    { test: /static\/js\/main\./, label: "CRA main.js still linked" },
];
const failed = checks.filter((c) => !c.test.test(sample)).map((c) => c.label);
if (failed.length) {
    console.error(`[ssg] FAILED sanity check: ${failed.join(", ")}`);
    process.exit(1);
}

console.log(
    `[ssg] Rendered ${injected} routes to static HTML` +
        (skipped.length ? ` (skipped ${skipped.length}: ${skipped.join(", ")})` : "")
);
console.log("[ssg] Sanity check: OK");

// Clean up the bundle
fs.rmSync(TMP_DIR, { recursive: true, force: true });
