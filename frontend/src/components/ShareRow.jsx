import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Linkedin, Link2, Mail, Check } from "lucide-react";

const SITE_ORIGIN = "https://methodmarketinggroup.com";

/**
 * Editorial share row. Restrained, black-and-cream, no colored social pills.
 * Used at the top and bottom of long-form pieces.
 *
 * `url` (optional) — a fully-qualified URL to share. If not passed, the
 * component builds one from the current route: window.location.origin
 * on the client, or the production origin on the server (SSG). This
 * ensures share links have real URLs even in the prerendered HTML —
 * critical for anyone who reads the page without executing JavaScript.
 */
export default function ShareRow({
    title,
    url,
    variant = "cream",
    testidPrefix = "share",
    className = ""
}) {
    const [copied, setCopied] = useState(false);
    const { pathname } = useLocation();

    const origin =
        typeof window !== "undefined" && window.location
            ? window.location.origin
            : SITE_ORIGIN;
    const shareUrl = url || `${origin}${pathname}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title || "");

    const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const email = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`;

    const copyLink = async () => {
        let ok = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl);
                ok = true;
            }
        } catch {
            /* fall through to execCommand */
        }
        if (!ok) {
            try {
                const ta = document.createElement("textarea");
                ta.value = shareUrl;
                ta.setAttribute("readonly", "");
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                ok = document.execCommand("copy");
                document.body.removeChild(ta);
            } catch {
                ok = false;
            }
        }
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        }
    };

    const base =
        "inline-flex items-center gap-2 nav-link text-[0.72rem] tracking-[0.22em] uppercase font-medium transition-colors duration-200";
    const tone =
        variant === "navy"
            ? "text-cream/75 hover:text-cream"
            : "text-navy/70 hover:text-navy";

    const divider =
        variant === "navy" ? "bg-cream/20" : "bg-navy/15";

    return (
        <div
            data-testid={`${testidPrefix}-row`}
            data-print-hide="true"
            className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}
        >
            <span
                className={`eyebrow ${
                    variant === "navy" ? "text-cream/55" : "text-navy/55"
                }`}
            >
                Share
            </span>
            <span className={`hidden md:block w-8 h-px ${divider}`} />

            <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`${testidPrefix}-linkedin`}
                aria-label="Share on LinkedIn"
                className={`${base} ${tone}`}
            >
                <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>LinkedIn</span>
            </a>

            <a
                href={xShare}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`${testidPrefix}-x`}
                aria-label="Share on X"
                className={`${base} ${tone}`}
            >
                <span aria-hidden="true" className="text-sm leading-none">𝕏</span>
                <span>X</span>
            </a>

            <a
                href={email}
                data-testid={`${testidPrefix}-email`}
                aria-label="Share via email"
                className={`${base} ${tone}`}
            >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Email</span>
            </a>

            <button
                type="button"
                onClick={copyLink}
                data-testid={`${testidPrefix}-copy`}
                aria-label="Copy link"
                className={`${base} ${tone}`}
            >
                {copied ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={1.75} />
                ) : (
                    <Link2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
                <span>{copied ? "Copied" : "Copy link"}</span>
            </button>
        </div>
    );
}
