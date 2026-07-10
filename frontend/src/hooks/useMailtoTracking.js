import { useEffect } from "react";

/**
 * Fires a GA4 `email_click` event on every mailto: click, sitewide.
 *
 * One delegated capture-phase listener on `document` — catches the Connect
 * CTA, footer email, Discernment closing line, privacy-policy links, the
 * ShareRow "share via email" action, and any mailto link added in the
 * future, with zero per-component wiring.
 *
 * Params carry page context so inquiries attribute to the page/article
 * that preceded the click. `link_url` distinguishes contact clicks
 * (mailto:connect@…) from article shares (ShareRow's bare `mailto:?…`).
 *
 * Registered as a key event (conversion) in the GA4 UI — see
 * SEO_PLAYBOOK.md §9.7. Known limitation: measures intent (the click),
 * not whether an email was actually sent.
 *
 * SSR-safe: useEffect never runs under react-dom/server.
 */
export function useMailtoTracking() {
    useEffect(() => {
        const onClick = (e) => {
            const link =
                e.target.closest && e.target.closest('a[href^="mailto:"]');
            if (!link) return;
            if (typeof window.gtag !== "function") return;
            window.gtag("event", "email_click", {
                link_url: link.getAttribute("href").split("?")[0],
                link_text: (link.textContent || "").trim().slice(0, 100),
                page_path: window.location.pathname,
                page_title: document.title,
            });
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);
}
