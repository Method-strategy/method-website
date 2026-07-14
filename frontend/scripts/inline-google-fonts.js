/* eslint-disable no-console */
/**
 * inline-google-fonts.js
 *
 * Post-build step: fetches the Google Fonts css2 stylesheets referenced by
 * async preload/onload links in build/index.html and inlines their
 * @font-face rules directly into the HTML.
 *
 * WHY (SEO_PLAYBOOK.md §12.3 Rule 2): the Cormorant/Lexend woff2 files are
 * preloaded, but a preloaded font sits UNUSED until the @font-face rule
 * that references it arrives. With the css2 stylesheet loading async, its
 * arrival raced the JS bundle for bandwidth on slow links — when it lost,
 * the font applied seconds late and the swap repaint re-registered LCP
 * (observed live: LCP flapping between 2.9s and 6.6s run-to-run). Inlining
 * the rules makes fonts apply the moment the preloaded files land.
 *
 * Runs after strip-emergent, before prerender-og (which propagates the
 * base head to every route). Graceful: if the fetch fails (offline build
 * env), the async links are left untouched and the build proceeds.
 */
const fs = require("fs");
const path = require("path");

const INDEX = path.join(__dirname, "..", "build", "index.html");
const UA =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const LINK_RE =
    /<link\s+rel="preload"\s+as="style"\s+href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"\s+onload=(?:"[^"]*"|'[^']*')\s*\/?>/g;
const NOSCRIPT_RE =
    /<noscript>(?:\s*<link[^>]*fonts\.googleapis\.com\/css2[^>]*>)+\s*<\/noscript>/;

(async () => {
    let html = fs.readFileSync(INDEX, "utf8");
    const urls = [...html.matchAll(LINK_RE)].map((m) =>
        m[1].replace(/&amp;/g, "&")
    );
    if (urls.length === 0) {
        console.log(
            "[inline-gf] No async Google Fonts links found (already inlined?) — skipping"
        );
        return;
    }
    try {
        const sheets = await Promise.all(
            urls.map((u) =>
                fetch(u, { headers: { "user-agent": UA } }).then((r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status} for ${u}`);
                    return r.text();
                })
            )
        );
        const css = sheets.join("\n");
        if (!css.includes("@font-face") || !css.includes("woff2")) {
            throw new Error("css2 response did not contain woff2 @font-face rules");
        }
        // Lexend Deca is only the FALLBACK for Scandia (the wordmark).
        // With display:swap the browser downloads its 40 KB just to paint
        // text it replaces moments later — bandwidth that competes with the
        // Cormorant file LCP actually waits on. `optional` = use it if
        // instantly available (cache), otherwise skip straight to Helvetica.
        const tuned = css
            .split("@font-face")
            .map((block) =>
                block.includes("Lexend Deca")
                    ? block.replace(/font-display:\s*swap/g, "font-display: optional")
                    : block
            )
            .join("@font-face");
        let first = true;
        html = html.replace(LINK_RE, () => {
            const out = first ? `<style>${tuned}</style>` : "";
            first = false;
            return out;
        });
        html = html.replace(NOSCRIPT_RE, "");
        fs.writeFileSync(INDEX, html, "utf8");
        console.log(
            `[inline-gf] Inlined ${urls.length} Google Fonts stylesheets (${css.length} bytes of @font-face) — fonts now apply as soon as the preloaded woff2 files land`
        );
    } catch (e) {
        console.warn(
            `[inline-gf] WARNING: could not fetch Google Fonts CSS (${e.message}) — keeping async stylesheet links as fallback`
        );
    }
})();
