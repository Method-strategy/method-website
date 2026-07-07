/* eslint-disable no-console */
/**
 * generate-rss.js
 *
 * Emits build/writing/rss.xml — a valid RSS 2.0 feed of every writing post,
 * in the release order defined by writing.js. Readers can subscribe in
 * Feedly / Reeder / NetNewsWire, and LinkedIn Newsletter can auto-import
 * from this feed so every post can seed a LinkedIn edition without a
 * republish. No date metadata on the posts themselves — pubDate is stamped
 * as the build date so aggregators keep entries in a stable order.
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

const SITE =
    process.env.SITE_URL ||
    "https://methodmarketinggroup.com";

const escapeXml = (s) =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

// Stable pub dates: spread the release-order posts across the build day
// so RSS readers don't collapse them all to the same second.
const buildDate = new Date();
function pubDateFor(index) {
    const d = new Date(buildDate);
    d.setUTCMinutes(d.getUTCMinutes() - index); // one minute apart, newest = index 0
    return d.toUTCString();
}

const items = writing
    .map((post, index) => {
        const link = `${SITE}/writing/${post.slug}`;
        // Preserve body paragraph structure inside CDATA HTML.
        const bodyHtml = post.body
            .map((b) => `<p>${escapeXml(b.text)}</p>`)
            .join("\n");
        const desc = escapeXml(post.dek);
        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDateFor(writing.length - 1 - index)}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <author>connect@methodmarketinggroup.com (Gary Hopkins)</author>
      <description>${desc}</description>
      <content:encoded><![CDATA[${bodyHtml}]]></content:encoded>
    </item>`;
    })
    .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Method — Writing</title>
    <link>${SITE}/writing</link>
    <atom:link href="${SITE}/writing/rss.xml" rel="self" type="application/rss+xml" />
    <description>Essays on marketing strategy, brand positioning, and the gap between what companies promise and what they actually deliver. By Gary Hopkins.</description>
    <language>en-us</language>
    <copyright>© Method Strategic Marketing. All rights reserved.</copyright>
    <managingEditor>connect@methodmarketinggroup.com (Gary Hopkins)</managingEditor>
    <webMaster>connect@methodmarketinggroup.com (Gary Hopkins)</webMaster>
    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>
    <generator>Method build pipeline</generator>
${items}
  </channel>
</rss>
`;

const outDir = path.join(BUILD_DIR, "writing");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "rss.xml");
fs.writeFileSync(outPath, xml, "utf8");

console.log(
    `[rss] Wrote build/writing/rss.xml (${writing.length} items)`
);
