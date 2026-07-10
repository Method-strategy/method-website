import { Link, useParams, Navigate } from "react-router-dom";
import { writingSorted, writingBySlug, gapSeries } from "../data/writing";
import SaveAsPdfLink from "../components/SaveAsPdfLink";
import ShareRow from "../components/ShareRow";
import { RevealStagger, RevealItem } from "../components/Reveal";

export default function WritingDetail() {
    const { slug } = useParams();
    const post = writingBySlug(slug);
    if (!post) return <Navigate to="/writing" replace />;

    const isGap = post.series === "Gap Series";
    const gapIndex = isGap ? gapSeries.findIndex((p) => p.slug === slug) : -1;
    const prevPost = writingSorted[writingSorted.findIndex((p) => p.slug === slug) + 1];
    const nextPost = writingSorted[writingSorted.findIndex((p) => p.slug === slug) - 1];
    const others = writingSorted.filter((w) => w.slug !== slug).slice(0, 3);

    return (
        <main
            data-testid={`writing-detail-${post.slug}`}
            className="bg-cream text-navy"
        >
            {/* Opener */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-56 pb-8 md:pb-12">
                <div className="mb-10 md:mb-14 flex items-center justify-between gap-4">
                    <Link
                        to="/writing"
                        data-testid="back-to-writing"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                    >
                        ← All Writing
                    </Link>
                    <SaveAsPdfLink variant="cream" testid="writing-detail-save-pdf" />
                </div>
                <RevealStagger hero className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8" stagger={0.1}>
                    <RevealItem hero className="lg:col-span-2">
                        <div className="eyebrow text-navy/60">
                            {post.seriesLabel || post.category}
                        </div>
                        {isGap && gapIndex >= 0 && (
                            <div className="chapter-num mt-4 text-steel">
                                {gapIndex === 0
                                    ? "Introduction"
                                    : `${String(gapIndex).padStart(2, "0")} / ${String(gapSeries.length - 1).padStart(2, "0")}`}
                            </div>
                        )}
                    </RevealItem>
                    <RevealItem hero className="lg:col-span-9 lg:col-start-4">
                        <h1
                            data-testid="writing-detail-title"
                            className="serif italic font-normal text-4xl md:text-6xl lg:text-[4rem] leading-[1.05] text-navy"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            {post.title}
                        </h1>
                        <div className="mt-8 text-navy/60 text-sm md:text-base tracking-wide flex flex-wrap items-center gap-x-6 gap-y-2">
                            <span>By Gary Hopkins</span>
                            <span className="w-px h-4 bg-navy/25 hidden sm:inline-block" />
                            <span>{post.readTime} read</span>
                        </div>
                    </RevealItem>
                </RevealStagger>
            </section>

            {/* Dek */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-9 lg:col-start-4">
                            <p className="lede">{post.dek}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Body */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-8 lg:col-start-4 prose-method">
                            {post.body.map((block, i) => (
                                <p key={i}>{block.text}</p>
                            ))}
                            <p className="serif italic text-navy text-xl md:text-2xl leading-snug !mb-0 mt-6">
                                — Gary Hopkins
                            </p>
                            <p className="text-sm text-navy/60 !mb-0 mt-3">
                                Founder and principal of Method, a strategic
                                marketing practice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions row: share + save */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-8 items-center">
                        <div className="lg:col-span-8 lg:col-start-4 flex flex-wrap items-center justify-between gap-4">
                            <ShareRow
                                title={post.title}
                                testidPrefix="writing-share"
                            />
                            <SaveAsPdfLink
                                variant="cream"
                                testid="writing-save-bottom"
                                label="Save as PDF"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Series continuation (Gap only) */}
            {isGap && (
                <section className="border-t border-navy/15 bg-cream">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <div className="eyebrow text-navy/60 mb-2">
                                    The Gap Series
                                </div>
                                <h2 className="wordmark text-2xl md:text-3xl tracking-tight">
                                    The full series
                                </h2>
                            </div>
                            <span className="text-navy/60 text-sm">
                                {gapSeries.length} pieces
                            </span>
                        </div>
                        <ol className="divide-y divide-navy/15 border-t border-b border-navy/15">
                            {gapSeries.map((p, i) => {
                                const active = p.slug === slug;
                                return (
                                    <li key={p.slug}>
                                        <Link
                                            to={`/writing/${p.slug}`}
                                            data-testid={`gap-series-item-${p.slug}`}
                                            className={`plain group grid grid-cols-12 gap-4 md:gap-8 py-5 md:py-6 items-baseline ${
                                                active ? "opacity-100" : "opacity-90 hover:opacity-100"
                                            }`}
                                        >
                                            <span className="col-span-2 md:col-span-1 chapter-num text-steel text-base">
                                                {i === 0 ? "Intro" : String(i).padStart(2, "0")}
                                            </span>
                                            <span className={`col-span-8 md:col-span-9 serif italic ${
                                                active ? "text-steel" : "text-navy group-hover:text-steel"
                                            } text-lg md:text-xl leading-snug transition-colors duration-200`}>
                                                {p.title}
                                            </span>
                                            <span className="col-span-2 text-right text-navy/55 text-xs md:text-sm tracking-wide">
                                                {active ? "Reading" : (i === 0 ? "Intro" : `No. ${i}`)}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </section>
            )}

            {/* Prev / Next chronological */}
            <section className="border-t border-navy/15 bg-cream">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        {prevPost && (
                            <Link
                                to={`/writing/${prevPost.slug}`}
                                data-testid="prev-post"
                                className="plain group block"
                            >
                                <div className="eyebrow text-navy/55 mb-2">
                                    ← Previous
                                </div>
                                <div className="serif italic text-xl md:text-2xl leading-tight text-navy group-hover:text-steel transition-colors duration-200">
                                    {prevPost.title}
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="md:text-right">
                        {nextPost && (
                            <Link
                                to={`/writing/${nextPost.slug}`}
                                data-testid="next-post"
                                className="plain group block"
                            >
                                <div className="eyebrow text-navy/55 mb-2">
                                    Next →
                                </div>
                                <div className="serif italic text-xl md:text-2xl leading-tight text-navy group-hover:text-steel transition-colors duration-200">
                                    {nextPost.title}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* More writing */}
            <section
                data-testid="writing-detail-more"
                className="border-t border-navy/15 bg-cream"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <div className="flex items-end justify-between mb-10">
                        <h2 className="wordmark text-3xl md:text-4xl tracking-tight">
                            More writing
                        </h2>
                        <Link
                            to="/writing"
                            data-testid="writing-see-all"
                            className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                        >
                            See all →
                        </Link>
                    </div>
                    <ul className="divide-y divide-navy/15 border-t border-b border-navy/15">
                        {others.map((w) => (
                            <li key={w.slug}>
                                <Link
                                    to={`/writing/${w.slug}`}
                                    data-testid={`more-writing-${w.slug}`}
                                    className="plain group block py-7 md:py-9"
                                >
                                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                                        <div className="col-span-12 md:col-span-2">
                                            <div className="eyebrow text-navy/55">
                                                {w.seriesLabel || w.category}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <h3 className="serif italic text-2xl md:text-3xl leading-tight text-navy transition-colors duration-300 group-hover:text-steel">
                                                {w.title}
                                            </h3>
                                        </div>
                                        <div className="col-span-12 md:col-span-2 md:text-right">
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
