import { Link, useParams, Navigate } from "react-router-dom";
import { caseStudyBySlug, caseStudies } from "../data/caseStudies";
import SaveAsPdfLink from "../components/SaveAsPdfLink";
import ShareRow from "../components/ShareRow";

export default function WorkDetail() {
    const { slug } = useParams();
    const cs = caseStudyBySlug(slug);
    if (!cs) return <Navigate to="/work" replace />;

    const currentIndex = caseStudies.findIndex((c) => c.slug === slug);
    const next = caseStudies[(currentIndex + 1) % caseStudies.length];

    return (
        <main
            data-testid={`work-detail-${cs.slug}`}
            className="bg-cream text-navy"
        >
            {/* Opener */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-56 pb-16 md:pb-24">
                <div className="mb-10 md:mb-16 flex items-center justify-between gap-4">
                    <Link
                        to="/work"
                        data-testid="back-to-work"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                    >
                        ← All Work
                    </Link>
                    <SaveAsPdfLink variant="cream" testid="work-detail-save-pdf" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                    <div className="lg:col-span-2">
                        <span className="chapter-num block">
                            Engagement {cs.number}
                        </span>
                    </div>
                    <div className="lg:col-span-9 lg:col-start-4">
                        <div className="eyebrow text-navy/60 mb-6">
                            {cs.sector} · {cs.engagementYears}
                        </div>
                        <h1
                            data-testid="work-detail-title"
                            className="serif italic text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] font-normal text-navy"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            {cs.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Body */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <div className="lg:col-span-3">
                            <div className="eyebrow text-navy/60">
                                The Situation
                            </div>
                        </div>
                        <div className="lg:col-span-8 lg:col-start-5">
                            <p className="lede mb-10">{cs.intro}</p>
                            <div className="prose-method max-w-3xl">
                                {cs.body.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scope */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <div className="lg:col-span-3">
                            <div className="eyebrow text-navy/60 mb-4">
                                The Work
                            </div>
                            <p className="serif italic text-2xl md:text-3xl text-steel leading-snug">
                                Scope of the engagement.
                            </p>
                        </div>
                        <div className="lg:col-span-8 lg:col-start-5">
                            <ul
                                data-testid="scope-list"
                                className="divide-y divide-navy/15 border-t border-b border-navy/15"
                            >
                                {cs.scope.map((s, i) => (
                                    <li
                                        key={i}
                                        className="grid grid-cols-12 gap-4 py-5 md:py-6 items-baseline"
                                    >
                                        <span className="col-span-2 md:col-span-1 chapter-num text-steel text-lg">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="col-span-10 md:col-span-11 text-navy text-lg md:text-xl leading-snug tracking-tight">
                                            {s}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Outcome */}
            <section
                data-testid="work-detail-outcome"
                className="on-navy bg-navy text-cream"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <div className="lg:col-span-3">
                            <div className="eyebrow text-cream/60">
                                The Outcome
                            </div>
                        </div>
                        <div className="lg:col-span-8 lg:col-start-5">
                            <p className="lede mb-10">{cs.outcome[0]}</p>
                            <div className="prose-method max-w-3xl">
                                {cs.outcome.slice(1).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions row — share + save the case study */}
            <section
                data-print-hide="true"
                className="border-t border-navy/15 bg-cream"
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-8 items-center">
                        <div className="lg:col-span-8 lg:col-start-5 flex flex-wrap items-center justify-between gap-4">
                            <ShareRow
                                title={cs.title}
                                testidPrefix="work-share"
                            />
                            <SaveAsPdfLink
                                variant="cream"
                                testid="work-save-bottom"
                                label="Save as PDF"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Next case study */}
            <section className="bg-cream border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
                    <Link
                        to={`/work/${next.slug}`}
                        data-testid="next-case-study"
                        className="plain group block"
                    >
                        <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
                            <div className="col-span-12 md:col-span-4">
                                <div className="eyebrow text-navy/60 mb-3">
                                    Next Engagement
                                </div>
                                <div className="chapter-num">
                                    Engagement {next.number}
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <h3 className="serif italic text-2xl md:text-4xl leading-tight text-navy transition-colors duration-300 group-hover:text-steel">
                                    {next.title}
                                </h3>
                            </div>
                            <div className="col-span-12 md:col-span-2 md:text-right">
                                <span className="nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium">
                                    Read →
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}
