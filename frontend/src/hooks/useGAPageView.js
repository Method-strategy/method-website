import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fires a GA4 `page_view` on the initial load and on every subsequent
 * client-side route change.
 *
 * Why this exists
 * ---------------
 * The gtag snippet in public/index.html is configured with
 * `send_page_view: false`, disabling the default automatic page_view.
 * Without that override GA4 would count the initial navigation and MISS
 * every subsequent SPA route change (React Router's history changes never
 * trigger a document load).
 *
 * By owning page_view from React, we get:
 *   - one page_view per SPA route change (including the initial mount),
 *   - the correct title (updated first by useDocumentTitle),
 *   - the correct page_path / page_location for reporting.
 *
 * SSR-safe: guarded on `typeof window` because prerender-ssg.js renders
 * this tree with react-dom/server where `window` and `gtag` do not exist.
 */
export function useGAPageView() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.gtag !== "function")
            return;
        window.gtag("event", "page_view", {
            page_location: window.location.href,
            page_path: pathname + search,
            page_title: document.title,
        });
    }, [pathname, search]);
}
