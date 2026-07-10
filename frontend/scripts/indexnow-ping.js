/* eslint-disable no-console */
/**
 * indexnow-ping.js
 *
 * Final step in the deploy pipeline. Announces new / changed URLs to the
 * IndexNow ecosystem (Bing, Yandex, etc.) so they can crawl the freshest
 * version of the site without waiting for their natural recrawl cadence.
 *
 * How it works
 * ------------
 * 1. Walks the just-built build/ directory and computes a SHA-256 hash of
 *    every HTML file (the SSG output). This gives a stable per-URL
 *    fingerprint of the current deploy.
 * 2. Writes those hashes to build/indexnow-manifest.json.
 * 3. Fetches the previously-live manifest from
 *    https://methodmarketinggroup.com/indexnow-manifest.json — this is
 *    what THIS deploy is about to replace.
 * 4. Diffs the two: any URL whose hash changed, or is new entirely, is a
 *    submission candidate.
 * 5. Batches the diff and POSTs it to https://api.indexnow.org/indexnow.
 *
 * What we don't do
 * ----------------
 * - We never ping the entire sitemap on every deploy. If nothing changed,
 *   nothing gets pinged.
 * - We never fail the build if the ping fails. IndexNow is best-effort.
 * - We skip ping on Netlify preview / branch deploys — only production.
 *
 * Guardrails / env
 * ----------------
 * - SKIP_INDEXNOW=1   → skip entirely (useful for local runs)
 * - NETLIFY_CONTEXT   → set by Netlify. We only ping when this is
 *                       "production" or unset (local build chain).
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BUILD_DIR = path.join(__dirname, "..", "build");
const SITE = process.env.SITE_URL || "https://methodmarketinggroup.com";
const HOST = new URL(SITE).host;

// Public key, matching the file we host at /<KEY>.txt at the site root.
// The IndexNow endpoint validates this by fetching the keyLocation URL and
// checking that its body equals `key`. See:
// https://www.indexnow.org/documentation
const INDEXNOW_KEY = "f2da102fbb1f98cf309ec46aeefef39e";
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;

// Aggregation endpoint. Submissions here are relayed to every participating
// IndexNow engine (Bing, Yandex, Seznam, Naver, etc.) so we don't need to
// call each search engine individually.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// IndexNow rejects payloads with more than 10,000 URLs per request. We're
// nowhere near that, but keep the batch cap explicit for future-proofing.
const MAX_URLS_PER_REQUEST = 10000;

// Where the manifest ends up in the build output and where we look for
// the previous one on the live site.
const MANIFEST_FILENAME = "indexnow-manifest.json";
const LIVE_MANIFEST_URL = `${SITE}/${MANIFEST_FILENAME}`;

// ---------------------------------------------------------------
// 0. Guardrails
// ---------------------------------------------------------------
if (process.env.SKIP_INDEXNOW === "1") {
    console.log("[indexnow] SKIP_INDEXNOW=1 set — skipping ping.");
    process.exit(0);
}

// NETLIFY_CONTEXT is "production" | "deploy-preview" | "branch-deploy".
// When run locally the variable is undefined — allow that so the build
// chain works end-to-end. Non-production Netlify contexts skip the ping.
const ctx = process.env.NETLIFY_CONTEXT;
if (ctx && ctx !== "production") {
    console.log(
        `[indexnow] NETLIFY_CONTEXT=${ctx} — skipping (production only).`
    );
    process.exit(0);
}

// ---------------------------------------------------------------
// 1. Walk the build directory and hash every URL's HTML
// ---------------------------------------------------------------
/**
 * Convert a filesystem path inside build/ to a canonical public URL.
 *
 *   build/index.html                          -> https://.../
 *   build/writing/wrap-rage.html              -> https://.../writing/wrap-rage
 *   build/404.html                            -> (skipped, noindex)
 */
function filePathToUrl(fsPath) {
    const rel = path
        .relative(BUILD_DIR, fsPath)
        .split(path.sep)
        .join("/");
    if (rel === "index.html") return `${SITE}/`;
    if (rel === "404.html") return null; // noindex — never submit
    if (rel.endsWith(".html")) {
        return `${SITE}/${rel.slice(0, -".html".length)}`;
    }
    return null;
}

function walkHtmlFiles(dir, acc = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip CRA static asset directories — they contain hashed JS/CSS
            // whose contents change every build but don't represent a URL
            // change the crawler cares about.
            if (entry.name === "static") continue;
            walkHtmlFiles(full, acc);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            acc.push(full);
        }
    }
    return acc;
}

function sha256(buf) {
    return crypto.createHash("sha256").update(buf).digest("hex");
}

const htmlFiles = walkHtmlFiles(BUILD_DIR);
const manifest = {}; // { url: sha256(html) }
for (const file of htmlFiles) {
    const url = filePathToUrl(file);
    if (!url) continue;
    manifest[url] = sha256(fs.readFileSync(file));
}

if (Object.keys(manifest).length === 0) {
    console.error("[indexnow] No HTML files found under build/ — aborting.");
    process.exit(1);
}

// Persist the manifest so the NEXT deploy can diff against it. Written to
// build/ so it ships as a static asset — the next build fetches it from
// https://methodmarketinggroup.com/indexnow-manifest.json.
fs.writeFileSync(
    path.join(BUILD_DIR, MANIFEST_FILENAME),
    JSON.stringify(manifest, null, 2),
    "utf8"
);
console.log(
    `[indexnow] Wrote ${MANIFEST_FILENAME} (${Object.keys(manifest).length} URLs).`
);

// ---------------------------------------------------------------
// 2. Fetch the previous manifest from the live site and diff
// ---------------------------------------------------------------
(async () => {
    let previous = null;
    try {
        const res = await fetch(LIVE_MANIFEST_URL, {
            headers: { "User-Agent": "method-indexnow/1.0" },
        });
        if (res.ok) {
            previous = await res.json();
            console.log(
                `[indexnow] Loaded previous manifest (${
                    Object.keys(previous).length
                } URLs) from ${LIVE_MANIFEST_URL}.`
            );
        } else if (res.status === 404) {
            console.log(
                "[indexnow] No previous manifest on live site (first-time IndexNow deploy). Will submit ALL URLs."
            );
        } else {
            console.warn(
                `[indexnow] Live manifest fetch returned ${res.status}. Will submit ALL URLs.`
            );
        }
    } catch (err) {
        console.warn(
            `[indexnow] Live manifest fetch failed (${err.message}). Will submit ALL URLs.`
        );
    }

    let urlsToSubmit;
    if (!previous) {
        urlsToSubmit = Object.keys(manifest);
    } else {
        urlsToSubmit = Object.keys(manifest).filter(
            (url) => manifest[url] !== previous[url]
        );
    }

    if (urlsToSubmit.length === 0) {
        console.log(
            "[indexnow] No new or changed URLs in this deploy — nothing to submit."
        );
        return;
    }

    console.log(`[indexnow] Submitting ${urlsToSubmit.length} URL(s):`);
    for (const u of urlsToSubmit) console.log(`  - ${u}`);

    // ---------------------------------------------------------------
    // 3. POST to IndexNow (never let a failure fail the build)
    // ---------------------------------------------------------------
    for (let i = 0; i < urlsToSubmit.length; i += MAX_URLS_PER_REQUEST) {
        const batch = urlsToSubmit.slice(i, i + MAX_URLS_PER_REQUEST);
        const body = JSON.stringify({
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: batch,
        });
        try {
            const res = await fetch(INDEXNOW_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "User-Agent": "method-indexnow/1.0",
                },
                body,
            });
            // Per spec: 200 OK / 202 Accepted are success. 422 = malformed
            // URL list. 4xx = key or host issue. 5xx = engine problem.
            if (res.ok) {
                console.log(
                    `[indexnow] Batch ${i / MAX_URLS_PER_REQUEST + 1} accepted (HTTP ${res.status}).`
                );
            } else {
                const text = await res.text().catch(() => "");
                console.warn(
                    `[indexnow] Batch ${i / MAX_URLS_PER_REQUEST + 1} rejected: HTTP ${res.status} ${text}`
                );
            }
        } catch (err) {
            console.warn(
                `[indexnow] Batch ${i / MAX_URLS_PER_REQUEST + 1} network error: ${err.message}`
            );
        }
    }

    console.log("[indexnow] Done.");
})();
