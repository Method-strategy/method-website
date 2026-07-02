import { Link } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";
import { Reveal, RevealStagger, RevealItem } from "../components/Reveal";

export default function Work() {
    return (
        <main data-testid="work-index-page" className="bg-cream text-navy">
            {/* ROW 1 — Page opener */}
            <section className="row-full-loose bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-24 pb-16 md:pb-16">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-8 items-start" stagger={0.14}>
                        <RevealItem className="lg:col-span-6">
                            <div className="eyebrow text-navy/60 mb-6">
                                How We Engage
                            </div>
                            <h1 className="wordmark text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.92] tracking-tight">
                                Strategy leads.
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    Everything else
                                </span>
                                <br />
                                follows.
                            </h1>
                        </RevealItem>
                        <RevealItem className="lg:col-span-6 lg:pl-6">
                            <div className="prose-method">
                                <p>
                                    Most marketing problems aren't marketing
                                    problems. They're clarity problems. A
                                    business that hasn't defined what it's
                                    trying to become, or a market presence
                                    that no longer reflects what it actually
                                    is. Method starts there, before anything
                                    is written, designed, or built.
                                </p>
                                <p>
                                    We call this inside-out. It means
                                    understanding the business, its ambitions,
                                    its competitive position, its ideal
                                    client, before making any decisions about
                                    how it shows up. The positioning, the
                                    brand architecture, the content, the
                                    channels: all of it's derived from that
                                    understanding, not imposed on top of it.
                                </p>
                            </div>
                            <p className="pull !mb-0 mt-8 pt-6 border-t border-navy/15">
                                Right message. Right audience. Right time.
                                Right place. That's still the game. The tools
                                and techniques have changed. The fundamentals
                                haven't.
                            </p>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 2 — What we do — capabilities list */}
            <section
                data-testid="work-what-we-do"
                className="row-full-loose border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <RevealItem className="lg:col-span-4">
                            <div className="eyebrow text-navy/60 mb-4">
                                What we do
                            </div>
                            <h2 className="wordmark text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight">
                                The full range
                                <br />
                                of the CMO
                                <br />
                                function, led
                                <br />
                                by strategy.
                            </h2>
                        </RevealItem>
                        <RevealItem className="lg:col-span-8 lg:col-start-5">
                            <RevealStagger
                                as="ol"
                                className="divide-y divide-navy/15 border-y border-navy/15"
                                stagger={0.08}
                                amount={0.05}
                            >
                                {capabilities.map((cap, i) => (
                                    <RevealItem
                                        as="li"
                                        key={cap.title}
                                        className="grid grid-cols-12 gap-4 md:gap-6 py-7 md:py-9 items-start"
                                    >
                                        <span className="col-span-2 md:col-span-1 chapter-num text-steel">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="col-span-10 md:col-span-11">
                                            <h3 className="wordmark text-xl md:text-2xl mb-2 tracking-tight">
                                                {cap.title}
                                            </h3>
                                            <p className="prose-method">
                                                <span className="!m-0">
                                                    {cap.body}
                                                </span>
                                            </p>
                                        </div>
                                    </RevealItem>
                                ))}
                            </RevealStagger>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 3 — Recent engagements */}
            <section
                data-testid="work-engagements"
                className="row-full-loose border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end mb-12 md:mb-20">
                        <RevealItem className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-4">
                                The Work
                            </div>
                            <h2 className="wordmark text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                                A sample of
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    recent engagements.
                                </span>
                            </h2>
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:pl-6 prose-method">
                            <p className="!mb-0">
                                Method has worked with B2B firms across
                                industries since its founding. What follows are
                                two recent engagements, written to protect
                                client confidentiality.
                            </p>
                        </RevealItem>
                    </RevealStagger>

                    <RevealStagger
                        as="ul"
                        data-testid="work-cards"
                        className="divide-y divide-navy/15 border-t border-b border-navy/15"
                        stagger={0.15}
                    >
                        {caseStudies.map((c) => (
                            <RevealItem as="li" key={c.slug}>
                                <Link
                                    to={`/work/${c.slug}`}
                                    data-testid={`work-card-${c.slug}`}
                                    className="plain group block py-12 md:py-16"
                                >
                                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                                        <div className="col-span-12 md:col-span-2">
                                            <span className="chapter-num block">
                                                Engagement {c.number}
                                            </span>
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <div className="eyebrow text-navy/55 mb-4">
                                                {c.sector}
                                            </div>
                                            <h3 className="serif text-3xl md:text-4xl lg:text-5xl italic font-normal leading-[1.1] text-navy mb-6 md:mb-8 transition-colors duration-300 group-hover:text-steel">
                                                {c.title}
                                            </h3>
                                            <p className="prose-method max-w-2xl">
                                                <span>{c.summary}</span>
                                            </p>
                                        </div>
                                        <div className="col-span-12 md:col-span-2 md:text-right">
                                            <span className="nav-link text-[0.82rem] tracking-[0.18em] uppercase font-medium text-navy">
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

const capabilities = [
    {
        title: "Brand Architecture and Positioning",
        body: "The foundation of everything. We define what a business is, who it serves, why it wins, and how it should be understood in the market. This includes naming, brand identity direction, messaging architecture, and competitive positioning. Built to last, not built to trend."
    },
    {
        title: "Content Strategy and Thought Leadership",
        body: "A sustained content program positions a firm as the authority in its space. Method develops the editorial strategy, the point of view, and the content architecture. Where the engagement calls for it, we produce the content itself: articles, LinkedIn programs, case studies, white papers, and contributed editorial in trade and industry publications."
    },
    {
        title: "Channel Strategy and Direction",
        body: "Knowing what to say is half the equation. Knowing where and how to say it's the other half. Method defines the channel strategy, which platforms, which formats, which cadence, and directs execution across LinkedIn, organic search, email, and trade press."
    },
    {
        title: "Website Strategy and Development",
        body: "A website should be the clearest expression of what a business is and why it matters. Method leads the strategic and creative direction, including positioning, copy, information architecture, and design, and oversees development through trusted technical partners."
    },
    {
        title: "Trade Show and Event Strategy",
        body: "For clients entering a new market or building presence at a major industry event, Method develops and executes the full strategy across all three phases: pre-show positioning and campaign development, on-site presence and materials, and post-show follow-through to convert attention into pipeline."
    },
    {
        title: "Investor-Ready Positioning and Marketing Planning",
        body: "Growth-stage companies approaching institutional capital need their market narrative tightly aligned with their business story. Method builds the complete investor-ready marketing foundation: positioning architecture, pitch materials, market framing, and the comprehensive marketing plan that shows investors not just what the company is, but exactly how it intends to grow."
    },
    {
        title: "Fractional CMO Leadership",
        body: "For clients who need ongoing senior marketing leadership, Method operates as the CMO function, owning strategy, directing the team, and maintaining the consistency and integrity of the market presence over time."
    }
];
