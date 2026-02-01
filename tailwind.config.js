/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5C842',
        brown: {
          50: '#FAF5F0',
          100: '#F0E6D8',
          200: '#DCC9A8',
          300: '#C4A87A',
          400: '#A0785A',
          500: '#6B4226',
          600: '#4F3018',
          700: '#3B2A1A',
          800: '#2A1E12',
          900: '#1A120A'
        },
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAF8',
          100: '#F5F5F2',
          200: '#E8E8E4',
          300: '#D4D4D0',
          400: '#A3A3A0',
          500: '#6B6B6B',
          600: '#4B4B4B',
          700: '#333333',
          800: '#1A1A1A',
          900: '#0F0F0F'
        }
      }
    },
  },
  plugins: [],
}