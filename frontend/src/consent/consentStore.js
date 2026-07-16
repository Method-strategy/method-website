/**
 * consentStore.js
 *
 * Client-side consent state for the sitewide GDPR banner. Owns the
 * single source of truth (localStorage key `method_consent_v1`) and
 * exposes the API the React banner + modal + hooks all read from.
 *
 * State shape:
 *   { v: 1, ga: boolean, clarity: boolean, ts: number, origin: string }
 *
 * Storage rules
 * -------------
 * - localStorage, not a cookie. Not sent on every request, no bytes on
 *   the wire, no third-party read possible. Storing consent is itself
 *   covered by ePrivacy 5(3) but explicitly allowed as strictly
 *   necessary (recital 66).
 * - Freshness: any decision older than 12 months is treated as no
 *   decision and the banner re-shows. Regulators lean toward
 *   time-bound consent.
 * - Version guard: if the schema changes we bump v; older records get
 *   treated as no decision so we re-prompt.
 *
 * Two independent providers
 * -------------------------
 * `ga` and `clarity` are toggled separately. Accepting one does not
 * accept the other. Withdrawal is per-provider.
 *
 * Load-block architecture
 * -----------------------
 * The inline snippet in public/index.html runs BEFORE React and reads
 * localStorage directly. If the user previously consented, it injects
 * the loaders. This file (consentStore.js) is the React-side mirror
 * that runs after hydration and drives the banner UI + hook gating.
 * They read the same key. See SEO_PLAYBOOK.md section 14.
 *
 * SSR-safe: every function guards `typeof window`.
 */

export const CONSENT_KEY = "method_consent_v1";
export const CONSENT_VERSION = 1;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

// Defensive default. Nothing on until explicitly accepted.
export const DEFAULT_STATE = { ga: false, clarity: false };

function safeParse(raw) {
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

/**
 * Read the stored decision. Returns null if the user hasn't decided
 * yet, if the stored record is stale, or if it's from an older schema
 * version. Callers can treat null as "show the banner".
 */
export function readConsent() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = safeParse(raw);
    if (!parsed) return null;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (!parsed.ts || Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return parsed;
}

/**
 * Current effective per-provider state. Falls back to
 * DEFAULT_STATE (all off) when no decision exists. Hooks use this to
 * gate firing.
 */
export function getEffectiveState() {
    const stored = readConsent();
    if (!stored) return { ...DEFAULT_STATE };
    return { ga: stored.ga === true, clarity: stored.clarity === true };
}

/** Has the user actively made a choice (vs first visit or expired)? */
export function hasDecision() {
    return readConsent() !== null;
}

/**
 * Persist a decision. Writes localStorage AND asks the load-block
 * snippet in index.html to inject any newly-granted loader. On
 * withdrawal, clears first-party cookies for that provider and
 * reloads the page (the only way to actually stop a running
 * gtag.js / clarity.js).
 */
export function writeConsent(next) {
    if (typeof window === "undefined") return;
    const prior = readConsent() || { ...DEFAULT_STATE };
    const merged = {
        ga: next.ga === true,
        clarity: next.clarity === true,
    };
    const record = {
        v: CONSENT_VERSION,
        ga: merged.ga,
        clarity: merged.clarity,
        ts: Date.now(),
        origin: window.location.hostname,
    };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));

    // Notify listeners in the same tab (the `storage` event only fires
    // in OTHER tabs). The event detail carries prior + next so
    // subscribers can tell an actual grant from a no-op save.
    try {
        window.dispatchEvent(
            new CustomEvent("methodconsentchange", {
                detail: { prior, next: record },
            })
        );
    } catch (e) {
        /* CustomEvent unsupported (ancient browsers) — banner UX
           degrades gracefully to the next storage-event sync. */
    }

    const loaded = window.__methodConsent && window.__methodConsent.load;
    const gaGranted = merged.ga && !prior.ga;
    const gaWithdrawn = !merged.ga && prior.ga;
    const clarityGranted = merged.clarity && !prior.clarity;
    const clarityWithdrawn = !merged.clarity && prior.clarity;

    // Grants: inject the loader inline. No reload.
    if (loaded) {
        if (gaGranted) loaded.ga();
        if (clarityGranted) loaded.clarity();
    }

    // For GA, fire an entry page_view manually so we don't lose the
    // page the user consented on. The stub is now in place and gtag.js
    // will flush this call once it loads. Subsequent route changes are
    // handled by useGAPageView.
    if (gaGranted && typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
            page_location: window.location.href,
            page_path: window.location.pathname + window.location.search,
            page_title: document.title,
        });
    }

    // Withdrawals: clear first-party cookies we control, then reload.
    // Running gtag.js / clarity.js cannot be uninstalled at runtime;
    // reload is the only way to actually stop them. Standard CMP
    // behavior. Grants don't reload.
    if (gaWithdrawn) clearFirstPartyCookies(GA_COOKIE_PREFIXES);
    if (clarityWithdrawn) clearFirstPartyCookies(CLARITY_COOKIE_PREFIXES);
    if (gaWithdrawn || clarityWithdrawn) {
        window.location.reload();
    }
}

// First-party cookies each provider drops on our domain. Third-party
// (MUID on .bing.com, etc.) can't be cleared by us and expire on their
// own schedule. Called out in the privacy policy.
//
// GA cookies are cleared by PREFIX (`_ga`, `_gid`, `_gat`) so we catch
// both the base `_ga` cookie and the measurement-ID-suffixed variant
// (`_ga_7F2PPZPXSK` today, whatever the ID becomes tomorrow). This is
// safer than an exact-name list; the earlier exact-name list had a
// subtle bug (Measurement ID `G-7F2PPZPXSK` is called `G-...` in GA4
// but gtag writes the cookie as `_ga_7F2PPZPXSK` without the `G-`).
const GA_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];
const CLARITY_COOKIE_PREFIXES = ["_clck", "_clsk", "_cltk"];

function findCookiesByPrefix(prefixes) {
    if (typeof document === "undefined") return [];
    return document.cookie
        .split(";")
        .map((c) => c.split("=")[0].trim())
        .filter((n) => n && prefixes.some((p) => n === p || n.startsWith(p + "_")));
}

function clearFirstPartyCookies(prefixes) {
    if (typeof document === "undefined") return;
    const names = findCookiesByPrefix(prefixes);
    const host = window.location.hostname;
    // Clear both bare-host and dotted-domain variants because gtag
    // sets one or the other depending on setup, and the browser
    // treats them as different cookies.
    const domains = ["", host, "." + host];
    // If host is www.method... also try the apex, in case a cookie
    // was set at the eTLD+1 level.
    if (host.split(".").length > 2) {
        const apex = host.split(".").slice(1).join(".");
        domains.push(apex, "." + apex);
    }
    names.forEach((name) => {
        domains.forEach((domain) => {
            document.cookie =
                name +
                "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
                (domain ? "; domain=" + domain : "");
        });
    });
}

/**
 * Subscribe to consent changes from BOTH the current tab (via a
 * `methodconsentchange` custom event dispatched by writeConsent) AND
 * other tabs (via the native `storage` event). The callback receives
 * an object `{ state, event }` where state is the newly-effective
 * state and event is either "grant", "withdraw", "noop", or "extern"
 * (external tab). Returns an unsubscribe.
 */
export function subscribe(cb) {
    if (typeof window === "undefined") return () => {};
    const onStorage = (e) => {
        if (e.key !== CONSENT_KEY) return;
        cb({ state: readConsent(), event: "extern" });
    };
    const onCustom = (e) => {
        const detail = (e && e.detail) || {};
        const prior = detail.prior || { ga: false, clarity: false };
        const next = detail.next || { ga: false, clarity: false };
        const gained =
            (next.ga && !prior.ga) || (next.clarity && !prior.clarity);
        const lost =
            (prior.ga && !next.ga) || (prior.clarity && !next.clarity);
        let kind = "noop";
        if (gained && !lost) kind = "grant";
        else if (lost && !gained) kind = "withdraw";
        else if (gained && lost) kind = "grant"; // mixed treated as grant for toast
        cb({ state: next, event: kind });
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("methodconsentchange", onCustom);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("methodconsentchange", onCustom);
    };
}
