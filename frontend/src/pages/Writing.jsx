import { Link } from "react-router-dom";
import { writingSorted, gapSeries } from "../data/writing";
import { RevealStagger, RevealItem } from "../components/Reveal";

export default function Writing() {
    const feature = writingSorted[0];
    const rest = writingSorted.slice(1);
    const gapIntro = gapSeries[0];

    return (
        <main data-testid="writing-index-page" className="bg-cream text-navy">
            {/* Opener */}
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-0 pb-16 md:pb-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 items-end" stagger={0.14}>
                        <RevealItem className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-8">
                                Writing
                            </div>
                            <h1 className="wordmark text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] tracking-tight">
                                Notes on
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    showing up clearly
                                </span>
                                <br />
                                in the market.
                            </h1>
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:pl-6">
                            <p className="emphasis-line">
                                Essays on marketing strategy, brand positioning,
                                and the gap between what companies promise and
                                what they actually deliver.
                            </p>
                            <a
                                href="/writing/rss.xml"
                                data-testid="writing-rss"
                                className="nav-link mt-6 inline-flex items-baseline gap-2 text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                            >
                                <span>Subscribe · RSS</span>
                                <span aria-hidden="true">→</span>
                            </a>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* THE GAP SERIES — anchored callout */}
            <section
                data-testid="writing-gap-series"
                className="row-full-loose bg-navy on-navy text-cream border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8" stagger={0.12}>
                        <RevealItem className="lg:col-span-5">
                            <div className="eyebrow text-cream/60 mb-6">
                                The Gap Series · Ongoing
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight text-cream">
                                Most brand damage
                                <br />
                                doesn't happen
                                <br />
                                in the advertising.
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    It happens in the gap.
                                </span>
                            </h2>
                        </RevealItem>
                        <RevealItem className="lg:col-span-6 lg:col-start-7">
                            <div className="prose-method">
                                <p>
                                    The space between what a company promises
                                    and what its operations actually deliver.
                                    The box that won't open. The loyalty
                                    program that can't recognize loyalty. The
                                    support line that understands your
                                    frustration and fixes nothing.
                                </p>
                                <p>
                                    Closing that gap is the work. Gary writes
                                    about it, with a laugh track, every other
                                    week.
                                </p>
                            </div>
                            {gapIntro && (
                                <Link
                                    to={`/writing/${gapIntro.slug}`}
                                    data-testid="gap-series-start"
                                    className="mt-8 inline-flex items-baseline gap-3 nav-link text-[0.82rem] tracking-[0.22em] uppercase font-medium text-cream"
                                >
                                    <span>Start with the introduction</span>
                                    <span>→</span>
                                </Link>
                            )}
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* Featured (Start here — the Intro) */}
            <section
                data-testid="writing-featured"
                className="row-full-loose border-t border-navy/15 bg-cream"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <div className="eyebrow text-navy/60 mb-8">Start here</div>
                    <RevealStagger>
                        <RevealItem>
                            <Link
                                to={`/writing/${feature.slug}`}
                                data-testid={`writing-card-${feature.slug}`}
                                className="plain group block"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 items-end">
                                    <div className="lg:col-span-2">
                                        <span className="chapter-num block">
                                            {feature.seriesLabel || feature.category}
                                        </span>
                                    </div>
                                    <div className="lg:col-span-8">
                                        <h2 className="serif italic text-3xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.14] text-navy transition-colors duration-300 group-hover:text-steel">
                                            {feature.title}
                                        </h2>
                                        <p className="prose-method max-w-2xl mt-6">
                                            <span>{feature.dek}</span>
                                        </p>
                                    </div>
                                    <div className="lg:col-span-2 lg:text-right">
                                        <span className="nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium text-navy">
                                            Read →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* Archive list — release order */}
            <section
                data-testid="writing-list"
                className="row-full-loose border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
                    <div className="eyebrow text-navy/60 mb-8">The Series</div>
                    <RevealStagger
                        as="ul"
                        className="divide-y divide-navy/15 border-t border-b border-navy/15"
                        stagger={0.06}
                        amount={0.03}
                    >
                        {rest.map((w) => (
                            <RevealItem as="li" key={w.slug}>
                                <Link
                                    to={`/writing/${w.slug}`}
                                    data-testid={`writing-card-${w.slug}`}
                                    className="plain group block py-8 md:py-10"
                                >
                                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                                        <div className="col-span-12 md:col-span-2">
                                            <div className="eyebrow text-navy/55">
                                                {w.seriesLabel || w.category}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <h3 className="serif italic text-2xl md:text-3xl font-normal leading-[1.18] text-navy transition-colors duration-300 group-hover:text-steel">
                                                {w.title}
                                            </h3>
                                            <p className="prose-method max-w-2xl mt-4">
                                                <span>{w.dek}</span>
                                            </p>
                                        </div>
                                        <div className="col-span-12 md:col-span-2 md:text-right">
                                            <span className="text-sm text-navy/60 block mb-2">
                                                {w.readTime}
                                            </span>
                                            <span className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy">
                                                Read →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
