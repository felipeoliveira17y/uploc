/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          uploc: {
            bg: '#0f0f0f',
            card: '#161616',
            gold: '#C5A059',
            'gold-hover': '#A68546',
            input: '#1d1d1d',
            text: '#e5e5e5',
          },
        },
      },
    },
    plugins: [],
  }