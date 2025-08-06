import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // #f8fafc
        foreground: "hsl(var(--foreground))", // #1e293b
        primary: {
          DEFAULT: "hsl(var(--primary))", // #2563eb
          foreground: "hsl(var(--primary-foreground))", // #ffffff
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // #f59e42
          foreground: "hsl(var(--secondary-foreground))", // #1e293b
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // #f59e42
          foreground: "hsl(var(--accent-foreground))", // #1e293b
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))", // #64748b
        },
        card: {
          DEFAULT: "hsl(var(--card))", // #ffffff
          foreground: "hsl(var(--card-foreground))", // #1e293b
        },
        sidebar: {
          DEFAULT: "#1e293b",
        },
        success: {
          DEFAULT: "#22c55e",
        },
        warning: {
          DEFAULT: "#facc15",
        },
        danger: {
          DEFAULT: "#ef4444",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config