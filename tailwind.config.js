/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          900: '#0a0a0f',
          800: '#0d0d16',
          700: '#11111e',
          600: '#161628',
          500: '#1c1c32',
          400: '#22223c',
          300: '#2a2a48',
          200: '#333358',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%236366f1' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow-sm':      '0 0 12px rgba(99,102,241,0.35)',
        'glow-md':      '0 0 24px rgba(99,102,241,0.45)',
        'glow-lg':      '0 0 48px rgba(99,102,241,0.35)',
        'glow-cyan':    '0 0 24px rgba(6,182,212,0.4)',
        'glow-emerald': '0 0 24px rgba(16,185,129,0.4)',
        'glass':        '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card':         '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
