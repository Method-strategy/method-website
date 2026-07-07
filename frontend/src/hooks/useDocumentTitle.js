import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { writingBySlug } from "@/data/writing";
import { caseStudyBySlug } from "@/data/caseStudies";

const STATIC_TITLES = {
    "/": "Method — Clarifying how you show up in the market.",
    "/work": "Work — Method",
    "/about": "About — Method",
    "/about/discernment": "Discernment — Method",
    "/writing": "Writing — Method",
    "/connect": "Connect — Method",
};

function resolveTitle(pathname) {
    if (STATIC_TITLES[pathname]) return STATIC_TITLES[pathname];

    const workMatch = pathname.match(/^\/work\/([^/]+)\/?$/);
    if (workMatch) {
        const c = caseStudyBySlug(workMatch[1]);
        if (c) return `${c.title} — Method`;
    }

    const writingMatch = pathname.match(/^\/writing\/([^/]+)\/?$/);
    if (writingMatch) {
        const w = writingBySlug(writingMatch[1]);
        if (w) return `${w.title} — Method`;
    }

    return "Page not found — Method";
}

/**
 * Keeps the browser tab title in sync with the current route on
 * client-side navigation. The initial title (server-served HTML)
 * is already correct thanks to the per-route prerender step.
 */
export function useDocumentTitle() {
    const { pathname } = useLocation();
    useEffect(() => {
        const t = resolveTitle(pathname);
        if (document.title !== t) document.title = t;
    }, [pathname]);
}
