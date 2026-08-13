/** @type {import('tailwindcss').Config} */

// Wraps a CSS variable name so bg-paper-300/60 etc. can still stack an alpha
// channel on top — see the "R G B" triplet vars defined in src/index.css.
function withAlpha(variable) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        // Pure white overridden project-wide to a warm off-white surface tone —
        // every existing `bg-white` card automatically becomes warm ivory in
        // light mode, and a raised dark card surface in dark mode.
        white: withAlpha("--color-white"),

        // Legacy alias kept for existing `brand-*` call sites; now points at the
        // orange brand scale instead of the old blue. 50/100 are theme-adaptive
        // (they're used as light badge/chip tints); 200+ stay fixed since
        // they carry the actual accent color, which should read the same in
        // both themes.
        brand: {
          50: withAlpha("--color-orange-50"),
          100: withAlpha("--color-orange-100"),
          200: "#FBE0B6",
          300: "#F7C979",
          400: "#F2AA4C",
          500: "#E9952E",
          600: "#D97C17",
          700: "#B96214",
          800: "#934D17",
          900: "#783F17",
        },
        // Primary orange brand scale.
        orange: {
          50: withAlpha("--color-orange-50"),
          100: withAlpha("--color-orange-100"),
          200: "#FBE0B6",
          300: "#F7C979",
          400: "#F2AA4C",
          500: "#E9952E",
          600: "#D97C17",
          700: "#B96214",
          800: "#934D17",
          900: "#783F17",
        },
        // Brand dark / charcoal scale — sidebar, dark surfaces, primary text.
        ink: {
          50: "#D4D7DA",
          100: "#B0B7BD",
          200: "#8C969F",
          300: "#66717B",
          400: "#3C4854",
          500: "#34424F",
          600: "#273440",
          700: "#1B2530",
          800: "#151E27",
          900: "#101820",
          950: "#0B1117",
        },
        // Warm ivory surface scale — replaces cool-gray slate for backgrounds/borders.
        // Theme-adaptive: dark mode redeclares these same variables in index.css.
        paper: {
          50: withAlpha("--color-paper-50"),
          100: withAlpha("--color-paper-100"),
          200: withAlpha("--color-paper-200"),
          300: withAlpha("--color-paper-300"),
          400: withAlpha("--color-paper-400"),
          500: withAlpha("--color-paper-500"),
          600: withAlpha("--color-paper-600"),
          700: withAlpha("--color-paper-700"),
          800: withAlpha("--color-paper-800"),
        },
        // Body text scale — theme-adaptive (inverts under .dark).
        slate: {
          50: withAlpha("--color-slate-50"),
          100: withAlpha("--color-slate-100"),
          200: withAlpha("--color-slate-200"),
          300: withAlpha("--color-slate-300"),
          400: withAlpha("--color-slate-400"),
          500: withAlpha("--color-slate-500"),
          600: withAlpha("--color-slate-600"),
          700: withAlpha("--color-slate-700"),
          800: withAlpha("--color-slate-800"),
          900: withAlpha("--color-slate-900"),
          950: withAlpha("--color-slate-950"),
        },
        // Semantic status scales — theme-adaptive so light-tint badges (e.g.
        // bg-emerald-50 text-emerald-600) stay legible in dark mode.
        emerald: {
          50: withAlpha("--color-emerald-50"),
          100: withAlpha("--color-emerald-100"),
          500: withAlpha("--color-emerald-500"),
          600: withAlpha("--color-emerald-600"),
          700: withAlpha("--color-emerald-700"),
        },
        amber: {
          50: withAlpha("--color-amber-50"),
          100: withAlpha("--color-amber-100"),
          300: withAlpha("--color-amber-300"),
          500: withAlpha("--color-amber-500"),
          600: withAlpha("--color-amber-600"),
          700: withAlpha("--color-amber-700"),
          800: withAlpha("--color-amber-800"),
        },
        red: {
          50: withAlpha("--color-red-50"),
          100: withAlpha("--color-red-100"),
          200: withAlpha("--color-red-200"),
          300: withAlpha("--color-red-300"),
          400: withAlpha("--color-red-400"),
          500: withAlpha("--color-red-500"),
          600: withAlpha("--color-red-600"),
          700: withAlpha("--color-red-700"),
        },
        rose: {
          50: withAlpha("--color-rose-50"),
          100: withAlpha("--color-rose-100"),
          500: withAlpha("--color-rose-500"),
          600: withAlpha("--color-rose-600"),
          700: withAlpha("--color-rose-700"),
        },
        // Muted informational blue — used sparingly, never as brand/primary.
        // Theme-adaptive.
        info: {
          50: withAlpha("--color-info-50"),
          400: withAlpha("--color-info-400"),
          600: withAlpha("--color-info-600"),
          700: withAlpha("--color-info-700"),
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 32, 0.03)",
        "card-hover": "0 6px 18px rgba(16, 24, 32, 0.06), 0 1px 3px rgba(16, 24, 32, 0.04)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "14px",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.97) translateY(4px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 150ms ease-out",
        scaleIn: "scaleIn 180ms ease-out",
      },
    },
  },
  plugins: [],
}
