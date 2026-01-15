import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2E5C55", // Deep Herbal Green
                    light: "#3E7A70",
                    dark: "#1F403B",
                },
                secondary: {
                    DEFAULT: "#F4F9F4", // Off-white/Mist
                    dark: "#E1EBE1",
                },
                tertiary: {
                    DEFAULT: "#D4AF37", // Classic Gold
                    light: "#E5C55E",
                    dark: "#AA8C2C",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-outfit)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "bg-pattern": "url('/pattern.png')", // Placeholder for a subtle background pattern
            },
        },
    },
    plugins: [],
};
export default config;
