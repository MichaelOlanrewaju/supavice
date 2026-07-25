/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Sampled from the Supavice logo. The pure brand tones are too light
           for text (#00CCFF scores 1.8:1 on white), so darker steps carry
           anything with words in it. */
        brand: {
          DEFAULT: '#00CCFF',
          600: '#0091C2',
          700: '#0077A3',
          800: '#005E82',
          900: '#00415C',
          wash: 'rgba(0, 204, 255, 0.10)',
        },
        rx: {
          DEFAULT: '#FF0000',
          600: '#D40000',
          700: '#B80000',
          wash: 'rgba(255, 0, 0, 0.07)',
        },
        ink: {
          DEFAULT: '#071A2E',
          soft: '#4A6076',
          mute: '#8A9BAB',
        },
        paper: '#F6F9FC',
        line: '#E3EAF2',
        accent: '#00CCFF',
        /* status colours for the admin dashboard */
        ok: { DEFAULT: '#0E9F6E', bg: '#E7F6EF', border: '#B7E4CE' },
        warn: { DEFAULT: '#B45309', bg: '#FEF3E2', border: '#F5D9A8' },
        info: { DEFAULT: '#3457D5', bg: '#EAEEFB', border: '#C3CFF5' },
      },
      fontFamily: {
        display: ['"Clash Display"', 'Georgia', 'ui-serif', 'serif'],
        body: ['Satoshi', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        /* tighter tracking as size increases — the premium tell */
        'display-xl': ['clamp(2.75rem, 6vw, 5.25rem)', { lineHeight: '0.94', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-lg': ['clamp(2.25rem, 4.6vw, 3.75rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-md': ['clamp(1.75rem, 3.2vw, 2.625rem)', { lineHeight: '1.04', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-sm': ['clamp(1.375rem, 2.2vw, 1.75rem)', { lineHeight: '1.12', letterSpacing: '-0.022em', fontWeight: '600' }],
      },
      spacing: {
        section: 'clamp(3.5rem, 8vw, 7rem)',
        'section-sm': 'clamp(2.5rem, 5vw, 4rem)',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(7,26,46,.05)',
        card: '0 1px 2px rgba(7,26,46,.05), 0 12px 32px -16px rgba(7,26,46,.22)',
        lift: '0 2px 4px rgba(7,26,46,.06), 0 24px 48px -20px rgba(7,26,46,.28)',
        press: '0 3px 0 #005E82',
        'press-sm': '0 1.5px 0 #005E82',
        'press-rx': '0 3px 0 #B80000',
        'press-rx-sm': '0 1.5px 0 #B80000',
        glow: '0 0 0 4px rgba(0,204,255,.16)',
      },
      borderRadius: { sm: '7px', md: '14px', lg: '22px', xl: '30px' },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideProgress: { '0%': { width: '0%' }, '100%': { width: '100%' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .55s cubic-bezier(.16,1,.3,1) both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [],
}
