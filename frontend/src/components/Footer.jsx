import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            data-testid="global-footer"
            className="on-navy bg-navy text-cream"
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-40 pb-12 md:pb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8">
                    {/* Wordmark + tagline */}
                    <div className="md:col-span-6 lg:col-span-7">
                        <Link
                            to="/"
                            data-testid="footer-wordmark"
                            className="plain wordmark block text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] leading-[0.85] text-cream"
                        >
                            Method
                        </Link>
                        <p
                            className="serif italic text-2xl md:text-3xl lg:text-4xl mt-6 md:mt-8 text-cream/95 max-w-xl leading-snug"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            Clarifying how you show up in the market.
                        </p>
                    </div>

                    {/* Contact + Nav */}
                    <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-8">
                        <div>
                            <div className="eyebrow text-cream/60 mb-4">
                                Contact
                            </div>
                            <a
                                href="mailto:connect@methodmarketinggroup.com"
                                data-testid="footer-email-link"
                                className="ed-link text-base md:text-lg tracking-tight"
                            >
                                connect@methodmarketinggroup.com
                            </a>
                            <p className="text-cream/70 text-sm mt-6 leading-relaxed">
                                Method Marketing Group
                                <br />
                                A strategic marketing practice
                            </p>
                        </div>
                        <div>
                            <div className="eyebrow text-cream/60 mb-4">
                                Site
                            </div>
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
                    </div>
                </div>

                <div className="mt-20 md:mt-28 pt-6 border-t border-cream/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs tracking-widest uppercase text-cream/55">
                    <span>© {year} Method Marketing Group</span>
                    <span className="serif italic normal-case tracking-normal text-cream/70 text-sm">
                        There is a method to this.
                    </span>
                </div>
            </div>
        </footer>
    );
}
