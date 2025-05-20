/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6A2C70',
          light: '#F1E4F3',
          dark: '#4A1D4E',
        },
        accent1: {
          DEFAULT: '#E84A5F',
          light: '#FDEAED',
          dark: '#B83A4B',
        },
        accent2: {
          DEFAULT: '#2A9D8F',
          light: '#E6F5F3',
          dark: '#1F756B',
        },
        accent3: {
          DEFAULT: '#F9C74F',
          light: '#FEF8E8',
          dark: '#E5A913',
        },
        accent4: {
          DEFAULT: '#577590',
          light: '#EBF0F4',
          dark: '#3F5368',
        },
      },
    },
  },
  plugins: [],
}
