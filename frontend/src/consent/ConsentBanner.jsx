import { writeConsent } from "./consentStore";

/**
 * Bottom-band consent banner. Sitewide. Appears when the user hasn't
 * yet made a decision (or the prior decision has aged past 12 months).
 *
 * Copy is verbatim from the client-approved build prompt. Three
 * actions carry EQUAL visual weight (no dark pattern). Preferences
 * opens the modal; Accept and Decline write consent directly.
 *
 * Mount is handled by ConsentProvider. This component just renders
 * the UI and calls the store.
 */
export default function ConsentBanner({ onOpenPreferences }) {
    const accept = () => writeConsent({ ga: true, clarity: true });
    const decline = () => writeConsent({ ga: false, clarity: false });

    return (
        <div
            data-testid="consent-banner"
            role="region"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-[60] bg-cream border-t border-navy/15 shadow-[0_-4px_24px_rgba(19,36,61,0.06)]"
            style={{ animation: "consent-fade-in 260ms ease-out both" }}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-6 md:py-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
                <p
                    data-testid="consent-banner-copy"
                    className="text-navy text-[0.95rem] md:text-base leading-relaxed max-w-3xl"
                >
                    We take your privacy as seriously as we take our
                    work. To understand what lands with our audience
                    and what doesn&apos;t, we use Google Analytics and
                    Microsoft Clarity, but only if you say yes.
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:ml-auto md:flex-nowrap md:whitespace-nowrap">
                    <button
                        type="button"
                        onClick={decline}
                        data-testid="consent-banner-decline"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={onOpenPreferences}
                        data-testid="consent-banner-preferences"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                    >
                        Preferences
                    </button>
                    <button
                        type="button"
                        onClick={accept}
                        data-testid="consent-banner-accept"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
