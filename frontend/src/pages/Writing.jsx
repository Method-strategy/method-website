import { Link } from "react-router-dom";
import { writing } from "../data/writing";

export default function Writing() {
    const [feature, ...rest] = writing;
    return (
        <main data-testid="writing-index-page" className="bg-cream text-navy">
            {/* Opener */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-56 pb-16 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 items-end">
                    <div className="lg:col-span-8">
                        <div className="eyebrow text-navy/60 mb-8">
                            Writing
                        </div>
                        <h1 className="wordmark text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] tracking-tight reveal">
                            Notes on
                            <br />
                            <span className="serif italic font-normal text-steel">
                                showing up clearly
                            </span>
                            <br />
                            in the market.
                        </h1>
                    </div>
                    <div className="lg:col-span-4 lg:pl-6">
                        <p className="serif italic text-xl md:text-2xl text-navy leading-snug">
                            Essays on strategy, brand positioning, content, and
                            the discipline of the CMO function.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section
                data-testid="writing-featured"
                className="border-t border-navy/15"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <Link
                        to={`/writing/${feature.slug}`}
                        data-testid={`writing-card-${feature.slug}`}
                        className="plain group block"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 items-end">
                            <div className="lg:col-span-2">
                                <div className="eyebrow text-navy/60 mb-2">
                                    Featured
                                </div>
                                <span className="chapter-num block">
                                    {feature.category}
                                </span>
                            </div>
                            <div className="lg:col-span-8">
                                <h2 className="serif italic text-3xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.05] text-navy transition-colors duration-300 group-hover:text-steel">
                                    {feature.title}
                                </h2>
                                <p className="prose-method max-w-2xl mt-6">
                                    <span>{feature.dek}</span>
                                </p>
                            </div>
                            <div className="lg:col-span-2 lg:text-right">
                                <div className="eyebrow text-navy/55 mb-2">
                                    {feature.date}
                                </div>
                                <span className="nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium text-navy">
                                    Read →
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* List */}
            <section
                data-testid="writing-list"
                className="border-t border-navy/15"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-12">
                    <ul className="divide-y divide-navy/15">
                        {rest.map((w) => (
                            <li key={w.slug}>
                                <Link
                                    to={`/writing/${w.slug}`}
                                    data-testid={`writing-card-${w.slug}`}
                                    className="plain group block py-9 md:py-12"
                                >
                                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                                        <div className="col-span-12 md:col-span-2">
                                            <div className="eyebrow text-navy/55">
                                                {w.category}
                                            </div>
                                            <div className="text-sm text-navy/55 mt-2 tracking-wide">
                                                {w.date}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <h3 className="serif italic text-2xl md:text-4xl font-normal leading-[1.15] text-navy transition-colors duration-300 group-hover:text-steel">
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
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
