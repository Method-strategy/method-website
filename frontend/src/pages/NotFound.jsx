import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RevealStagger, RevealItem } from "../components/Reveal";
import { isAnalyticsHost } from "@/hooks/analyticsHost";
import { getEffectiveState } from "@/consent/consentStore";

const destinations = [
    { label: "Work", to: "/work" },
    { label: "About", to: "/about" },
    { label: "Writing", to: "/writing" },
    { label: "Connect", to: "/connect" },
];

/**
 * Fire a dedicated GA4 `not_found` event whenever the 404 page renders,
 * alongside the standard `page_view` that useGAPageView already fires.
 * The event carries the URL that missed and the referring page so 404s
 * can be analysed as first-class data rather than reverse-derived by
 * filtering page_views on title. See SEO_PLAYBOOK.md §9.9.
 *
 * Consent-gated: only fires if the user has granted GA. On a pre-consent
 * 404 visit the event is simply not recorded; if the user then grants
 * consent, we skip retroactive firing (the next 404 they hit gets
 * tracked normally). Acceptable data loss.
 *
 * SSR-safe: the effect never runs under react-dom/server (prerender-ssg.js
 * renders this tree at build time — `window` and `gtag` do not exist there).
 */
function useNotFoundEvent() {
    useEffect(() => {
        if (!isAnalyticsHost()) return;
        if (!getEffectiveState().ga) return;
        if (typeof window.gtag !== "function") return;
        window.gtag("event", "not_found", {
            page_path: window.location.pathname + window.location.search,
            page_location: window.location.href,
            page_title: document.title,
            page_referrer: document.referrer || "(direct)",
        });
    }, []);
}

export default function NotFound() {
    useNotFoundEvent();
    return (
        <main data-testid="not-found-page" className="bg-cream text-navy">
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-0 pb-16 md:pb-0">
                    <RevealStagger hero className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 items-end" stagger={0.14}>
                        <RevealItem hero className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-8">404</div>
                            <h1 className="wordmark text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight">
                                This page
                                <br />
                                doesn't exist.
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    It may have once.
                                </span>
                            </h1>
                        </RevealItem>
                        <RevealItem hero className="lg:col-span-4 lg:pl-6">
                            <p className="emphasis-line">
                                Things have changed around here.
                            </p>
                            <ul className="mt-10 space-y-4">
                                {destinations.map((d) => (
                                    <li key={d.to}>
                                        <Link
                                            to={d.to}
                                            data-testid={`not-found-link-${d.label.toLowerCase()}`}
                                            className="nav-link inline-flex items-baseline gap-2 text-[0.82rem] tracking-[0.22em] uppercase font-medium text-navy"
                                        >
                                            <span>{d.label}</span>
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
