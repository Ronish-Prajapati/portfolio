import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
        // Public site ("The Summit") type system.
        display: ['var(--font-display)', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Geist', 'system-ui', 'sans-serif'],
        label: ['var(--font-label)', 'Geist Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Public site palette, sampled from the rendered landscape.
        night: "rgb(var(--s-night) / <alpha-value>)",
        forest: {
          950: "rgb(var(--s-forest-950) / <alpha-value>)",
          900: "rgb(var(--s-forest-900) / <alpha-value>)",
          800: "rgb(var(--s-forest-800) / <alpha-value>)",
          700: "rgb(var(--s-forest-700) / <alpha-value>)",
        },
        moss: "rgb(var(--s-moss-600) / <alpha-value>)",
        sage: "rgb(var(--s-sage-400) / <alpha-value>)",
        fog: "rgb(var(--s-fog-200) / <alpha-value>)",
        snow: "rgb(var(--s-snow-50) / <alpha-value>)",
        ember: {
          DEFAULT: "rgb(var(--s-ember-400) / <alpha-value>)",
          light: "rgb(var(--s-ember-300) / <alpha-value>)",
          deep: "rgb(var(--s-ember-500) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        hero: {
          DEFAULT: "hsl(var(--hero-bg))",
          foreground: "hsl(var(--hero-foreground))",
          muted: "hsl(var(--hero-muted))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': 'var(--shadow-md)',
        'elevated': 'var(--shadow-lg)',
        'floating': 'var(--shadow-xl)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
