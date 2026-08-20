import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#2567EC',
          600: '#1D5BD6',
          700: '#174EB8',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#475569',
          700: '#334155',
          900: '#0F172A',
        },
        success: {
          50:  '#F0FDF4',
          500: '#22C55E',
        },
        warning: {
          50:  '#FFFBEB',
          500: '#F59E0B',
        },
        error: {
          50:  '#FEF2F2',
          500: '#EF4444',
        },
        info: {
          50:  '#EFF6FF',
          500: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-2xl': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-xl':  ['1.5rem',   { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg':  ['1.25rem',  { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md':  ['1rem',     { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':     ['1rem',     { lineHeight: '1.5', fontWeight: '400' }],
        'body-md':     ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm':     ['0.75rem',  { lineHeight: '1.5', fontWeight: '400' }],
        'label-md':    ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm':    ['0.75rem',  { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'space-1':  '4px',
        'space-2':  '8px',
        'space-3':  '12px',
        'space-4':  '16px',
        'space-5':  '20px',
        'space-6':  '24px',
        'space-8':  '32px',
        'space-10': '40px',
        'space-12': '48px',
        'space-16': '64px',
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        'full': '9999px',
      },
      boxShadow: {
        // DESIGN DEBT: exact values unverified — confirm from foundations.pdf before production
        'sm': '0 1px 3px rgba(0,0,0,0.08)',
        'md': '0 4px 12px rgba(0,0,0,0.12)',
        'lg': '0 8px 24px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
}

export default config
