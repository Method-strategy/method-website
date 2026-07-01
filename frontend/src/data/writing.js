export const writing = [
    {
        slug: "the-clarity-problem",
        title: "Most marketing problems aren't marketing problems.",
        dek: "They're clarity problems. A business that hasn't defined what it's trying to become, or a market presence that no longer reflects what it actually is.",
        date: "November 12, 2025",
        readTime: "6 min",
        category: "Strategy",
        body: [
            "Every engagement Method takes on begins the same way. Not with a brief. Not with a scope document. With a conversation that sounds, on the surface, like it has nothing to do with marketing.",
            "What is this business trying to become? Who is the right audience? What does that audience need to believe? What is the clearest, most honest way to say it?",
            "The answers to those questions determine everything that follows. The brand. The positioning. The content. The channels. The execution. None of it is imposed from the outside. All of it is derived from the inside out.",
            "Firms that skip this step are, in effect, executing on assumptions. And execution against the wrong assumption is worse than no execution at all, because it locks the market's perception of you in a place you didn't choose."
        ]
    },
    {
        slug: "inside-out",
        title: "Inside-out is not a slogan.",
        dek: "It's a working method. Everything visible in a business is a downstream artifact of decisions the business made about what it is.",
        date: "October 28, 2025",
        readTime: "7 min",
        category: "Method",
        body: [
            "There's a phrase we use here often. Inside-out. It's not a slogan. It's the working method.",
            "The idea is simple. Everything a market sees of a business — the brand, the website, the messaging, the content, the way its people talk about it in a meeting — is a downstream artifact of decisions the business has made, consciously or otherwise, about what it is."
        ]
    },
    {
        slug: "the-fractional-cmo-question",
        title: "When a fractional CMO makes sense.",
        dek: "Two situations tend to bring clients to Method. Both are about clarity, not capacity.",
        date: "October 14, 2025",
        readTime: "5 min",
        category: "Practice",
        body: [
            "Two situations tend to bring clients to Method. The first is an established firm that has grown past its market presence. The brand, the website, the messaging: it all reflects who they were, not who they are.",
            "The second is a growth-stage company that needs the CMO function built from the ground up, before a raise, before a commercial push, before the market forms its own impression."
        ]
    },
    {
        slug: "the-tools-changed",
        title: "The tools changed. The game didn't.",
        dek: "Right message. Right audience. Right time. Right place. That's still what marketing is. Forty years of practice does not argue with that.",
        date: "September 30, 2025",
        readTime: "4 min",
        category: "Perspective",
        body: [
            "There is a version of marketing thought that treats every new channel, format, and tool as a rupture. As if the arrival of TikTok, or programmatic, or generative AI, means the discipline itself has been rewritten.",
            "It hasn't. Reaching the right people with the right message at the right time is still all it is. Knowing that is what forty years buys you."
        ]
    },
    {
        slug: "b2b-brand-is-a-business-problem",
        title: "B2B brand is a business problem.",
        dek: "The most expensive brand problem in B2B isn't a bad logo. It's a company whose market presence lags its actual capability by three to five years.",
        date: "September 16, 2025",
        readTime: "6 min",
        category: "Positioning",
        body: [
            "Ask most B2B executives about brand and you'll get a version of the same answer. It's important, sure, but it's not a business problem in the way that pipeline, retention, and pricing are business problems.",
            "That answer is wrong, and the cost of the wrong answer is measured in years of underperformance."
        ]
    },
    {
        slug: "what-good-content-actually-does",
        title: "What good content actually does.",
        dek: "A sustained content program is not a lead-generation tactic. It's the way a firm assumes authority in its market — and it works whether or not anyone fills out a form.",
        date: "September 02, 2025",
        readTime: "8 min",
        category: "Content",
        body: [
            "One of the ways the discipline of marketing has drifted in the last decade is in how it treats content. Content became a tactic, measured in the same breath as paid clicks and email opens.",
            "That framing misses what content is actually doing when it's done well."
        ]
    },
    {
        slug: "trade-shows-still-matter",
        title: "Trade shows still matter. Most firms don't work them.",
        dek: "For B2B firms in certain industries, one show can define the market's read of your company for the year. Most companies treat it as a booth to build. That's the mistake.",
        date: "August 19, 2025",
        readTime: "5 min",
        category: "Practice",
        body: [
            "The trade show discourse online has been the same for a decade. Trade shows are dead. Digital has replaced them. Nobody attends anymore.",
            "In the industries Method works in, none of that is true."
        ]
    },
    {
        slug: "investor-ready-is-a-narrative",
        title: "Investor-ready is a narrative problem before it's a materials problem.",
        dek: "A pitch deck that isn't rooted in a clear, defensible view of the market is a beautifully designed set of assumptions. Investors read past it.",
        date: "August 05, 2025",
        readTime: "6 min",
        category: "Growth-stage",
        body: [
            "The mistake growth-stage companies make with investor materials is treating them as a design deliverable. A better slide, a better chart, a better structure.",
            "The materials are downstream. The narrative is the work."
        ]
    }
];

export const writingBySlug = (slug) => writing.find((w) => w.slug === slug);
