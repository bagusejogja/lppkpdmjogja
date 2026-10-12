/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        muh: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#16a34a',
          600: '#15803d',
          700: '#055838', // signature Muhammadiyah green
          800: '#034129',
          900: '#022b1c',
          gold: '#d97706',
          'gold-light': '#fef3c7',
          'gold-dark': '#b45309'
        }
      }
    },
  },
  plugins: [],
};
