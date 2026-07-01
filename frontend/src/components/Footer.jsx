import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            data-testid="global-footer"
            className="on-navy bg-navy text-cream"
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10 md:pb-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-16 gap-x-8 items-start">
                    {/* Column 1 — Wordmark + tagline (matches header wordmark size) */}
                    <div className="md:col-span-6 lg:col-span-6">
                        <Link
                            to="/"
                            data-testid="footer-wordmark"
                            className="plain wordmark block text-[1.65rem] md:text-[2rem] leading-none text-cream"
                        >
                            Method
                        </Link>
                        <p
                            className="serif italic text-lg md:text-xl mt-5 text-cream/90 max-w-md leading-snug"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            Clarifying how you show up in the market.
                        </p>
                        <p className="text-cream/55 text-sm mt-6 leading-relaxed">
                            Method Marketing Group
                            <br />
                            A strategic marketing practice · Est. 2020
                        </p>
                    </div>

                    {/* Column 2 — Site nav */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <div className="eyebrow text-cream/55 mb-4">Site</div>
                        <ul className="space-y-3 text-base">
                            <li>
                                <Link
                                    to="/"
                                    data-testid="footer-link-home"
                                    className="nav-link text-cream/90"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/work"
                                    data-testid="footer-link-work"
                                    className="nav-link text-cream/90"
                                >
                                    Work
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    data-testid="footer-link-about"
                                    className="nav-link text-cream/90"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/writing"
                                    data-testid="footer-link-writing"
                                    className="nav-link text-cream/90"
                                >
                                    Writing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/connect"
                                    data-testid="footer-link-connect"
                                    className="nav-link text-cream/90"
                                >
                                    Connect
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 — Contact */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <div className="eyebrow text-cream/55 mb-4">
                            Contact
                        </div>
                        <a
                            href="mailto:connect@methodmarketinggroup.com"
                            data-testid="footer-email-link"
                            className="ed-link text-base tracking-tight block break-words"
                        >
                            connect@methodmarketinggroup.com
                        </a>
                        <a
                            href="https://www.linkedin.com/company/method-strategic-marketing/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="footer-linkedin-link"
                            className="mt-5 inline-flex items-center gap-2 nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-cream/85 hover:text-cream"
                        >
                            <Linkedin
                                className="w-3.5 h-3.5"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                            <span>Connect on LinkedIn</span>
                        </a>
                    </div>
                </div>

                <div className="mt-16 md:mt-20 pt-6 border-t border-cream/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs tracking-widest uppercase text-cream/55">
                    <span>© {year} Method Marketing Group</span>
                    <span className="serif italic normal-case tracking-normal text-cream/70 text-sm">
                        There is a method to this.
                    </span>
                </div>
            </div>
        </footer>
    );
}
