import { Link } from "react-router-dom";

export default function Connect() {
    return (
        <main data-testid="connect-page" className="on-navy bg-navy text-cream min-h-screen flex flex-col">
            {/* Spacer for fixed nav */}
            <div className="h-28 md:h-32" />

            <section className="flex-1 flex items-center">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-8">
                        <div className="lg:col-span-12">
                            <div className="eyebrow text-cream/60 mb-8 reveal">
                                Connect
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <h1
                                className="serif italic font-normal text-4xl md:text-6xl lg:text-[5rem] leading-[1.05] text-cream reveal reveal-delay-1"
                                style={{ letterSpacing: "-0.005em" }}
                                data-testid="connect-headline"
                            >
                                If the fit is right,
                                <br />
                                we're worth
                                <br />
                                a conversation.
                            </h1>
                        </div>

                        <div className="lg:col-span-4 lg:pl-6 prose-method">
                            <p>
                                Method takes on a small number of engagements.
                                We're selective, not because we're precious
                                about it, but because the work requires genuine
                                depth and that depth requires real attention.
                                Every client gets Gary directly.
                            </p>
                            <p className="!mb-0">
                                If you're a B2B firm that has outgrown your
                                current market presence, or a growth-stage
                                company that needs serious marketing leadership
                                before a raise or a commercial push, reach out.
                                The conversation starts with understanding your
                                situation, not pitching ours.
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 md:mt-32 pt-12 border-t border-cream/20 grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end">
                        <div className="lg:col-span-8">
                            <div className="eyebrow text-cream/55 mb-6">
                                Start a conversation
                            </div>
                            <a
                                href="mailto:connect@methodmarketinggroup.com?subject=Method%20—%20Introduction"
                                data-testid="connect-email-primary"
                                className="wordmark block text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5.25rem] leading-none tracking-tight text-cream break-all hover:text-cream/85 transition-colors duration-300"
                            >
                                connect@
                                <br className="lg:hidden" />
                                methodmarketinggroup.com
                            </a>
                            <p className="serif italic text-2xl md:text-3xl text-cream/80 mt-10">
                                We'll take it from there.
                            </p>
                        </div>
                        <div className="lg:col-span-4 lg:pl-6">
                            <div className="eyebrow text-cream/55 mb-4">
                                Elsewhere
                            </div>
                            <ul className="space-y-4 text-lg">
                                <li>
                                    <Link
                                        to="/work"
                                        data-testid="connect-link-work"
                                        className="ed-link"
                                    >
                                        See the Work →
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        data-testid="connect-link-about"
                                        className="ed-link"
                                    >
                                        About Method →
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/writing"
                                        data-testid="connect-link-writing"
                                        className="ed-link"
                                    >
                                        Read the Writing →
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
