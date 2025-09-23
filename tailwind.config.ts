// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        avenir: ['var(--font-avenir)', 'sans-serif'],
        // Keep aleo as fallback if needed anywhere
        aleo: ['Aleo', 'serif'],
      },
      colors: {
        'wine': '#7F1D1D',
        
      },
      font:{
        'black': '900',
        'bolder': '800',
      }
    },
  },
  plugins: [],
};

export default config;
