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

            {/* ROW 2 — How an engagement begins */}
            <section
                data-testid="work-how-engagement-begins"
                className="row-full-loose border-t border-navy/15 bg-cream"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    {/* Section opener */}
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end mb-14 md:mb-20" stagger={0.14}>
                        <RevealItem className="lg:col-span-7">
                            <div className="eyebrow text-navy/60 mb-6">
                                How an engagement begins
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.02] tracking-tight">
                                No pitch deck.
                                <br />
                                No dog and pony.
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    A sequence that works.
                                </span>
                            </h2>
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:col-start-9">
                            <p className="prose-method !mb-0">
                                Every Method engagement starts the same way,
                                because the way it starts is the method.
                            </p>
                        </RevealItem>
                    </RevealStagger>

                    {/* Stepped sequence */}
                    <RevealStagger
                        as="ol"
                        className="divide-y divide-navy/15 border-t border-b border-navy/15"
                        stagger={0.1}
                        amount={0.05}
                    >
                        {engagementSteps.map((step) => (
                            <RevealItem
                                as="li"
                                key={step.marker}
                                className="grid grid-cols-12 gap-4 md:gap-8 py-9 md:py-12 items-start"
                            >
                                <span className="col-span-2 md:col-span-1 chapter-num text-steel serif italic">
                                    {step.marker}
                                </span>
                                <div className="col-span-10 md:col-span-11">
                                    <h3 className="wordmark text-2xl md:text-3xl leading-[1.15] tracking-tight mb-4 md:mb-5">
                                        {step.title}
                                    </h3>
                                    <p className="prose-method max-w-3xl">
                                        <span className="!m-0">{step.body}</span>
                                    </p>
                                </div>
                            </RevealItem>
                        ))}
                    </RevealStagger>

                    {/* Closing quotable — pull quote flourish */}
                    <Reveal>
                        <div className="grid grid-cols-12 gap-4 md:gap-8 mt-14 md:mt-20">
                            <div className="col-span-12 md:col-span-11 md:col-start-2">
                                <p
                                    data-testid="engagement-pull-quote"
                                    className="serif italic font-normal text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-steel"
                                >
                                    &ldquo;That&rsquo;s the difference between
                                    buying a plan and buying a pitch.&rdquo;
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ROW 3 — What we do — capabilities list */}
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

const engagementSteps = [
    {
        marker: "i",
        title: "First, a short conversation.",
        body: "Before we talk, we send five questions. Not a form, and not homework: they're the things no amount of outside research can tell us, and a few honest sentences on each is plenty. We do our own homework before the call. We don't show up cold. By the time we're talking, the conversation is about your business, not an introduction to it."
    },
    {
        marker: "ii",
        title: "Then, usually, the Market Presence Audit.",
        body: "Most engagements begin with a fixed-fee audit of the gap between what your business is and how it shows up: your website's promise against its evidence, your brand's consistency across every public surface, how you appear in search and to the AI systems increasingly answering questions about you, who claims what ground among your competitors, and where your track record has gone undocumented. It takes about three weeks, and it's scoped in a brief conversation."
    },
    {
        marker: "iii",
        title: "The findings are the plan.",
        body: "What you receive is a prioritized gap inventory: what we found, what each gap costs you, and what we'd fix first, second, and third. The audit stands alone. There's no obligation beyond it, and the findings are yours whether Method does the fixing or you do."
    },
    {
        marker: "iv",
        title: "If we go further, the engagement is already designed.",
        body: "When the findings warrant a deeper relationship, nothing gets pitched. The prioritized list is the scope. The engagement is built from what the audit actually found, not from what a proposal imagined."
    }
];

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
