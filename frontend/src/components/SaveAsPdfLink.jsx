import { useState } from "react";
import { Printer } from "lucide-react";

/**
 * Quiet trigger to save the current article/case study as a PDF.
 * Uses window.print() — modern browsers offer "Save as PDF" natively.
 * The print stylesheet in index.css handles all layout.
 */
export default function SaveAsPdfLink({
    variant = "cream",
    label = "Save as PDF",
    testid = "save-as-pdf",
    className = ""
}) {
    const [printing, setPrinting] = useState(false);

    const onClick = () => {
        setPrinting(true);
        // Let React render / any late fonts settle before print dialog
        setTimeout(() => {
            window.print();
            setPrinting(false);
        }, 80);
    };

    const colorClass =
        variant === "navy" ? "text-cream/80 hover:text-cream" : "text-navy/70 hover:text-navy";

    return (
        <button
            type="button"
            onClick={onClick}
            data-testid={testid}
            data-print-hide="true"
            aria-label="Save this article as PDF"
            className={`inline-flex items-center gap-2 nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium transition-colors duration-200 ${colorClass} ${className}`}
        >
            <Printer className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span>{printing ? "Opening…" : label}</span>
        </button>
    );
}
