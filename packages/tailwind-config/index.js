/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Jost', 'var(--font-jost)', ...fontFamily.sans],
      arsenal: ['Arsenal', 'var(--font-arsenal)'],
      jost: ['Jost', 'var(--font-jost)'],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      dh1: ['1.625rem', { fontWeight: 700, lineHeight: '2rem' }],
      dh2: ['1.5rem', { lineHeight: '2rem' }],
      dh3: ['1.25rem', { lineHeight: '1.5rem' }],
      dh4: ['1.125rem', { lineHeight: '1.5rem' }],
      mh1: ['1.5rem', { fontWeight: 700, lineHeight: '1.875rem' }],
      mh2: ['1.25rem', { lineHeight: '1.75rem' }],
      mh3: ['1.125rem', { lineHeight: '1.5rem' }],
      mh4: ['1.0625rem', { lineHeight: '1.5rem' }],
      p: ['1rem', { lineHeight: '1.25rem' }],
      sp: ['0.875rem', { lineHeight: '1.25rem' }],
      c: ['0.75rem', { lineHeight: '1rem' }],
    },
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        100: '#E3C7F9',
        300: '#9A59E0',
        500: '#3D0099',
        700: '#22006E',
        900: '#110049',
      },
      secondary: {
        100: '#FFE6DC',
        300: '#FFA197',
        500: '#FF5362',
        700: '#B7294F',
        900: '#7A0F3F',
      },
      success: {
        100: '#E9FBD1',
        300: '#A7EB72',
        500: '#4CBF1C',
        700: '#23880E',
        900: '#075B05',
      },
      info: {
        100: '#DEFCFE',
        300: '#9DE6F5',
        500: '#59B6DF',
        700: '#2B6D9F',
        900: '#11366A',
      },
      warn: {
        100: '#FCF5C9',
        300: '#F1D45F',
        500: '#D19C00',
        700: '#956900',
        900: '#634000',
      },
      error: {
        100: '#FCDBC9',
        300: '#EE785F',
        500: '#C70000',
        700: '#8F0018',
        900: '#5F0021',
      },
      grey: {
        100: '#F9FAFB',
        200: '#F6F6F6',
        300: '#F1F1F1',
        400: '#D6D6D6', // divider
        500: '#BBBBBB',
        600: '#B0B0B0', // text disabled
        700: '#515151', // text secondary
        800: '#393939',
        900: '#1B1B1B', // text primary
      },
      brand: {
        50: 'var(--color-brand-50)',
        100: 'var(--color-brand-100)',
        200: 'var(--color-brand-200)',
        300: 'var(--color-brand-300)',
        400: 'var(--color-brand-400)',
        500: 'var(--color-brand-500)',
        600: 'var(--color-brand-600)',
        700: 'var(--color-brand-700)',
        800: 'var(--color-brand-800)',
        900: 'var(--color-brand-900)',
      },
      informational: {
        100: '#CBF6FD',
        800: '#0289DD',
        900: '#00286A',
      },
    },
    extend: {
      spacing: {
        18: '4.5rem',
        21: '5.25rem',
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
      backgroundImage: {
        'background-gradient': 'linear-gradient(116.48deg, white, var(--color-brand-100))',
        'carousel-gradient': 'linear-gradient(180deg,rgba(0, 0, 0, 0) 52.97%,rgba(0, 0, 0, 0.99) 78.35%)',
        'upper-mask': 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 27.08%)',
        'lower-mask': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 55.61%, rgba(0, 0, 0, 0.65) 84.37%)',
      },
      backgroundColor: {
        'athens-grey': '#F4F6F8',
      },
      transitionDuration: {
        600: '600ms',
      },
      boxShadow: {
        'light-card': '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
        'top':
          '0px 1px 10px 0px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('tailwindcss-animate')],
};
