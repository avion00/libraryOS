/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        // Pure white overridden project-wide to a warm off-white surface tone —
        // every existing `bg-white` card automatically becomes warm ivory instead
        // of clinical #FFFFFF, per the LibraryOS brand system.
        white: "#FCFBF8",

        // Legacy alias kept for existing `brand-*` call sites; now points at the
        // orange brand scale instead of the old blue.
        brand: {
          50: "#FFF8EE",
          100: "#FDEFD9",
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
          50: "#FFF8EE",
          100: "#FDEFD9",
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
        paper: {
          50: "#FFFDF9",
          100: "#FCFBF8",
          200: "#F9F7F3",
          300: "#F7F5F1",
          400: "#F3F0EA",
          500: "#F2EEE6",
          600: "#EDE9E2",
          700: "#E5E0D7",
          800: "#D5CEC2",
        },
        // Muted informational blue — used sparingly, never as brand/primary.
        info: {
          50: "#EDF5FC",
          400: "#5B93C7",
          600: "#3978B8",
          700: "#2E5F93",
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
