/* eslint-disable no-console */
/**
 * strip-emergent.js
 *
 * Post-build cleanup for Netlify production deploys.
 * Removes Emergent-only chrome from build/index.html so the shipped site
 * carries none of the platform's badges, scripts, or analytics.
 *
 * Leaves /app/frontend/public/index.html untouched so the Emergent editor
 * and visual-edits pipeline keep working locally.
 *
 * Run from within /app/frontend:
 *   node scripts/strip-emergent.js
 *
 * Every regex uses a tempered greedy token — `(?:(?!<\/script>)[\s\S])*?` —
 * so the match cannot cross an intermediate </script> boundary. That prevents
 * one match from swallowing the CRA main.js script and the <div id="root">.
 * A sanity check at the end fails the build if anything essential was lost.
 */

const fs = require("fs");
const path = require("path");

const INDEX_PATH = path.join(__dirname, "..", "build", "index.html");

if (!fs.existsSync(INDEX_PATH)) {
    console.error(`[strip-emergent] build/index.html not found at ${INDEX_PATH}`);
    console.error("[strip-emergent] Did you run `yarn build` first?");
    process.exit(1);
}

let html = fs.readFileSync(INDEX_PATH, "utf8");
const originalLength = html.length;
const removals = [];

// A tempered greedy fragment: matches any character sequence that does NOT
// contain a closing </script>. Used to scope inline-script removals to a
// single <script> element.
const NOT_END = "(?:(?!<\\/script>)[\\s\\S])*?";

// 1. The floating "Made with Emergent" badge (anchor + inline SVG + <p>).
const badgeRegex = /<a\s+id="emergent-badge"[\s\S]*?<\/a>\s*/gi;
if (badgeRegex.test(html)) {
    html = html.replace(badgeRegex, "");
    removals.push("emergent-badge anchor");
}

// 2. The Emergent runtime script tag.
const mainScriptRegex =
    /<script\s+src="https:\/\/assets\.emergent\.sh\/scripts\/emergent-main\.js"><\/script>\s*/gi;
if (mainScriptRegex.test(html)) {
    html = html.replace(mainScriptRegex, "");
    removals.push("emergent-main.js script");
}

// 3. PostHog analytics init block — must not cross </script> boundaries.
const posthogRegex = new RegExp(
    `<script\\b[^>]*>${NOT_END}posthog\\.init${NOT_END}<\\/script>\\s*`,
    "gi"
);
if (posthogRegex.test(html)) {
    html = html.replace(posthogRegex, "");
    removals.push("posthog analytics init");
}

// 4. DataCloneError window.addEventListener shim.
const dataCloneRegex = new RegExp(
    `<script\\b[^>]*>${NOT_END}DataCloneError${NOT_END}<\\/script>\\s*`,
    "gi"
);
if (dataCloneRegex.test(html)) {
    html = html.replace(dataCloneRegex, "");
    removals.push("DataCloneError shim");
}

// Tidy trailing whitespace before </body>
html = html.replace(/\s+<\/body>/, "\n    </body>");

// ------- SANITY CHECK — do NOT publish a gutted build -------
const mustHave = [
    { test: /id="root"/, label: 'div#root' },
    { test: /static\/js\/main\.[^"]+\.js/, label: 'CRA main.js script tag' },
    { test: /static\/css\/main\.[^"]+\.css/, label: 'CRA main.css link tag' },
    { test: /<title>Method/i, label: '<title>' }
];
const missing = mustHave.filter((m) => !m.test.test(html)).map((m) => m.label);

const mustNotHave = [
    { test: /emergent-badge/, label: 'emergent-badge' },
    { test: /assets\.emergent\.sh\/scripts\/emergent-main\.js/, label: 'emergent-main.js' },
    { test: /posthog/, label: 'posthog' },
    { test: /DataCloneError/, label: 'DataCloneError' }
];
const leftover = mustNotHave.filter((m) => m.test.test(html)).map((m) => m.label);

if (missing.length || leftover.length) {
    console.error("[strip-emergent] FAILED sanity check.");
    if (missing.length)
        console.error(`  Missing required markers: ${missing.join(", ")}`);
    if (leftover.length)
        console.error(`  Unstripped artifacts remaining: ${leftover.join(", ")}`);
    console.error("[strip-emergent] Aborting to avoid publishing a broken build.");
    process.exit(1);
}

fs.writeFileSync(INDEX_PATH, html, "utf8");
const newLength = html.length;

console.log("[strip-emergent] Cleaned build/index.html");
console.log(
    `[strip-emergent] Removed: ${
        removals.length ? removals.join(", ") : "nothing (already clean)"
    }`
);
console.log(
    `[strip-emergent] Size: ${originalLength} -> ${newLength} bytes (${
        originalLength - newLength
    } removed)`
);
console.log("[strip-emergent] Sanity check: OK");
