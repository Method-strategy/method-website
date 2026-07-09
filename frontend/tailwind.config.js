/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                navy: "#13243d",
                cream: "#f5f1eb",
                steel: "#5A7D9A",
                ink: "#444444",
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))'
            },
            fontFamily: {
                // Body / reader — Akzidenz-Grotesk Next Pro from Typekit.
                // Everything below H2 size uses this. Never used for display.
                sans: [
                    "akzidenz-grotesk-next-pro",
                    "akzidenz-grotesk-next",
                    "akzidenz-grotesk",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif"
                ],
                // Display — Scandia. Wordmark, H1, H2, eyebrow caps.
                // Never used for body copy.
                display: [
                    "scandia-web",
                    "scandia",
                    "Lexend Deca",
                    "Helvetica Neue",
                    "sans-serif"
                ],
                // Editorial voice — Cormorant italic. Used only ≥ text-3xl
                // standalone, or as inline emphasis inside a display line.
                serif: [
                    "Cormorant Garamond",
                    "EB Garamond",
                    "Garamond",
                    "serif"
                ]
            },
            fontSize: {
                'display': ['clamp(3.5rem, 12vw, 11rem)', { lineHeight: '0.88', letterSpacing: '-0.03em' }],
                'display-sm': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
                'editorial': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.25', letterSpacing: '-0.005em' }]
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'fade-up': 'fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
