/* eslint-disable no-console */
/**
 * generate-sitemap.js
 *
 * Post-build step: writes build/sitemap.xml and build/robots.txt.
 * The sitemap is derived from the same route manifest used by
 * prerender-og.js (static routes + writing posts + case studies) so any
 * new post in writing.js is auto-discovered by Google, Bing and LinkedIn's
 * own crawler on the next build. No CMS ping, no plugin required.
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

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

const SITE =
    process.env.SITE_URL ||
    "https://methodmarketinggroup.com";

const today = new Date().toISOString().split("T")[0];

const staticRoutes = [
    { path: "/", changefreq: "monthly", priority: "1.0" },
    { path: "/work", changefreq: "monthly", priority: "0.9" },
    { path: "/about", changefreq: "yearly", priority: "0.8" },
    { path: "/about/discernment", changefreq: "yearly", priority: "0.5" },
    { path: "/writing", changefreq: "weekly", priority: "0.9" },
    { path: "/connect", changefreq: "yearly", priority: "0.7" },
];

const workRoutes = caseStudies.map((c) => ({
    path: `/work/${c.slug}`,
    changefreq: "yearly",
    priority: "0.8",
    lastmod: today,
}));

const writingRoutes = writing.map((w) => ({
    path: `/writing/${w.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: today,
}));

const routes = [...staticRoutes, ...workRoutes, ...writingRoutes];

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((r) => {
        const loc = `${SITE}${r.path === "/" ? "" : r.path}`;
        return [
            "  <url>",
            `    <loc>${loc}</loc>`,
            `    <lastmod>${r.lastmod || today}</lastmod>`,
            `    <changefreq>${r.changefreq}</changefreq>`,
            `    <priority>${r.priority}</priority>`,
            "  </url>",
        ].join("\n");
    }),
    "</urlset>",
    "",
].join("\n");

fs.writeFileSync(path.join(BUILD_DIR, "sitemap.xml"), xml, "utf8");

const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
].join("\n");

fs.writeFileSync(path.join(BUILD_DIR, "robots.txt"), robots, "utf8");

console.log(
    `[sitemap] Wrote build/sitemap.xml (${routes.length} URLs) and build/robots.txt`
);
