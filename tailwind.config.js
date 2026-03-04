/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'melon-green': '#2D5A27',
        'melon-orange': '#FF8C42',
      }
    },
  },
  plugins: [],
}