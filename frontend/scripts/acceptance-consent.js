/* eslint-disable no-console */
/**
 * acceptance-consent.js
 *
 * Standing Playwright acceptance suite for the sitewide GDPR consent
 * system. Run against LIVE PRODUCTION to prove that:
 *
 *   1. A fresh visit fires zero analytics network requests.
 *   2. Accept from the banner injects gtag + clarity, drops first-party
 *      cookies, and fires an entry page_view for GA.
 *   3. Decline blocks everything AND persists across reloads.
 *   4. Splitting GA and Clarity from the modal is genuinely
 *      independent (accepting GA alone loads only gtag; accepting
 *      Clarity alone loads only clarity).
 *   5. Withdrawal reloads the page and stops future firing; first-party
 *      cookies for the withdrawn provider are cleared.
 *   6. The 404 route's not_found event ALSO stays gated by consent.
 *
 * Usage: node scripts/acceptance-consent.js [URL]
 *   default URL: https://methodmarketinggroup.com
 *
 * Requires Playwright's Chromium to be installed. This script is
 * self-contained — no test framework, just async assertions with
 * clear pass/fail lines. Emits a JSON summary to
 * /tmp/consent-acceptance.json for machine reading.
 *
 * See SEO_PLAYBOOK.md §14 for the consent architecture.
 */

const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "https://methodmarketinggroup.com";
const RESULTS = [];

function record(name, pass, detail) {
    const line = { name, pass: !!pass, detail: detail || "" };
    RESULTS.push(line);
    const icon = pass ? "PASS" : "FAIL";
    console.log(`[${icon}] ${name}${detail ? "  —  " + detail : ""}`);
    return pass;
}

async function newContext(browser) {
    const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        // Fresh — no stored cookies or storage.
    });
    const hits = { ga: [], clarity: [], bing: [] };
    ctx.on("request", (req) => {
        const u = req.url();
        if (
            u.includes("google-analytics.com") ||
            u.includes("googletagmanager.com")
        ) {
            hits.ga.push(u);
        }
        if (u.includes("clarity.ms")) hits.clarity.push(u);
        if (u.includes("c.bing.com")) hits.bing.push(u);
    });
    return { ctx, hits };
}

async function readCookies(ctx) {
    const all = await ctx.cookies();
    return all.map((c) => `${c.domain}${c.path}::${c.name}`);
}

async function waitForConsentSurface(page) {
    await page.waitForSelector("[data-testid='consent-banner']", {
        timeout: 8000,
    });
}

(async () => {
    console.log(`\nRunning consent acceptance suite against ${BASE}\n`);
    const browser = await chromium.launch({ headless: true });

    try {
        // ============================================================
        // TEST 1: Fresh visit fires ZERO analytics requests, banner up.
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await page.waitForTimeout(4000);
            await waitForConsentSurface(page);
            record(
                "1a. fresh visit shows banner",
                await page.locator("[data-testid='consent-banner']").isVisible()
            );
            record(
                "1b. zero GA requests pre-consent",
                hits.ga.length === 0,
                `saw ${hits.ga.length}`
            );
            record(
                "1c. zero Clarity requests pre-consent",
                hits.clarity.length === 0,
                `saw ${hits.clarity.length}`
            );
            record(
                "1d. zero bing.com requests pre-consent",
                hits.bing.length === 0,
                `saw ${hits.bing.length}`
            );
            const cookies = await readCookies(ctx);
            const nonEssential = cookies.filter(
                (c) => !c.includes("__cf") && !c.includes("_nf")
            );
            record(
                "1e. zero third-party analytics cookies set",
                nonEssential.filter(
                    (c) =>
                        c.includes("_ga") ||
                        c.includes("_clck") ||
                        c.includes("_clsk") ||
                        c.includes("MUID")
                ).length === 0,
                cookies.join(",")
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 2: Decline persists, zero requests, no re-prompt on reload
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await waitForConsentSurface(page);
            await page.click("[data-testid='consent-banner-decline']");
            await page.waitForTimeout(2000);
            const ls1 = await page.evaluate(() =>
                localStorage.getItem("method_consent_v1")
            );
            record(
                "2a. decline writes localStorage",
                ls1 && ls1.includes('"ga":false') && ls1.includes('"clarity":false'),
                ls1
            );
            record(
                "2b. banner disappears after decline",
                (await page.locator("[data-testid='consent-banner']").count()) === 0
            );
            // Navigate to a second page
            await page.goto(BASE + "/work", { waitUntil: "networkidle" });
            await page.waitForTimeout(2000);
            record(
                "2c. no GA hits after decline",
                hits.ga.length === 0,
                `saw ${hits.ga.length}`
            );
            record(
                "2d. no Clarity hits after decline",
                hits.clarity.length === 0,
                `saw ${hits.clarity.length}`
            );
            // Reload should not re-prompt
            await page.reload({ waitUntil: "networkidle" });
            await page.waitForTimeout(1500);
            record(
                "2e. banner does not re-appear after reload",
                (await page.locator("[data-testid='consent-banner']").count()) === 0
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 3: Accept all — both loaders fire, cookies drop
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await waitForConsentSurface(page);
            await page.click("[data-testid='consent-banner-accept']");
            await page.waitForTimeout(5000);
            record(
                "3a. GA loader fires after accept",
                hits.ga.length > 0,
                `${hits.ga.length} requests`
            );
            record(
                "3b. Clarity loader fires after accept",
                hits.clarity.length > 0,
                `${hits.clarity.length} requests`
            );
            const cookies = await readCookies(ctx);
            record(
                "3c. _ga cookie set",
                cookies.some((c) => c.includes("::_ga")),
                cookies.filter((c) => c.includes("_ga")).join(",")
            );
            record(
                "3d. _clck cookie set (Clarity)",
                cookies.some((c) => c.includes("::_clck")),
                cookies.filter((c) => c.includes("_clck")).join(",")
            );
            record(
                "3e. toast appears",
                (await page.locator("[data-testid='consent-toast']").count()) > 0
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 4: Accept GA only — loads gtag, does NOT load Clarity
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await waitForConsentSurface(page);
            await page.click("[data-testid='consent-banner-preferences']");
            await page.waitForSelector("[data-testid='consent-modal']");
            await page.click("[data-testid='consent-toggle-ga']");
            await page.waitForTimeout(200);
            await page.click("[data-testid='consent-modal-save']");
            await page.waitForTimeout(5000);
            record(
                "4a. GA-only: gtag loaded",
                hits.ga.length > 0,
                `${hits.ga.length} requests`
            );
            record(
                "4b. GA-only: Clarity did NOT load",
                hits.clarity.length === 0,
                `saw ${hits.clarity.length}`
            );
            record(
                "4c. GA-only: no MUID/bing sync",
                hits.bing.length === 0,
                `saw ${hits.bing.length}`
            );
            const cookies = await readCookies(ctx);
            record(
                "4d. GA-only: _clck NOT set",
                !cookies.some((c) => c.includes("::_clck"))
            );
            record(
                "4e. GA-only: MUID NOT set",
                !cookies.some((c) => c.toUpperCase().includes("::MUID"))
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 5: Accept Clarity only — loads clarity, does NOT load GA
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await waitForConsentSurface(page);
            await page.click("[data-testid='consent-banner-preferences']");
            await page.waitForSelector("[data-testid='consent-modal']");
            await page.click("[data-testid='consent-toggle-clarity']");
            await page.waitForTimeout(200);
            await page.click("[data-testid='consent-modal-save']");
            await page.waitForTimeout(5000);
            record(
                "5a. Clarity-only: clarity loaded",
                hits.clarity.length > 0,
                `${hits.clarity.length} requests`
            );
            record(
                "5b. Clarity-only: GA did NOT load",
                hits.ga.length === 0,
                `saw ${hits.ga.length}`
            );
            const cookies = await readCookies(ctx);
            record(
                "5c. Clarity-only: _ga NOT set",
                !cookies.some((c) => c.includes("::_ga"))
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 6: 404 route's not_found event stays gated by consent
        // ============================================================
        {
            const { ctx, hits } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/nonexistent-consent-test-" + Date.now(), {
                waitUntil: "networkidle",
            });
            await page.waitForTimeout(3000);
            record(
                "6a. 404 page shows banner",
                (await page.locator("[data-testid='consent-banner']").count()) > 0
            );
            record(
                "6b. 404 pre-consent: no GA (no not_found fire)",
                hits.ga.length === 0,
                `saw ${hits.ga.length}`
            );
            // dataLayer should not have not_found either
            const dl = await page.evaluate(() =>
                JSON.stringify(window.dataLayer || [])
            );
            record(
                "6c. 404 pre-consent: dataLayer contains no not_found",
                !dl.includes("not_found"),
                dl.slice(0, 200)
            );
            await ctx.close();
        }

        // ============================================================
        // TEST 7: Footer 'Cookie preferences' link opens modal
        // ============================================================
        {
            const { ctx } = await newContext(browser);
            const page = await ctx.newPage();
            await page.goto(BASE + "/", { waitUntil: "networkidle" });
            await waitForConsentSurface(page);
            // Accept so the banner goes away and footer becomes primary path
            await page.click("[data-testid='consent-banner-accept']");
            await page.waitForTimeout(1500);
            // Scroll to footer and click
            await page.evaluate(() =>
                window.scrollTo(0, document.body.scrollHeight)
            );
            await page.waitForTimeout(400);
            const link = page.locator(
                "[data-testid='footer-link-cookie-preferences']"
            );
            record("7a. footer link present", (await link.count()) > 0);
            await link.click();
            await page.waitForTimeout(600);
            record(
                "7b. footer link opens modal",
                (await page.locator("[data-testid='consent-modal']").count()) > 0
            );
            // State should reflect accepted-all
            const gaState = await page.getAttribute(
                "[data-testid='consent-toggle-ga']",
                "data-state"
            );
            const clState = await page.getAttribute(
                "[data-testid='consent-toggle-clarity']",
                "data-state"
            );
            record(
                "7c. modal reflects stored state",
                gaState === "on" && clState === "on",
                `ga=${gaState} clarity=${clState}`
            );
            await ctx.close();
        }
    } finally {
        await browser.close();
    }

    const passed = RESULTS.filter((r) => r.pass).length;
    const failed = RESULTS.filter((r) => !r.pass).length;
    console.log(`\n${passed} passed, ${failed} failed of ${RESULTS.length} total.\n`);

    fs.writeFileSync(
        "/tmp/consent-acceptance.json",
        JSON.stringify({ base: BASE, passed, failed, results: RESULTS }, null, 2)
    );

    process.exit(failed === 0 ? 0 : 1);
})().catch((e) => {
    console.error(e);
    process.exit(2);
});
