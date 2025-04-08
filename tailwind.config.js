/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class", // ✅ Enable class-based dark mode

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue
        secondary: "#9333ea", // purple
        accent: "#f59e0b",    // amber
        success: "#10b981",   // green
        danger: "#ef4444",    // red
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),  // Optional: improves form input styles
    require('@tailwindcss/typography'), // Optional: useful for content styling
  ],
};
