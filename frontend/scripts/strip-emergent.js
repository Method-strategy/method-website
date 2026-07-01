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

// 3. PostHog analytics init block. Handle both pretty and minified builds
//    by matching any <script>…</script> block that mentions posthog.init.
const posthogRegex =
    /<script\b[^>]*>[\s\S]*?posthog\.init[\s\S]*?<\/script>\s*/gi;
if (posthogRegex.test(html)) {
    html = html.replace(posthogRegex, "");
    removals.push("posthog analytics init");
}

// 4. DataCloneError window.addEventListener shim (pretty or minified).
const dataCloneRegex =
    /<script\b[^>]*>[\s\S]*?DataCloneError[\s\S]*?<\/script>\s*/gi;
if (dataCloneRegex.test(html)) {
    html = html.replace(dataCloneRegex, "");
    removals.push("DataCloneError shim");
}

// Tidy trailing whitespace before </body>
html = html.replace(/\s+<\/body>/, "\n    </body>");

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
