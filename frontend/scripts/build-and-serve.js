#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * build-and-serve.js
 *
 * What `yarn start` runs in this project. It performs a full production
 * build with SSG so the served output matches what Netlify will publish,
 * then serves ./build/ on the configured HOST:PORT.
 *
 * Why: the whole point of the SSG chain is that any HTTP client — including
 * AI crawlers with no JavaScript execution — receives fully rendered HTML.
 * The CRA dev server serves an empty shell + JS bundle, which defeats that
 * verification. This wrapper ensures the preview URL reflects the SSG'd
 * production artifact.
 *
 * To fall back to CRA dev (hot reload, no SSG): `yarn start:dev`.
 */

const { spawnSync } = require("child_process");
const path = require("path");

const cwd = path.join(__dirname, "..");
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "0.0.0.0";

function run(cmd, args, label) {
    console.log(`\n[build-and-serve] ${label || cmd + " " + args.join(" ")}`);
    const r = spawnSync(cmd, args, { cwd, stdio: "inherit", env: process.env });
    if (r.status !== 0) {
        console.error(`[build-and-serve] step failed: ${label || cmd}`);
        process.exit(r.status || 1);
    }
}

// 1. Full CRA production build
run("yarn", ["build"], "yarn build");

// 2. Post-build chain (mirrors netlify.toml)
run("node", ["scripts/strip-emergent.js"], "strip-emergent");
run("node", ["scripts/prerender-og.js"], "prerender-og");
run("node", ["scripts/prerender-ssg.js"], "prerender-ssg");
run("node", ["scripts/generate-sitemap.js"], "generate-sitemap");
run("node", ["scripts/generate-rss.js"], "generate-rss");

// 3. Serve build/ statically with Netlify-parity routing rules
//    (file-based / flat-file layout — see SEO_PLAYBOOK.md §9.0):
//    - exact file → serve it
//    - /foo with build/foo.html → serve foo.html (200, clean URL)
//    - /foo/ with build/foo.html → 301 → /foo (Netlify's slash normalization)
//    - / → build/index.html
//    - anything else → build/404.html with a real 404 status
const http = require("http");
const fs = require("fs");

const BUILD = path.join(cwd, "build");
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".map": "application/json; charset=utf-8",
};

function safeJoin(base, target) {
    const resolved = path.resolve(base, "." + target);
    if (!resolved.startsWith(base)) return null;
    return resolved;
}

function send(res, filePath, status = 200) {
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(status, {
        "Content-Type": type,
        // Preview-only server (Netlify never runs this file): make sure
        // preview copies of the site can never enter search indexes.
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control":
            ext === ".html" || ext === ".xml"
                ? "no-cache"
                : "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
}

console.log(
    `\n[build-and-serve] Serving ./build on http://${HOST}:${PORT} (static, SSG'd)`
);

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

    const abs = safeJoin(BUILD, urlPath);
    if (!abs) {
        res.writeHead(400);
        res.end("bad path");
        return;
    }

    // 1) Exact file
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
        return send(res, abs);
    }

    // 2) Clean URL — /writing/wrap-rage → build/writing/wrap-rage.html
    if (!urlPath.endsWith("/") && fs.existsSync(`${abs}.html`)) {
        return send(res, `${abs}.html`);
    }

    // 3) Trailing slash → 301 to canonical non-slash form (Netlify parity)
    if (urlPath.length > 1 && urlPath.endsWith("/")) {
        const stripped = urlPath.replace(/\/+$/, "");
        const strippedAbs = safeJoin(BUILD, stripped);
        if (strippedAbs && fs.existsSync(`${strippedAbs}.html`)) {
            res.writeHead(301, { Location: stripped });
            return res.end();
        }
    }

    // 4) Root
    if (urlPath === "/") return send(res, path.join(BUILD, "index.html"));

    // 5) Unknown path → 404 page with real 404 status (Netlify parity)
    return send(res, path.join(BUILD, "404.html"), 404);
});

server.listen(Number(PORT), HOST, () => {
    console.log(`[build-and-serve] Ready on http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
