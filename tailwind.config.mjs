/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'zte-blue': '#008ED3',
        'zte-navy': '#2B333F',
        'zte-red': '#C9302C',
      },
    },
  },
  plugins: [],
}
