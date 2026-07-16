import { useEffect, useState } from "react";
import ConsentBanner from "./ConsentBanner";
import ConsentModal from "./ConsentModal";
import { hasDecision, subscribe } from "./consentStore";

/**
 * Sitewide consent host. Renders the banner (until the user makes a
 * choice) and the preferences modal (when opened by the banner OR by
 * the persistent footer link).
 *
 * Exposes a global function `window.openConsentPreferences()` so any
 * component can open the modal without prop drilling. Footer uses
 * this. Also handles cross-tab sync via a storage listener: if the
 * user accepts in tab A, tab B's banner disappears same paint.
 *
 * Toast on grant: after a first-visit accept, a small "Noted." toast
 * fades in and out. Only fires when the user actively accepts anything
 * from the banner or modal (not on a preference save that keeps
 * everything off).
 *
 * SSR-safe: nothing renders until after mount, so the prerendered HTML
 * contains no banner or modal element (preserving the "reads without
 * JavaScript" property for crawlers).
 */
export default function ConsentProvider() {
    const [mounted, setMounted] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Client-only hydration + initial state read.
    useEffect(() => {
        setMounted(true);
        setShowBanner(!hasDecision());
    }, []);

    // Cross-tab + same-tab sync: hide the banner on any decision, and
    // fire the toast only when the user has ACTIVELY granted (not on
    // a no-op save or a reject-all).
    useEffect(() => {
        if (!mounted) return;
        const unsub = subscribe(({ event }) => {
            setShowBanner(!hasDecision());
            if (event === "grant") {
                setToast("Noted.");
                setTimeout(() => setToast(null), 2400);
            }
        });
        return unsub;
    }, [mounted]);

    // Global open handler for the footer link.
    useEffect(() => {
        if (!mounted) return;
        window.openConsentPreferences = () => setModalOpen(true);
        return () => {
            try {
                delete window.openConsentPreferences;
            } catch (e) {
                window.openConsentPreferences = undefined;
            }
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <>
            {showBanner && (
                <ConsentBanner
                    onOpenPreferences={() => setModalOpen(true)}
                />
            )}
            {modalOpen && (
                <ConsentModal onClose={() => setModalOpen(false)} />
            )}
            {toast && (
                <div
                    data-testid="consent-toast"
                    className="fixed bottom-6 right-6 z-[80] bg-cream text-navy border border-navy/20 px-5 py-3 text-[0.78rem] tracking-[0.22em] uppercase font-medium shadow-[0_4px_16px_rgba(19,36,61,0.18)]"
                    style={{
                        animation: "consent-fade-in 220ms ease-out both",
                    }}
                    role="status"
                    aria-live="polite"
                >
                    {toast}
                </div>
            )}
        </>
    );
}
