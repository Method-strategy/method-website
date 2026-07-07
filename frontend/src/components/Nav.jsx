import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const links = [
    { to: "/work", label: "Work" },
    { to: "/about", label: "About" },
    { to: "/writing", label: "Writing" },
    { to: "/connect", label: "Connect" }
];

export default function Nav({ variant = "cream" }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();

    const handleWordmarkClick = (e) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const onNavy = variant === "navy";
    const bgClass = onNavy
        ? scrolled
            ? "bg-navy/95 backdrop-blur-sm border-b border-cream/10"
            : "bg-transparent"
        : scrolled
          ? "bg-cream/92 backdrop-blur-sm border-b border-navy/10"
          : "bg-transparent";
    const textClass = onNavy ? "text-cream" : "text-navy";

    return (
        <header
            data-testid="global-nav"
            className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${bgClass} ${textClass} ${
                onNavy ? "on-navy" : ""
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-20 md:h-24 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={handleWordmarkClick}
                    data-testid="nav-wordmark"
                    className="plain wordmark text-[1.65rem] md:text-[2rem] leading-none"
                    aria-label="Method — Home"
                >
                    Method
                </Link>

                <nav className="hidden md:flex items-center gap-10 lg:gap-14">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium ${
                                    isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    type="button"
                    data-testid="nav-mobile-toggle"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="md:hidden w-10 h-10 flex flex-col items-end justify-center gap-1.5"
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block h-px bg-current transition-all duration-300 ${
                            mobileOpen ? "w-6 translate-y-[3px] rotate-[8deg]" : "w-6"
                        }`}
                    />
                    <span
                        className={`block h-px bg-current transition-all duration-300 ${
                            mobileOpen ? "w-6 -translate-y-[3px] -rotate-[8deg]" : "w-4"
                        }`}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                    mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } ${onNavy ? "bg-navy" : "bg-cream"} border-t ${onNavy ? "border-cream/10" : "border-navy/10"}`}
                data-testid="nav-mobile-panel"
            >
                <nav className="px-6 py-6 flex flex-col gap-5">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            onClick={() => setMobileOpen(false)}
                            data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `text-2xl font-medium tracking-tight ${
                                    isActive ? "" : "opacity-70"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
