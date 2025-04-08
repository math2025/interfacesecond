/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue
        secondary: "#9333ea", // purple
        accent: "#f59e0b",    // amber
        success: "#10b981",   // green
        danger: "#ef4444",    // red
      },
    },
  },

  plugins: [],
};
