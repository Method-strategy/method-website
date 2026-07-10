import { Link } from "react-router-dom";
import { RevealStagger, RevealItem } from "../components/Reveal";

const destinations = [
    { label: "Work", to: "/work" },
    { label: "About", to: "/about" },
    { label: "Writing", to: "/writing" },
    { label: "Connect", to: "/connect" },
];

export default function NotFound() {
    return (
        <main data-testid="not-found-page" className="bg-cream text-navy">
            <section className="row-full bg-cream">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-0 pb-16 md:pb-0">
                    <RevealStagger hero className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-8 items-end" stagger={0.14}>
                        <RevealItem hero className="lg:col-span-8">
                            <div className="eyebrow text-navy/60 mb-8">404</div>
                            <h1 className="wordmark text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight">
                                This page
                                <br />
                                doesn't exist.
                                <br />
                                <span className="serif italic font-normal text-steel">
                                    It may have once.
                                </span>
                            </h1>
                        </RevealItem>
                        <RevealItem hero className="lg:col-span-4 lg:pl-6">
                            <p className="emphasis-line">
                                Things have changed around here.
                            </p>
                            <ul className="mt-10 space-y-4">
                                {destinations.map((d) => (
                                    <li key={d.to}>
                                        <Link
                                            to={d.to}
                                            data-testid={`not-found-link-${d.label.toLowerCase()}`}
                                            className="nav-link inline-flex items-baseline gap-2 text-[0.82rem] tracking-[0.22em] uppercase font-medium text-navy"
                                        >
                                            <span>{d.label}</span>
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </RevealItem>
                    </RevealStagger>
                </div>
            </section>
        </main>
    );
}
