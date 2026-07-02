import { useState } from "react";
import { Linkedin, Link2, Mail, Check } from "lucide-react";

/**
 * Editorial share row. Restrained, black-and-cream, no colored social pills.
 * Used at the top and bottom of long-form pieces.
 */
export default function ShareRow({
    title,
    url,
    variant = "cream",
    testidPrefix = "share",
    className = ""
}) {
    const [copied, setCopied] = useState(false);

    const shareUrl =
        url ||
        (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title || "");

    const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const email = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard denied — silent fail is fine */
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
