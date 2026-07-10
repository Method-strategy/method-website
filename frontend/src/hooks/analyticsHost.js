/**
 * Hostname guard shared by every analytics touchpoint (the head snippet
 * in public/index.html carries an inline copy of the same check).
 * GA4 / Clarity must only ever record the production hostnames —
 * previews, localhost, and deploy permalinks stay silent.
 * See SEO_PLAYBOOK.md §9.8.
 */
export const isAnalyticsHost = () =>
    typeof window !== "undefined" &&
    (window.location.hostname === "methodmarketinggroup.com" ||
        window.location.hostname === "www.methodmarketinggroup.com");
