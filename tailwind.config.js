/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F4FE",
          100: "#C0E3FC",
          200: "#96D1FA",
          300: "#6CBFF8",
          400: "#4DB2F6",
          500: "#2EA5F4",
          600: "#1E96E5",
          700: "#1282D0",
          800: "#096FBB",
          900: "#004D94",
        },
        secondary: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107",
          600: "#FFB300",
          700: "#FFA000",
          800: "#FF8F00",
          900: "#FF6F00",
        },
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        dark: "#1A1A2E",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter"],
        heading: ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
