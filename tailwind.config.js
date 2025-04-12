/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class", // Enables class-based dark mode toggling

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // Tailwind blue-600
        secondary: "#9333ea", // Tailwind purple-600
        accent: "#f59e0b",    // Tailwind amber-500
        success: "#10b981",   // Tailwind green-500
        danger: "#ef4444",    // Tailwind red-500
        surface: "#f9fafb",   // Light surface background
        "surface-dark": "#1e293b", // Dark surface background
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),      // Better default form elements
    require('@tailwindcss/typography'), // Rich content (e.g. rendered KaTeX/math)
  ],
};
