import { useEffect, useState } from "react";
import { getEffectiveState, writeConsent } from "./consentStore";

/**
 * Preferences modal. Opened from the banner OR from the persistent
 * footer link. Renders a Necessary section (always on, no toggle) and
 * two independent toggles for GA and Clarity.
 *
 * Copy is verbatim from the client-approved build prompt.
 *
 * Save persists whatever is currently in local state. Reject all /
 * Accept all are shortcuts that skip the toggle interaction.
 */
export default function ConsentModal({ onClose }) {
    // Seed from stored state; toggles start at whatever the user last
    // chose (or off if this is their first visit).
    const initial = getEffectiveState();
    const [ga, setGa] = useState(initial.ga);
    const [clarity, setClarity] = useState(initial.clarity);

    // ESC closes. Body scroll lock while open.
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const save = () => {
        writeConsent({ ga, clarity });
        onClose();
    };
    const acceptAll = () => {
        writeConsent({ ga: true, clarity: true });
        onClose();
    };
    const rejectAll = () => {
        writeConsent({ ga: false, clarity: false });
        onClose();
    };

    return (
        <div
            data-testid="consent-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-modal-heading"
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-navy/70 backdrop-blur-sm"
            style={{ animation: "consent-fade-in 220ms ease-out both" }}
            onClick={(e) => {
                // Click on the dim backdrop closes (but not on the
                // modal content).
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                data-testid="consent-modal"
                className="w-full md:max-w-2xl bg-cream text-navy m-0 md:m-8 md:rounded-none border border-navy/10 max-h-[90vh] overflow-y-auto"
            >
                <div className="px-6 md:px-12 py-8 md:py-12">
                    <div className="eyebrow text-navy/60 mb-4">
                        Cookie choice
                    </div>
                    <h2
                        id="consent-modal-heading"
                        className="wordmark text-3xl md:text-4xl leading-tight tracking-tight text-navy mb-6"
                    >
                        Cookie preferences
                    </h2>
                    <p
                        data-testid="consent-modal-intro"
                        className="text-base leading-relaxed max-w-2xl"
                    >
                        We keep this short. One cookie is necessary. It
                        remembers the choice you&apos;re about to make.
                        Everything else is optional, and it stays off
                        until you turn it on.
                    </p>

                    <div className="mt-10 space-y-8">
                        <Row
                            testid="consent-row-necessary"
                            label="Strictly necessary"
                            body="Remembers your cookie choice so we don't have to ask twice. Lives in your browser, identifies no one, goes no further than this site."
                            alwaysOn
                        />
                        <Row
                            testid="consent-row-ga"
                            label="Google Analytics"
                            body="The counting kind. Which pages get read, how visitors arrive, how many. Aggregate numbers, no individual profiles. Cookies: _ga, _ga_G-7F2PPZPXSK."
                            checked={ga}
                            onChange={setGa}
                            controlTestid="consent-toggle-ga"
                        />
                        <Row
                            testid="consent-row-clarity"
                            label="Microsoft Clarity"
                            body="The watching kind. Anonymized session recordings and heatmaps that show where the site works and where it snags. More intimate than counting, so we ask for it separately. Cookies: _clck, _clsk, and MUID on bing.com."
                            checked={clarity}
                            onChange={setClarity}
                            controlTestid="consent-toggle-clarity"
                        />
                    </div>

                    <div className="mt-12 pt-6 border-t border-navy/15 flex flex-wrap items-center gap-x-8 gap-y-3">
                        <button
                            type="button"
                            onClick={rejectAll}
                            data-testid="consent-modal-reject-all"
                            className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                        >
                            Reject all
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            data-testid="consent-modal-save"
                            className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                        >
                            Save preferences
                        </button>
                        <button
                            type="button"
                            onClick={acceptAll}
                            data-testid="consent-modal-accept-all"
                            className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy"
                        >
                            Accept all
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            data-testid="consent-modal-close"
                            aria-label="Close preferences"
                            className="ml-auto text-navy/50 hover:text-navy transition-colors text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ testid, label, body, checked, onChange, alwaysOn, controlTestid }) {
    return (
        <div
            data-testid={testid}
            className="flex items-start gap-6 md:gap-10"
        >
            <div className="flex-1">
                <div className="serif italic text-xl md:text-2xl text-navy leading-snug">
                    {label}
                </div>
                <p className="mt-2 text-[0.95rem] md:text-base leading-relaxed text-navy/85">
                    {body}
                </p>
            </div>
            <div className="pt-1.5 shrink-0">
                {alwaysOn ? (
                    <span
                        data-testid={testid + "-always-on"}
                        className="eyebrow text-navy/50"
                    >
                        Always on
                    </span>
                ) : (
                    <Toggle
                        checked={checked}
                        onChange={onChange}
                        testid={controlTestid}
                        label={label}
                    />
                )}
            </div>
        </div>
    );
}

function Toggle({ checked, onChange, testid, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            data-testid={testid}
            data-state={checked ? "on" : "off"}
            onClick={() => onChange(!checked)}
            className={
                "relative w-12 h-6 rounded-full transition-colors duration-200 " +
                (checked ? "bg-navy" : "bg-navy/25")
            }
        >
            <span
                className={
                    "absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform duration-200 " +
                    (checked ? "translate-x-6" : "translate-x-0.5")
                }
                aria-hidden="true"
            />
        </button>
    );
}
