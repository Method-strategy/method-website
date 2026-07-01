import { Link, useParams, Navigate } from "react-router-dom";
import { writing, writingBySlug } from "../data/writing";
import SaveAsPdfLink from "../components/SaveAsPdfLink";

export default function WritingDetail() {
    const { slug } = useParams();
    const post = writingBySlug(slug);
    if (!post) return <Navigate to="/writing" replace />;

    const others = writing.filter((w) => w.slug !== slug).slice(0, 3);

    return (
        <main
            data-testid={`writing-detail-${post.slug}`}
            className="bg-cream text-navy"
        >
            {/* Opener */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-56 pb-12 md:pb-16">
                <div className="mb-10 md:mb-16 flex items-center justify-between gap-4">
                    <Link
                        to="/writing"
                        data-testid="back-to-writing"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                    >
                        ← All Writing
                    </Link>
                    <SaveAsPdfLink variant="cream" testid="writing-detail-save-pdf" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8">
                    <div className="lg:col-span-2">
                        <div className="eyebrow text-navy/60">
                            {post.category}
                        </div>
                    </div>
                    <div className="lg:col-span-9 lg:col-start-4">
                        <h1
                            data-testid="writing-detail-title"
                            className="serif italic font-normal text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] text-navy"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            {post.title}
                        </h1>
                        <div className="mt-8 text-navy/60 text-sm md:text-base tracking-wide flex flex-wrap items-center gap-x-6 gap-y-2">
                            <span>By Gary Hopkins</span>
                            <span className="w-px h-4 bg-navy/25 hidden sm:inline-block" />
                            <span>{post.date}</span>
                            <span className="w-px h-4 bg-navy/25 hidden sm:inline-block" />
                            <span>{post.readTime} read</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dek */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-9 lg:col-start-4">
                            <p className="lede">{post.dek}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Body */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-8 lg:col-start-4 prose-method">
                            {post.body.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                            <p className="serif italic text-navy text-xl md:text-2xl leading-snug !mb-0 mt-4">
                                — Gary Hopkins
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* More writing */}
            <section
                data-testid="writing-detail-more"
                className="border-t border-navy/15 bg-cream"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
                    <div className="flex items-end justify-between mb-12">
                        <h2 className="wordmark text-3xl md:text-5xl tracking-tight">
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
                                    className="plain group block py-8 md:py-10"
                                >
                                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                                        <div className="col-span-12 md:col-span-2">
                                            <div className="eyebrow text-navy/55">
                                                {w.category}
                                            </div>
                                            <div className="text-sm text-navy/55 mt-2">
                                                {w.date}
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
