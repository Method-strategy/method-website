import { Link } from "react-router-dom";
import { Reveal, RevealStagger, RevealItem } from "../components/Reveal";

export default function About() {
    return (
        <main data-testid="about-page" className="bg-cream text-navy">
            {/* ROW 1 — Opener */}
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-0 pb-16 md:pb-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 items-end" stagger={0.14}>
                        <RevealItem className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-8">
                                About Method
                            </div>
                            <h1 className="wordmark text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] tracking-tight">
                                There is a
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    method
                                </span>{" "}
                                to this.
                            </h1>
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:pl-6">
                            <p className="emphasis-line">
                                Founded 2020. A deliberate point of view about
                                what a marketing practice should be.
                            </p>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 2 — Philosophy */}
            <section
                data-testid="about-philosophy"
                className="row-full-loose border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <RevealItem className="lg:col-span-3">
                            <div className="eyebrow text-navy/60">
                                The Idea
                            </div>
                        </RevealItem>
                        <RevealItem className="lg:col-span-8 lg:col-start-5">
                            <p className="lede mb-10">
                                Method was founded in 2020 with a deliberate
                                point of view: the most valuable thing a
                                marketing practice can offer isn't execution.
                                It's thinking.
                            </p>
                            <div className="prose-method max-w-3xl">
                                <p>
                                    The kind of thinking that starts with
                                    understanding what a business is trying to
                                    become and works outward from there. The
                                    name isn't a brand exercise. It's a
                                    description of how we work. Methodical.
                                    Inside-out. Substance over sizzle.
                                </p>
                                <p>
                                    Every engagement begins the same way, with
                                    the questions most practitioners skip
                                    because they're eager to start producing.
                                    What is this business trying to become?
                                    Who is the right audience? What does that
                                    audience need to believe? What is the
                                    clearest, most honest way to say it? The
                                    answers to those questions determine
                                    everything that follows.
                                </p>
                                <p className="emphasis-line !mb-0 pt-2">
                                    The brand. The positioning. The content.
                                    The channels. The execution. None of it is
                                    imposed from the outside. All of it is
                                    derived from the inside out.
                                </p>
                            </div>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 3 — Small numbers row */}
            <section className="row-full bg-cream border-t border-navy/15">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-0">
                    <RevealStagger className="grid grid-cols-2 md:grid-cols-4 gap-y-14 gap-x-8" stagger={0.12}>
                        {[
                            { k: "2020", v: "Founded" },
                            { k: "4–5", v: "Active clients at any time" },
                            { k: "40 yrs", v: "Practitioner experience" },
                            { k: "1", v: "Point of view" }
                        ].map((n) => (
                            <RevealItem key={n.k}>
                                <div
                                    className="wordmark text-5xl md:text-6xl lg:text-7xl text-navy leading-none"
                                    data-testid={`about-stat-${n.k}`}
                                >
                                    {n.k}
                                </div>
                                <div className="eyebrow text-navy/60 mt-4">
                                    {n.v}
                                </div>
                            </RevealItem>
                        ))}
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 4 — Gary Hopkins bio */}
            <section
                data-testid="about-founder"
                className="row-full-loose border-t border-navy/15"
            >
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8">
                        <RevealItem className="lg:col-span-4">
                            <div className="eyebrow text-navy/60 mb-6">
                                Founder & Principal
                            </div>
                            <h2 className="wordmark text-4xl md:text-5xl lg:text-[3.5rem] leading-[0.98] tracking-tight">
                                Gary
                                <br />
                                Hopkins.
                            </h2>
                            <p className="serif italic text-3xl md:text-4xl text-steel mt-6 leading-tight">
                                Nearly four decades.
                                <br />
                                Every phase of the medium.
                            </p>
                        </RevealItem>
                        <RevealItem className="lg:col-span-8 prose-method">
                            <p>
                                Gary Hopkins has worked in marketing for
                                nearly forty years, through print, broadcast,
                                direct mail, the early web, email marketing,
                                search, social media, content, and now AI. He
                                has guided clients through every major
                                transition in the discipline, not as a
                                technologist chasing tools, but as a
                                strategist who understands what changes and
                                what doesn't.
                            </p>
                            <p className="emphasis-line">
                                The tools and techniques have changed. The
                                game hasn't. Reaching the right people with
                                the right message at the right time is still
                                all it is. Knowing that is what forty years
                                buys you.
                            </p>
                            <p>
                                Gary began his career in Southern California,
                                where he co-founded F Space, a full-service
                                creative agency he built and led for nineteen
                                years. The agency served major brands
                                including Farmer Bros. Coffee, Yamaha
                                Motorsports, El Portal Luxury Leather Goods,
                                and Rodenstock, among many others. It was a
                                formative run: building a creative practice
                                from the ground up, learning what great looks
                                like, and developing the judgment that comes
                                from doing serious work for serious clients
                                over a long period of time.
                            </p>
                            <p>
                                From there, Gary moved to the client side,
                                first as Marketing Director for a regional
                                home furnishings retailer, then as VP of
                                Marketing for a Southeast-based large-scale
                                commercial construction company. Those years
                                on the other side of the table were
                                instructive in ways that agency life cannot
                                replicate. They showed him how marketing
                                decisions actually get made inside a business:
                                the budgets, the internal dynamics, the gap
                                between what gets promised and what gets
                                delivered.
                            </p>
                            <p>
                                He founded Method in 2020, drawing on all of
                                it. The creative direction of the agency
                                years. The business sensibility of the
                                client-side years. The strategic discipline of
                                four decades of practice. The result is a
                                practice that thinks like a CMO and works like
                                a creative director, which is, in the end,
                                exactly what the right clients need.
                            </p>
                            <p>
                                Gary is directly involved in every Method
                                engagement. Not as an account supervisor. Not
                                as the person who pitches and disappears. As
                                the strategist and creative director doing the
                                actual work. That's the arrangement.
                            </p>
                            <p>
                                In 2017, more than three decades into
                                practicing marketing, Gary went back to study
                                it. He completed a Bachelor of Business
                                Administration in Marketing at Kennesaw State
                                University over five years while running the
                                practice, graduating summa cum laude in 2022
                                with a 4.0, and picking up the university's
                                best emerging new writer award as a freshman
                                along the way. He's methodical. It's been said
                                of him so many times it became the name on the
                                door.
                            </p>
                            <p>
                                Outside the practice, Gary has a tinkerer's
                                heart, which is why he's spent a lifetime
                                restoring things by hand: first vintage
                                motorcycles, then bicycles. The same instinct
                                shows up in how he works over a sentence until
                                it's right. He's a lifelong bass player and
                                still plays in a rock band, because rock and
                                roll dreams die hard, and because everything
                                worth knowing about teamwork and communication
                                can be learned in a band. He holds his own at
                                disc golf against his son and his son's
                                friends, a fact he'll mention if given the
                                opening. And he's been married to a superhero
                                badass woman for thirty-five years.
                            </p>
                            <p className="!mb-0">
                                Most of what Gary knows about brands and craft
                                he learned in his father's studios, from the
                                stat camera up. That story is longer, and it
                                lives here:{" "}
                                <Link
                                    to="/about/discernment"
                                    data-testid="about-discernment-link"
                                    className="ed-link"
                                >
                                    Where Discernment Comes From →
                                </Link>
                            </p>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>

            {/* ROW 5 — Writing tease */}
            <section className="row-full border-t border-navy/15">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
                    <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end" stagger={0.14}>
                        <RevealItem className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-4">
                                Writing
                            </div>
                            <h2 className="serif italic text-3xl md:text-5xl lg:text-6xl leading-tight text-navy">
                                Gary writes regularly on marketing
                                strategy, brand positioning, and the
                                discipline of showing up clearly in the
                                market.
                            </h2>
                        </RevealItem>
                        <RevealItem className="lg:col-span-4 lg:pl-6">
                            <Link
                                to="/writing"
                                data-testid="about-writing-link"
                                className="ed-link text-lg md:text-xl tracking-tight"
                            >
                                Read the Method blog →
                            </Link>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
