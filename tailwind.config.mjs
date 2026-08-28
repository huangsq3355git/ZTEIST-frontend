/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'zte-blue': '#008ED3',
        'zte-navy': '#2B333F',
        'zte-red': '#C9302C',
        // AIF 渲染配色：深藏青蓝底 + 翠青点缀
        ink: { DEFAULT: '#002544', soft: '#073453', light: '#0b4570' },
        jade: { DEFAULT: '#39A867', light: '#52c081', deep: '#2c8a52' },
        paper: '#E6EEF7',
        muted: '#A0B1C8',
      },
      fontFamily: {
        serif: ['Georgia', '"Noto Serif SC"', 'serif'],
      },
    },
  },
  plugins: [],
}
