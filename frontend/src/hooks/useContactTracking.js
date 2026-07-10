import { useEffect } from "react";

/**
 * Fires GA4 contact-intent events on outbound clicks, sitewide:
 *
 *   - `email_click`    — any `mailto:` link (Connect CTA, footer email,
 *     Home CTA, Discernment closing line, privacy-policy links,
 *     ShareRow "share via email", future links)
 *   - `linkedin_click` — any linkedin.com link (footer + Connect
 *     "Connect on LinkedIn", Gary's profile on About, ShareRow's
 *     LinkedIn share, future links)
 *
 * One delegated capture-phase listener on `document` — zero
 * per-component wiring. Params carry page context so intent attributes
 * to the page/article that preceded the click. `link_url` distinguishes
 * contact clicks from ShareRow shares.
 *
 * Both are registered as key events (conversions) in the GA4 UI — see
 * SEO_PLAYBOOK.md §9.7. Known limitation: clicks measure intent, not
 * that an email was sent or a LinkedIn action completed.
 *
 * SSR-safe: useEffect never runs under react-dom/server.
 */
export function useContactTracking() {
    useEffect(() => {
        const onClick = (e) => {
            const link = e.target.closest && e.target.closest("a[href]");
            if (!link || typeof window.gtag !== "function") return;
            const href = link.getAttribute("href") || "";
            let eventName = null;
            if (href.startsWith("mailto:")) eventName = "email_click";
            else if (/^https?:\/\/(www\.)?linkedin\.com\//i.test(href))
                eventName = "linkedin_click";
            if (!eventName) return;
            window.gtag("event", eventName, {
                link_url: href.split("?")[0],
                link_text: (link.textContent || "").trim().slice(0, 100),
                page_path: window.location.pathname,
                page_title: document.title,
            });
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);
}
