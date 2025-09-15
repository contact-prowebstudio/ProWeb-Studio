import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  variants: {
    extend: {
      animation: ['motion-safe'],
    },
  },
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0066cc',
          600: '#004d99',
          700: '#003366',
          800: '#001a33',
          900: '#000d1a',
        },
        magenta: {
          400: '#ff00ff',
          500: '#cc00cc',
          600: '#990099',
        },
        cyan: {
          400: '#00ffff',
          500: '#00cccc',
          600: '#009999',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        bloom: 'bloom 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bloom: {
          '0%, 100%': {
            filter:
              'drop-shadow(0 0 8px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 20px rgba(0, 255, 255, 0.2))',
          },
          '50%': {
            filter:
              'drop-shadow(0 0 12px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(0, 255, 255, 0.4))',
          },
        },
      },
      typography: ({ theme }: { theme: any }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.slate.200'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.cyan.300'),
            '--tw-prose-bold': theme('colors.slate.100'),
            '--tw-prose-counters': theme('colors.slate.400'),
            '--tw-prose-bullets': theme('colors.cyan.400'),
            '--tw-prose-hr': theme('colors.slate.700'),
            '--tw-prose-quotes': theme('colors.slate.100'),
            '--tw-prose-quote-borders': theme('colors.slate.700'),
            '--tw-prose-captions': theme('colors.slate.400'),
            '--tw-prose-code': theme('colors.slate.100'),
            '--tw-prose-pre-bg': 'transparent',
            a: { textDecoration: 'none' },
            'a:hover': { textDecoration: 'underline' },
            'h1, h2, h3': { scrollMarginTop: '8rem' }, // anchor-friendly with sticky header
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
