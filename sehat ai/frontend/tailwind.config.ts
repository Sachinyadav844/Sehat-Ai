import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effcf6',
          100: '#c6f7e8',
          200: '#8eedce',
          300: '#43d9ad',
          400: '#22b8a3',
          500: '#0f766e',
          600: '#115e59',
          700: '#134e4a',
          800: '#0f3d3a',
          900: '#0a2a29',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
