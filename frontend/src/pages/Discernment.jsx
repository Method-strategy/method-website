import { Link } from "react-router-dom";
import SaveAsPdfLink from "../components/SaveAsPdfLink";
import ShareRow from "../components/ShareRow";
import { RevealStagger, RevealItem } from "../components/Reveal";

export default function Discernment() {
    const paragraphs = [
        "People ask what makes Method different, and I usually say discernment. It's a word I use carefully. It doesn't mean taste, exactly, or experience, though it requires both. When I'm asked what I actually mean by it, the honest answer requires a basement in Cincinnati.",
        "My father was a brand and packaging designer. In his heyday he worked for a creative and packaging studio in Cincinnati that served Procter & Gamble, and later he ran his own agency with my stepmother. As a kid I watched him work in the basement studio he kept at home, in addition to his office. Cap'n Crunch cereal boxes. Tide. Dove. The things that sat on every shelf in America passed across that drafting table, or ones like it, in some stage of becoming themselves.",
        "He was also an accomplished cartoonist, which mattered more than it might sound. The hand that could be playful was the same hand that could be precise. He designed the Hilton H, the one with the two rectangles and the elliptical cutouts, closed ends back to back, that Hilton still uses for its Honors program. He designed the DMC logo and DeLorean wordmark that went on every car. He got to bring a DeLorean home and drive it for a week, and he art directed the now famous photo of a line of DeLoreans with all their gull-wing doors open. I watched that happen. Later, I participated.",
        "By the time the Hilton and DeLorean work came through the shop, I was running the stat camera. Here's what making a logo actually involved. The mark was blown up to outrageous proportion and hand-tooled from the original sketches on tissue or vellum. Then it was step-reduced, cleaned up, and reduced again in the stat camera, stage by stage, until the edges arrived at crisp perfection. Line illustrations were done the same way. I made hundreds of them for the Hilton internal buyers guide, a catalog that filled six two-inch three-ring binders with Hilton's vendors and their products, every one rendered in line illustration. That was the price of excellence. Not a metaphor for the price. The actual price, paid in hours, at a drafting table, by people who believed the edge of a letterform was worth reducing three times to get right.",
        "I should be clear about the arrangement. I worked for my father's agencies from the time I was old enough to use an X-acto knife, and seriously from 1984 to 1990, rising from production artist to his VP of Client Services. These were not token appointments. My dad held no favoritism for me or my abilities. I had to earn my advances, and then demand them. Nothing was given. When I told him I wanted to move out of production and get in front of clients, to understand where the ideas were made and not just reproduced, he didn't give me a title. He gave me the cassette set of Ogilvy on Advertising and said, \"Listen to this first.\"",
        { pull: "Listen. That turned out to be the whole job." },
        "My father was brilliant with clients and, in the manner of the 1960s ad man he was, occasionally a brute about it. He knew his worth and expected it esteemed. Clients loved the work, and he was funny, but more than once he committed the thing you're never supposed to do: he told a client their baby was ugly. No tact. Full in the face. Some clients respected it enormously. It alienated others. That whole mode was giving way in the 1980s, right as I was coming up, and I rose on the other model. I was a good listener. I took great notes and I had a crystal clear memory, and clients loved me for it. I cleaned up after him in meetings, so to speak. It took me years to see what I'd actually inherited. The diagnosis and the standards came from him. The delivery I had to build myself. Method exists at the intersection: most of what I do for a living is tell companies their baby is ugly. I've just learned to say it in a way they can hear.",
        "I learned to spec type from my father. I spent middle school summers riding my bike to the typesetter to pick up galleys. And in 1987, at the agency he owned, I was the one who pleaded with him to buy one of the first Apple IIgs machines, the technology that would begin deleting the craft he had personally taught me. The pleading was about the price, not the principle. My father was never the resistant old-timer in this story. He brought new tools into the shop his entire career. The stat camera was an investment once too. While working for Hilton, he even installed an original facsimile machine, a Qwip, I believe, in our tiny kitchen, hooked to the home phone line, so he could exchange work with their headquarters without driving to Beverly Hills. A fax machine. In the kitchen. In the 1970s. He bought the IIgs, and years later he went digital himself, though by then, sadly, his best work was behind him. He understood something I only came to understand later: the craft was never the tools.",
        "Which brings me back to discernment. People sometimes assume it's taste, or experience, or pattern recognition. It's upstream of all of those. Discernment is knowing what excellence costs, because you've paid it. It's the reason a logo reduced three times through a stat camera and a logo generated in four seconds can look identical to a client and completely different to me. Not because the new one is bad. Because I know what questions were never asked in those four seconds.",
        "My father died several years ago. He left a large shadow, and I've never entirely run out from under it. I've stopped trying, honestly. It turns out the shadow is load-bearing. Most of what I know about brands, about craft, about the difference between what something looks like and what something is, I learned standing in it.",
        "So when I say AI lacks discernment, that's what I mean. It never rode the bike to the typesetter. It never paid for the edge of the letterform. It can produce the artifact. It can't know the cost.",
        { pull: "The craft was never the tools. It still isn't." }
    ];

    return (
        <main
            data-testid="discernment-page"
            className="bg-cream text-navy"
        >
            {/* Opener */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-56 pb-12 md:pb-16">
                <div className="mb-10 md:mb-14 flex items-center justify-between gap-4">
                    <Link
                        to="/about"
                        data-testid="back-to-about"
                        className="nav-link text-[0.78rem] tracking-[0.22em] uppercase font-medium text-navy/70"
                    >
                        ← About Method
                    </Link>
                    <SaveAsPdfLink variant="cream" testid="discernment-save-pdf" />
                </div>

                <RevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8" stagger={0.14}>
                    <RevealItem className="lg:col-span-2">
                        <div className="eyebrow text-navy/60">
                            An essay
                        </div>
                        <div className="chapter-num mt-4 text-steel">
                            Personal
                        </div>
                    </RevealItem>
                    <RevealItem className="lg:col-span-9 lg:col-start-4">
                        <h1
                            data-testid="discernment-title"
                            className="wordmark text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight"
                        >
                            Where{" "}
                            <span className="serif italic font-normal text-steel">
                                discernment
                            </span>
                            <br />
                            comes from.
                        </h1>
                        <div className="mt-8 text-navy/60 text-sm md:text-base tracking-wide flex flex-wrap items-center gap-x-6 gap-y-2">
                            <span>By Gary Hopkins</span>
                            <span className="w-px h-4 bg-navy/25 hidden sm:inline-block" />
                            <span>A basement in Cincinnati, and after</span>
                        </div>
                    </RevealItem>
                </RevealStagger>
            </section>

            {/* Body */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-8 lg:col-start-4">
                            <div className="prose-method">
                                {paragraphs.map((block, i) =>
                                    typeof block === "string" ? (
                                        <p key={i}>{block}</p>
                                    ) : (
                                        <p
                                            key={i}
                                            className="serif italic text-navy text-2xl md:text-4xl leading-[1.15] !mb-8 py-4 border-l-2 border-steel pl-6"
                                        >
                                            {block.pull}
                                        </p>
                                    )
                                )}
                                <p className="text-sm text-navy/70 !mb-0 mt-8">
                                    Gary Hopkins is the founder and principal
                                    of Method. If you'd like to talk about
                                    your brand:{" "}
                                    <a
                                        href="mailto:connect@methodmarketinggroup.com"
                                        className="ed-link"
                                        data-testid="discernment-email"
                                    >
                                        connect@methodmarketinggroup.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions row */}
            <section className="border-t border-navy/15">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                        <div className="lg:col-span-8 lg:col-start-4 flex flex-wrap items-center justify-between gap-4">
                            <ShareRow
                                title="Where discernment comes from."
                                testidPrefix="discernment-share"
                            />
                            <SaveAsPdfLink
                                variant="cream"
                                testid="discernment-save-bottom"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Return path */}
            <section className="border-t border-navy/15 bg-cream">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Link
                        to="/about"
                        className="nav-link text-[0.82rem] tracking-[0.22em] uppercase font-medium text-navy"
                        data-testid="discernment-return-about"
                    >
                        ← Return to About
                    </Link>
                    <Link
                        to="/writing"
                        className="nav-link text-[0.82rem] tracking-[0.22em] uppercase font-medium text-navy"
                        data-testid="discernment-see-writing"
                    >
                        Read the Method blog →
                    </Link>
                </div>
            </section>
        </main>
    );
}
