export const caseStudies = [
    {
        slug: "manufacturing-performance",
        number: "01",
        sector: "Manufacturing Performance Consulting",
        title: "Building a brand around a market moment.",
        summary:
            "A 20-year-old management consulting firm had built a strong track record, but a market presence that hadn't kept pace with the business they'd become. A significant shift in their client market represented a real opportunity to own a point of view. Method built the brand to own it.",
        engagementYears: "Ongoing since 2020",
        scope: [
            "Full rebrand: name consolidation, identity, positioning, voice, and visual system",
            "Website rebuild and ongoing development",
            "Thought leadership content program: 3 to 4 pieces per week over five years",
            "68 case studies produced end-to-end: intake, writing, editing, design, and deployment",
            "LinkedIn content strategy and execution",
            "Contributed article program across industry publications",
            "Competitive research and ongoing market positioning"
        ],
        intro:
            "A 20-year-old management consulting firm specializing in manufacturing performance improvement had built a strong track record, but a market presence that hadn't kept pace with the business they'd become. The brand didn't reflect the depth of the firm. The website didn't reflect the brand.",
        body: [
            "A significant shift was happening in their client market that represented a real opportunity to own a point of view. Manufacturing businesses were facing a labor crisis that went beyond wages and benefits. Employee expectations had fundamentally changed. Competing for talent against tech culture, remote-first companies, and a generation with entirely different ideas about what work should look like had become one of the most pressing strategic challenges in the industry.",
            "Workplace culture had moved from an HR function to a business performance imperative. That was the moment. Method built the brand to own it."
        ],
        outcome: [
            "A market presence built to match a 20-year firm operating at the highest level of its discipline, positioned around a point of view that was genuinely timely, differentiating, and built to lead the conversation.",
            "The positioning landed so effectively that competitors adopted the language and the approach, some verbatim. Five years later, Method and the firm are doing what they did at the start: moving ahead of the market, rebuilding the lead, and reclaiming the authoritative voice that started the conversation in the first place.",
            "This is what it looks like when strategy leads and execution follows."
        ]
    },
    {
        slug: "medtech",
        number: "02",
        sector: "MedTech",
        title: "Four months to market. One system. From appointment to finished eyewear.",
        summary:
            "A pre-Series A medtech company had built a genuinely innovative product but was approaching the industry's most important annual trade show without a coherent brand system, product naming architecture, or investor-ready materials. They had four months.",
        engagementYears: "2024 — Sprint engagement",
        scope: [
            "Complete product naming architecture: evaluated 30+ directions, developed the product naming system, established trademark strategy",
            "Corporate and product brand standards: logos, color, typography, usage rules across all product lines",
            "Product positioning and messaging for four distinct product lines",
            "Four individual product data sheets",
            "Four-page trade show brochure",
            "Trade show booth strategy and layout",
            "Series A investor pitch deck: market sizing, financial narrative, and positioning",
            "Comprehensive marketing plan",
            "System-level overview collateral"
        ],
        intro:
            "A pre-Series A medtech company developing an integrated platform for the ophthalmic and optical industry had built a genuinely innovative product. The technology was real. The pipeline was building. But the company was approaching the industry's most important annual trade show without a coherent brand system, a product naming architecture, or investor-ready materials.",
        body: [
            "They had four months.",
            "The scope was full. Complete product naming architecture across a system of four product lines. Corporate and product brand standards. Positioning and messaging that could hold up to industry scrutiny and investor questioning. Trade show materials, booth strategy, and a Series A pitch deck that framed the market with clarity."
        ],
        outcome: [
            "The company arrived at the show with a coherent brand, a naming system built to survive IP scrutiny, a complete product story, and investor materials with a clear and compelling narrative — four months after the engagement began.",
            "The show was extremely well received. The Series A is in progress.",
            "This is what it looks like to build a market presence from the inside out, under pressure, in a sprint."
        ]
    }
];

export const caseStudyBySlug = (slug) =>
    caseStudies.find((c) => c.slug === slug);
