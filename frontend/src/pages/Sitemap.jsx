import { Link } from "react-router-dom";
import { writingSorted } from "../data/writing";
import { caseStudies } from "../data/caseStudies";
import { RevealStagger, RevealItem } from "../components/Reveal";

const pages = [
    { label: "Home", to: "/" },
    { label: "Work", to: "/work" },
    { label: "About", to: "/about" },
    { label: "Discernment", to: "/about/discernment" },
    { label: "Writing", to: "/writing" },
    { label: "Connect", to: "/connect" },
    { label: "Privacy Policy", to: "/privacy-policy" },
];

const SectionList = ({ title, items }) => (
    <div>
        <div className="eyebrow text-navy/60 mb-6">{title}</div>
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.to}>
                    <Link
                        to={item.to}
                        data-testid={`sitemap-link-${item.to.replace(/\//g, "-").replace(/^-/, "") || "home"}`}
                        className="nav-link text-navy/90 text-base"
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default function Sitemap() {
    const work = caseStudies.map((c) => ({
        label: c.title,
        to: `/work/${c.slug}`,
    }));
    const writing = writingSorted.map((w) => ({
        label: w.title,
        to: `/writing/${w.slug}`,
    }));

    return (
        <main data-testid="sitemap-page" className="bg-cream text-navy">
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-20 md:pb-28">
                    <RevealStagger hero stagger={0.12}>
                        <RevealItem hero>
                            <div className="eyebrow text-navy/60 mb-8">
                                Sitemap
                            </div>
                            <h1 className="wordmark text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight mb-16 md:mb-20">
                                Everything,
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    in one place.
                                </span>
                            </h1>
                        </RevealItem>
                        <RevealItem hero>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-14 gap-x-8">
                                <div className="md:col-span-3">
                                    <SectionList title="Pages" items={pages} />
                                </div>
                                <div className="md:col-span-4">
                                    <SectionList title="Work" items={work} />
                                </div>
                                <div className="md:col-span-5">
                                    <SectionList title="Writing" items={writing} />
                                </div>
                            </div>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
