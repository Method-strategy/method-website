import { Link } from "react-router-dom";
import { Reveal, RevealStagger, RevealItem } from "../components/Reveal";

export default function Home() {
    return (
        <main data-testid="home-page">
            {/* ROW 1 — HERO — 2-column, vertical divider between */}
            <section
                data-testid="home-hero"
                className="on-navy bg-navy text-cream row-full"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger hero className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-0 items-center" stagger={0.14}>
                        <RevealItem hero className="lg:col-span-8 flex items-center">
                            <h1
                                data-testid="home-hero-wordmark"
                                className="wordmark text-5xl md:text-6xl lg:text-[5.25rem] xl:text-[6rem] leading-[0.98] tracking-tight text-cream"
                            >
                                <span className="block sm:whitespace-nowrap">Clarifying</span>
                                <span className="block sm:whitespace-nowrap">how you</span>
                                <span className="block sm:whitespace-nowrap text-steel">
                                    show up
                                </span>
                                <span className="block sm:whitespace-nowrap">in the market.</span>
                            </h1>
                        </RevealItem>
                        <RevealItem hero className="lg:col-span-4 flex items-center lg:pl-12 lg:border-l lg:border-cream/20 lg:min-h-[24rem]">
                            <p
                                data-testid="home-hero-subhead"
                                className="pull max-w-md"
                            >
                                A strategic marketing practice more than forty
                                years in the making.
                            </p>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 2 — Opening statement */}
            <section
                data-testid="home-opening"
                className="bg-cream text-navy row-full"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <RevealItem className="lg:col-span-2 lg:col-start-1">
                            <div className="eyebrow text-navy/60">
                                On the record
                            </div>
                        </RevealItem>
                        <RevealItem className="lg:col-span-9 lg:col-start-4">
                            <h2 className="wordmark text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.5rem] leading-[1.12] tracking-tight text-navy">
                                Most B2B firms are better
                                <br />
                                than their market presence
                                <br />
                                suggests.
                            </h2>
                            <p className="serif italic font-normal text-steel text-4xl md:text-5xl lg:text-[3rem] leading-none tracking-tight mt-8 md:mt-10 mb-10">
                                We fix that.
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
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 3 — The Model */}
            <section
                data-testid="home-the-model"
                className="bg-cream text-navy row-full border-t border-navy/10"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <RevealItem className="lg:col-span-4">
                            <div className="eyebrow text-navy/60 mb-6">
                                The Model
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
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
                        </RevealItem>
                        <RevealItem className="lg:col-span-7 lg:col-start-6 prose-method">
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
                            <p className="pull !mb-0 mt-8 pt-6 border-t border-navy/15">
                                Where execution is part of the scope, we
                                deliver it or direct it. Strategy doesn't stop
                                at a deck.
                            </p>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 4 — Who We Work With */}
            <section
                data-testid="home-who"
                className="bg-cream text-navy row-full-loose border-t border-navy/10"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-8">
                        <RevealItem className="lg:col-span-5">
                            <div className="eyebrow text-navy/60 mb-6">
                                Who We Work With
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] tracking-tight">
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
                        </RevealItem>
                        <RevealItem className="lg:col-span-6 lg:col-start-7 space-y-14">
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
                                <p className="pull">
                                    In both cases, the problem isn't
                                    execution. It's clarity. That's where we
                                    start.
                                </p>
                            </div>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 5 — CTA band — Navy */}
            <section
                data-testid="home-cta"
                className="on-navy bg-navy text-cream row-full"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end" stagger={0.15}>
                        <RevealItem className="lg:col-span-8">
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
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:pl-6">
                            <div className="eyebrow text-cream/60 mb-3">
                                Start a conversation
                            </div>
                            <a
                                href="mailto:connect@methodmarketinggroup.com"
                                data-testid="home-cta-email"
                                className="ed-link text-sm md:text-base tracking-tight whitespace-nowrap"
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
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
