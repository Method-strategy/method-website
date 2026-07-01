import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main data-testid="home-page">
            {/* HERO — Navy, business-card treatment: wordmark left, serif tagline right */}
            <section
                data-testid="home-hero"
                className="on-navy bg-navy text-cream relative overflow-hidden"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-48 lg:pt-56 pb-28 md:pb-40 lg:pb-52">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 lg:items-end">
                        <div className="lg:col-span-8 xl:col-span-8">
                            <div className="eyebrow text-cream/60 mb-8 reveal">
                                A strategic marketing practice · Est. 2020
                            </div>
                            <h1
                                data-testid="home-hero-wordmark"
                                className="wordmark text-[5.25rem] sm:text-[7.5rem] md:text-[10rem] lg:text-[11rem] xl:text-[14rem] text-cream reveal leading-[0.82]"
                                aria-label="Method"
                            >
                                Method
                            </h1>
                        </div>
                        <div className="lg:col-span-4 xl:col-span-4 lg:pl-4 lg:pb-6">
                            <p
                                className="serif italic text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.75rem] leading-[1.12] text-cream reveal reveal-delay-2"
                                style={{ letterSpacing: "-0.005em" }}
                            >
                                Clarifying
                                <br />
                                how you show up
                                <br />
                                in the market.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Opening statement — Cream */}
            <section
                data-testid="home-opening"
                className="bg-cream text-navy"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-40 lg:py-52">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-2 lg:col-start-1">
                            <div className="eyebrow text-navy/60">
                                On the record
                            </div>
                        </div>
                        <div className="lg:col-span-9 lg:col-start-4">
                            <p className="lede mb-10">
                                Most B2B firms are better than their market
                                presence suggests. We fix that.
                            </p>
                            <div className="prose-method max-w-3xl">
                                <p>
                                    Method is a strategic marketing practice.
                                    We work with a small number of B2B clients
                                    at significant depth, building market
                                    presence from the inside out. We start with
                                    what a business is trying to become and
                                    work outward from there. We don't lead with
                                    execution. We lead with thinking.
                                </p>
                                <p>
                                    The brand architecture, positioning,
                                    content strategy, channel direction, and
                                    execution that follows all flow from
                                    understanding the business first.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Model */}
            <section
                data-testid="home-the-model"
                className="bg-cream text-navy border-t border-navy/10"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <div className="lg:col-span-4">
                            <div className="eyebrow text-navy/60 mb-6">
                                The Model
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.5rem] leading-[0.95] tracking-tight">
                                A practice
                                <br />
                                built around
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    strategic depth
                                </span>
                                ,
                                <br />
                                not headcount.
                            </h2>
                        </div>
                        <div className="lg:col-span-7 lg:col-start-6 prose-method">
                            <p>
                                Method maintains a small roster of clients,
                                four or five at any given time, and works with
                                each at the level of a fractional CMO. That
                                means owning the strategic direction, not just
                                executing against it. The work is led by a
                                senior team and supported by an established
                                network of specialists: writers, designers,
                                developers, and researchers, brought in based
                                on what each engagement actually requires. You
                                get exactly what the work needs. Nothing more,
                                nothing else.
                            </p>
                            <p className="serif italic text-navy text-2xl md:text-3xl leading-snug !mb-0 pt-4">
                                Where execution is part of the scope, we
                                deliver it or direct it. Strategy doesn't stop
                                at a deck.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Work With */}
            <section
                data-testid="home-who"
                className="bg-cream text-navy border-t border-navy/10"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-8">
                        <div className="lg:col-span-5">
                            <div className="eyebrow text-navy/60 mb-6">
                                Who We Work With
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.25rem] leading-[0.98] tracking-tight">
                                B2B firms that
                                <br />
                                have outgrown a
                                <br />
                                conventional agency,
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    or aren't ready
                                </span>
                                <br />
                                for a full-time CMO.
                            </h2>
                        </div>
                        <div className="lg:col-span-6 lg:col-start-7 space-y-14">
                            <div>
                                <div className="chapter-num mb-4">
                                    Situation i.
                                </div>
                                <div className="prose-method">
                                    <p>
                                        An established firm that has grown
                                        past its market presence. The brand,
                                        the website, the messaging: it all
                                        reflects who they were, not who they
                                        are. The right buyers aren't seeing
                                        the right firm.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="chapter-num mb-4">
                                    Situation ii.
                                </div>
                                <div className="prose-method">
                                    <p>
                                        A growth-stage company that needs the
                                        CMO function built from the ground up,
                                        before a raise, before a commercial
                                        push, before the market forms its own
                                        impression.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-navy/15">
                                <p className="serif italic text-navy text-xl md:text-2xl leading-snug">
                                    In both cases, the problem isn't
                                    execution. It's clarity. That's where we
                                    start.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA band — Navy */}
            <section
                data-testid="home-cta"
                className="on-navy bg-navy text-cream"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-28 md:py-48">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end">
                        <div className="lg:col-span-8">
                            <p
                                className="serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-cream"
                                style={{ letterSpacing: "-0.005em" }}
                            >
                                If you're not showing up in the market the
                                way you know you could be,
                                <br />
                                <span className="text-cream/80">
                                    that's where we start.
                                </span>
                            </p>
                        </div>
                        <div className="lg:col-span-4 lg:pl-6">
                            <div className="eyebrow text-cream/60 mb-3">
                                Start a conversation
                            </div>
                            <a
                                href="mailto:connect@methodmarketinggroup.com"
                                data-testid="home-cta-email"
                                className="ed-link text-lg md:text-xl tracking-tight break-all"
                            >
                                connect@methodmarketinggroup.com
                            </a>
                            <div className="mt-8">
                                <Link
                                    to="/work"
                                    data-testid="home-cta-work"
                                    className="nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium text-cream/85"
                                >
                                    See the Work →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
